import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "./cors";
import {
  getOpenAIClient,
  buildSystemPrompt,
  selectModel,
  extractLead,
  isRateLimited,
  classifyError,
  DEGRADED_MESSAGES,
} from "@/lib/ai";
import { PLAN_MESSAGE_LIMITS } from "@/lib/plans";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { status: "BizAI Chat API v2.0", ts: new Date().toISOString() },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages?: Array<{ role: "user" | "assistant"; content: string }>;
      message?: string;
      businessId?: string;
      sessionId?: string;
      businessType?: string;
      niche?: string;
      systemPrompt?: string;
      businessName?: string;
    };

    const {
      messages: rawMessages,
      message: singleMessage,
      businessId,
      sessionId,
      businessType,
      niche,
      systemPrompt: customSystemPrompt,
      businessName = "this business",
    } = body;

    // Normalize messages
    const messages = Array.isArray(rawMessages)
      ? rawMessages
      : typeof singleMessage === "string" && singleMessage.trim()
      ? [{ role: "user" as const, content: singleMessage.trim() }]
      : null;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array or message string required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    const rlKey = businessId ? `biz:${businessId}` : `ip:${ip}`;
    if (isRateLimited(rlKey, 20)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429, headers: corsHeaders }
      );
    }

    // Load business config and check plan quota
    const supabase = adminClient();
    let businessConfig: {
      id: string;
      business_name: string;
      business_type: string | null;
      system_prompt: string | null;
      pricing_info: string | null;
      common_questions_text: string | null;
      additional_info: string | null;
      custom_faqs: Array<{ question: string; answer: string }> | null;
      plan: string;
      message_count_month: number | null;
      is_active: boolean | null;
    } | null = null;

    if (businessId) {
      const { data } = await supabase
        .from("businesses")
        .select("id,business_name,business_type,system_prompt,pricing_info,common_questions_text,additional_info,custom_faqs,plan,message_count_month,is_active")
        .eq("id", businessId)
        .single();
      businessConfig = data;
    }

    // Plan quota check
    if (businessConfig) {
      if (businessConfig.is_active === false) {
        return NextResponse.json(
          { error: "This AI assistant is currently inactive." },
          { status: 403, headers: corsHeaders }
        );
      }
      const limit = PLAN_MESSAGE_LIMITS[businessConfig.plan] ?? 100;
      const used = businessConfig.message_count_month ?? 0;
      if (limit !== null && used >= limit) {
        return NextResponse.json(
          {
            message: "Monthly message limit reached. Please upgrade your plan to continue.",
            degraded: true,
            upgradeRequired: true,
          },
          { status: 200, headers: corsHeaders }
        );
      }
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      businessName: businessConfig?.business_name ?? businessName,
      niche: businessConfig?.business_type ?? niche ?? businessType ?? "default",
      customSystemPrompt: businessConfig?.system_prompt ?? customSystemPrompt,
      pricingInfo: businessConfig?.pricing_info,
      commonQuestionsText: businessConfig?.common_questions_text,
      additionalInfo: businessConfig?.additional_info,
      customFaqs: businessConfig?.custom_faqs ?? [],
    });

    // AI call
    const openai = getOpenAIClient();
    const model = selectModel(messages);
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20), // cap context at 20 turns
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const rawMessage = completion.choices[0]?.message?.content ?? "";
    const { leadCaptured, customerName, customerPhone, cleanMessage } = extractLead(rawMessage);

    // Persist conversation (non-blocking)
    if (businessId && sessionId) {
      void (async () => {
        try {
          const allMessages = [...messages, { role: "assistant" as const, content: cleanMessage }];
          const { data: existing } = await supabase
            .from("conversations")
            .select("id")
            .eq("session_id", sessionId)
            .eq("business_id", businessId)
            .single();

          if (existing) {
            await supabase
              .from("conversations")
              .update({
                messages: allMessages,
                ...(leadCaptured && {
                  lead_captured: true,
                  customer_name: customerName,
                  customer_phone: customerPhone,
                }),
              })
              .eq("id", existing.id);
          } else {
            await supabase.from("conversations").insert({
              business_id: businessId,
              session_id: sessionId,
              messages: allMessages,
              lead_captured: leadCaptured,
              customer_name: customerName,
              customer_phone: customerPhone,
              channel: "web",
            });
          }

          // Increment usage counter
          await supabase.rpc("increment_message_count", { p_business_id: businessId }).single();
        } catch (err) {
          console.error("[chat] DB error:", err);
        }
      })();
    }

    return NextResponse.json(
      { message: cleanMessage, leadCaptured, customerName, customerPhone, model },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number; code?: string };
    console.error("[chat] error:", error);

    const degraded = classifyError(error);
    if (degraded) {
      return NextResponse.json(
        { message: DEGRADED_MESSAGES[degraded], degraded: true, degradedReason: degraded },
        { status: 200, headers: corsHeaders }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "AI rate limit reached. Please try again shortly." },
        { status: 429, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "AI service temporarily unavailable." },
      { status: 503, headers: corsHeaders }
    );
  }
}
