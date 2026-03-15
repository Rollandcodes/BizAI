import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type JsonMap = Record<string, unknown>;
type BusinessPlan = "trial" | "basic" | "starter" | "pro" | "business";
const PLAN_EXPIRY_DAYS = 31;
const PAYPAL_TOKEN_TTL_MS = 8 * 60 * 1000;

let paypalTokenCache: { token: string; expiresAt: number } | null = null;

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

function obj(v: unknown): JsonMap {
  return v && typeof v === "object" ? (v as JsonMap) : {};
}

async function getPayPalToken(): Promise<string> {
  const now = Date.now();
  if (paypalTokenCache && now < paypalTokenCache.expiresAt) {
    return paypalTokenCache.token;
  }

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json() as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("No PayPal token");

  const ttlMs = Math.max(30_000, Math.min(PAYPAL_TOKEN_TTL_MS, (data.expires_in ?? 300) * 1000 - 15_000));
  paypalTokenCache = {
    token: data.access_token,
    expiresAt: now + ttlMs,
  };

  return data.access_token;
}

async function verifyWebhookSignature(req: NextRequest, body: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const transmId   = req.headers.get("paypal-transmission-id");
  const transmTime = req.headers.get("paypal-transmission-time");
  const transmSig  = req.headers.get("paypal-transmission-sig");
  const authAlgo   = req.headers.get("paypal-auth-algo");
  const certUrl    = req.headers.get("paypal-cert-url");

  if (!transmId || !transmTime || !transmSig || !authAlgo || !certUrl) return false;

  try {
    const token = await getPayPalToken();
    const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmId,
        transmission_sig: transmSig,
        transmission_time: transmTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });
    const data = await res.json() as { verification_status?: string };
    return data.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}

function extractPlan(resource: JsonMap): BusinessPlan | undefined {
  const candidates = [str(resource.plan_id), str(resource.custom), str(resource.custom_id)]
    .filter(Boolean).map(s => s!.toLowerCase());
  for (const c of candidates) {
    if (c.includes("business")) return "business";
    if (c.includes("pro")) return "pro";
    if (c.includes("starter") || c.includes("basic")) return "basic";
  }
  return undefined;
}

function extractEmails(resource: JsonMap): string[] {
  return [
    str(resource.custom_id), str(resource.custom),
    str(obj(resource.subscriber).email_address),
    str(obj(resource.payer).email_address),
  ].filter(Boolean).map(s => s!.toLowerCase());
}

function extractSubscriptionId(resource: JsonMap): string | undefined {
  const relatedIds = obj(obj(resource.supplementary_data).related_ids);
  return str(resource.id) ?? str(resource.billing_agreement_id) ?? str(relatedIds.billing_subscription_id);
}

function planExpiry(resource: JsonMap): string {
  const billingInfo = obj(resource.billing_info);
  const next = str(billingInfo.next_billing_time);
  if (next) return next;
  const d = new Date();
  d.setDate(d.getDate() + PLAN_EXPIRY_DAYS);
  return d.toISOString();
}

async function applyEvent(eventType: string, resource: JsonMap) {
  const supabase = admin();
  const subscriptionId = extractSubscriptionId(resource);
  const emails = extractEmails(resource);
  const plan = extractPlan(resource);

  // Find business
  let businessId: string | null = null;
  if (subscriptionId) {
    const { data } = await supabase.from("businesses").select("id").eq("paypal_subscription_id", subscriptionId).maybeSingle();
    businessId = data?.id ?? null;
  }
  if (!businessId && emails.length > 0) {
    for (const email of emails) {
      const { data } = await supabase.from("businesses").select("id").eq("owner_email", email).maybeSingle();
      if (data?.id) { businessId = data.id; break; }
    }
  }

  if (!businessId) return { applied: false, reason: "No matching business" };

  const patch: Record<string, unknown> = { paypal_subscription_id: subscriptionId };

  switch (eventType) {
    case "BILLING.SUBSCRIPTION.CREATED":
    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED":
    case "PAYMENT.SALE.COMPLETED":
      if (plan) patch.plan = plan;
      patch.plan_expires_at = planExpiry(resource);
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
      patch.plan = "trial";
      patch.plan_expires_at = new Date().toISOString();
      break;
    case "BILLING.SUBSCRIPTION.SUSPENDED":
      patch.plan = "trial";
      break;
    default:
      return { applied: false, reason: `Unhandled: ${eventType}` };
  }

  const { error } = await supabase.from("businesses").update(patch).eq("id", businessId);
  if (error) throw new Error(`DB update failed: ${error.message}`);
  return { applied: true, businessId };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody) as { id?: string; event_type?: string; resource?: JsonMap };
    const eventType = str(event.event_type);

    if (!eventType) return NextResponse.json({ error: "Missing event_type" }, { status: 400 });

    const isValid = await verifyWebhookSignature(req, rawBody);
    if (!isValid) {
      console.warn("[paypal-webhook] Invalid signature for event:", event.id);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // Idempotency check
    const supabase = admin();
    const eventId = str(event.id);
    if (eventId) {
      const { error: insertErr } = await supabase.from("paypal_webhook_events").insert({
        event_id: eventId,
        event_type: eventType,
        payload: event,
      });
      if (insertErr?.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      if (insertErr && insertErr.code !== "42P01") {
        throw new Error(`Idempotency insert failed: ${insertErr.message}`);
      }
    }

    const result = await applyEvent(eventType, obj(event.resource));
    console.log("[paypal-webhook]", { id: event.id, eventType, ...result });

    return NextResponse.json({ received: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[paypal-webhook]", message);
    return NextResponse.json({ error: "Webhook processing failed", details: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "CypAI PayPal webhook", method: "POST required" });
}
