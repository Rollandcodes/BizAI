import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getOpenAIClient, buildSystemPrompt, extractLead, NICHE_PROMPTS } from "@/lib/ai";

// ─── Config helpers ────────────────────────────────────────────────────────────
function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
const verifyToken  = () => str(process.env.WHATSAPP_VERIFY_TOKEN);
const accessToken  = () => str(process.env.WHATSAPP_ACCESS_TOKEN);
const graphVersion = () => str(process.env.WHATSAPP_GRAPH_API_VERSION) || "v21.0";
const defaultBizId = () => str(process.env.WHATSAPP_DEFAULT_BUSINESS_ID);

function adminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// ─── Business lookup ──────────────────────────────────────────────────────────
type BusinessRow = {
  id: string; business_name: string | null; business_type: string | null;
  system_prompt: string | null; whatsapp_phone_number_id: string | null;
  pricing_info: string | null; common_questions_text: string | null;
  additional_info: string | null;
  custom_faqs: Array<{ question: string; answer: string }> | null;
};

async function resolveBusiness(phoneNumberId: string | null): Promise<BusinessRow | null> {
  const supabase = adminClient();

  if (phoneNumberId) {
    const { data } = await supabase
      .from("businesses")
      .select("id,business_name,business_type,system_prompt,whatsapp_phone_number_id,pricing_info,common_questions_text,additional_info,custom_faqs")
      .eq("whatsapp_phone_number_id", phoneNumberId)
      .maybeSingle();
    if (data) return data as BusinessRow;
  }

  const fallbackId = defaultBizId();
  if (!fallbackId) return null;

  const { data } = await supabase
    .from("businesses")
    .select("id,business_name,business_type,system_prompt,whatsapp_phone_number_id,pricing_info,common_questions_text,additional_info,custom_faqs")
    .eq("id", fallbackId)
    .maybeSingle();
  return (data as BusinessRow | null) ?? null;
}

// ─── Idempotency ──────────────────────────────────────────────────────────────
async function alreadyProcessed(messageId: string): Promise<boolean> {
  const { data } = await adminClient().from("whatsapp_message_events").select("id").eq("whatsapp_message_id", messageId).maybeSingle();
  return Boolean(data?.id);
}

// ─── Conversation upsert ──────────────────────────────────────────────────────
async function upsertConversation(businessId: string, sessionId: string, customerPhone: string, customerName: string | null, newMsg: { role: "user" | "assistant"; content: string }) {
  const supabase = adminClient();
  const { data: existing } = await supabase.from("conversations").select("id,messages,customer_name").eq("business_id", businessId).eq("session_id", sessionId).maybeSingle();
  const history = Array.isArray(existing?.messages) ? existing.messages : [];
  const messages = [...history, newMsg];

  if (existing?.id) {
    await supabase.from("conversations").update({
      messages, channel: "whatsapp",
      customer_name: customerName ?? existing.customer_name,
      customer_phone: customerPhone,
    }).eq("id", existing.id);
  } else {
    await supabase.from("conversations").insert({
      business_id: businessId, session_id: sessionId, messages, channel: "whatsapp",
      customer_name: customerName, customer_phone: customerPhone,
      lead_captured: Boolean(customerName && customerPhone),
    });
  }
  return messages;
}

// ─── Log WhatsApp event ────────────────────────────────────────────────────────
async function logEvent(params: {
  businessId: string; sessionId: string; direction: "inbound" | "outbound";
  messageId: string; from: string; toPhoneId: string; body: string;
  payload: unknown; status?: string; errorMsg?: string;
}) {
  await adminClient().from("whatsapp_message_events").insert({
    business_id: params.businessId, session_id: params.sessionId, direction: params.direction,
    whatsapp_message_id: params.messageId, from_number: params.from,
    to_phone_number_id: params.toPhoneId, body_text: params.body,
    payload: params.payload, delivery_status: params.status ?? null, error_message: params.errorMsg ?? null,
  }).single();
}

// ─── Send WhatsApp message ─────────────────────────────────────────────────────
async function sendWAText(phoneNumberId: string, to: string, body: string): Promise<{ ok: boolean; messageId: string | null }> {
  const token = accessToken();
  if (!token) return { ok: false, messageId: null };

  const res = await fetch(`https://graph.facebook.com/${graphVersion()}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, text: { body } }),
  });
  const data = await res.json() as { messages?: Array<{ id?: string }> };
  return { ok: res.ok, messageId: data.messages?.[0]?.id ?? null };
}

// ─── Webhook verify (GET) ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === verifyToken()) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// ─── Webhook receive (POST) ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    // Handle delivery status updates
    const statuses = (body?.entry as unknown[])?.flatMap((e: unknown) =>
      ((e as { changes?: unknown[] })?.changes ?? []).flatMap((c: unknown) =>
        ((c as { value?: { statuses?: unknown[] } })?.value?.statuses ?? [])
      )
    ) ?? [];
    if (statuses.length > 0) {
      // Process delivery updates (non-blocking — best-effort)
      for (const s of statuses) {
        const status = s as { id?: string; status?: string; recipient_id?: string };
        if (status.id) {
          await adminClient().from("whatsapp_message_events")
            .update({ delivery_status: status.status ?? null })
            .eq("whatsapp_message_id", status.id);
        }
      }
      return NextResponse.json({ received: true, type: "status_update" });
    }

    // Handle inbound messages
    const messages = (body?.entry as unknown[])?.flatMap((e: unknown) =>
      ((e as { changes?: unknown[] })?.changes ?? []).flatMap((c: unknown) =>
        ((c as { value?: { messages?: unknown[] } })?.value?.messages ?? [])
      )
    ) ?? [];

    for (const raw of messages) {
      const msg = raw as { id?: string; from?: string; text?: { body?: string }; type?: string; timestamp?: string };
      const inboundText = msg.text?.body?.trim();
      if (!inboundText || !msg.from || !msg.id) continue;

      // Get phone number ID from the change value
      const phoneNumberId = (body?.entry as unknown[])?.flatMap((e: unknown) =>
        ((e as { changes?: unknown[] })?.changes ?? []).map((c: unknown) =>
          (c as { value?: { metadata?: { phone_number_id?: string } } })?.value?.metadata?.phone_number_id
        )
      ).find(Boolean) ?? null;

      // Idempotency check
      if (await alreadyProcessed(msg.id)) continue;

      const business = await resolveBusiness(phoneNumberId ?? null);
      if (!business) continue;

      const sessionId = `wa:${msg.from}`;
      const phoneId   = business.whatsapp_phone_number_id ?? phoneNumberId ?? "";

      // Log inbound event
      await logEvent({
        businessId: business.id, sessionId, direction: "inbound",
        messageId: msg.id, from: msg.from, toPhoneId: phoneId,
        body: inboundText, payload: raw,
      });

      // Upsert conversation with user message
      const history = await upsertConversation(business.id, sessionId, msg.from, null, { role: "user", content: inboundText });

      // Build AI reply using centralized lib/ai.ts
      const systemPrompt = buildSystemPrompt({
        businessName: business.business_name ?? "this business",
        niche: business.business_type ?? "default",
        customSystemPrompt: business.system_prompt,
        pricingInfo: business.pricing_info,
        commonQuestionsText: business.common_questions_text,
        additionalInfo: business.additional_info,
        customFaqs: business.custom_faqs ?? [],
      });

      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-12) as Array<{ role: "user" | "assistant"; content: string }>,
        ],
        max_tokens: 350,
        temperature: 0.5,
      });

      const rawReply = completion.choices[0]?.message?.content ?? "";
      const { cleanMessage, leadCaptured, customerName, customerPhone } = extractLead(rawReply);
      const replyText = cleanMessage || "Thank you for your message. Our team will get back to you shortly.";

      // Update conversation with AI reply
      await upsertConversation(business.id, sessionId, msg.from, customerName, { role: "assistant", content: replyText });

      // Update lead status if captured
      if (leadCaptured && customerName) {
        await adminClient().from("conversations")
          .update({ lead_captured: true, customer_name: customerName, customer_phone: customerPhone ?? msg.from })
          .eq("business_id", business.id).eq("session_id", sessionId);
      }

      // Send reply via WhatsApp API
      if (phoneId) {
        const sent = await sendWAText(phoneId, msg.from, replyText);
        if (sent.messageId) {
          await logEvent({
            businessId: business.id, sessionId, direction: "outbound",
            messageId: sent.messageId, from: phoneId, toPhoneId: msg.from,
            body: replyText, payload: { to: msg.from, body: replyText },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[whatsapp webhook]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
