import { NextRequest, NextResponse } from "next/server";
import { assertSupabaseConfig, createServerClient } from "@/lib/supabase";
import { getAuthenticatedUser, hasAgencyAccess, normalizeEmail } from "@/lib/clerk-auth";

const supabase = createServerClient();

const SAFE_UPDATE_FIELDS = new Set([
  "business_name",
  "business_type",
  "owner_name",
  "whatsapp",
  "whatsapp_phone_number_id",
  "website",
  "widget_color",
  "widget_position",
  "welcome_message",
  "business_hours",
  "languages",
  "pricing_info",
  "common_questions_text",
  "additional_info",
  "custom_faqs",
  "system_prompt",
]);

function pickSafeUpdates(updates: Record<string, unknown>) {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (!SAFE_UPDATE_FIELDS.has(key) || value === undefined) {
      continue;
    }
    normalized[key] = value;
  }

  return normalized;
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    assertSupabaseConfig();

    const { searchParams } = new URL(req.url);
    const requestedEmail = normalizeEmail(searchParams.get("email"));
    const businessId = searchParams.get("businessId")?.trim();
    const targetEmail = requestedEmail ?? authUser.email;

    if (requestedEmail && requestedEmail !== authUser.email && !hasAgencyAccess(authUser.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!businessId && !targetEmail) {
      return NextResponse.json({ error: "email or businessId required" }, { status: 400 });
    }

    const query = supabase
      .from("businesses")
      .select("id,owner_email,business_name,business_type,owner_name,whatsapp,whatsapp_phone_number_id,website,widget_color,widget_position,welcome_message,business_hours,languages,pricing_info,common_questions_text,additional_info,custom_faqs,onboarding_complete,plan,plan_expires_at,paypal_subscription_id,system_prompt,referral_code,message_count_month");

    const { data: business, error } = businessId
      ? await query.eq("id", businessId).single()
      : await query.eq("owner_email", targetEmail).single();

    if (error || !business) {
      return NextResponse.json({ business: null, error: "No account found" }, { status: 404 });
    }

    if (!hasAgencyAccess(authUser.email) && business.owner_email !== authUser.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [convResult, monthlyResult] = await Promise.all([
      supabase
        .from("conversations")
        .select("id,lead_captured", { count: "exact" })
        .eq("business_id", business.id),
      supabase
        .from("conversations")
        .select("id", { count: "exact" })
        .eq("business_id", business.id)
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    ]);

    const totalConversations = convResult.count ?? 0;
    const leadsCaptured = (convResult.data ?? []).filter((conversation) => conversation.lead_captured).length;
    const monthlyConversations = monthlyResult.count ?? 0;

    const { data: conversations } = await supabase
      .from("conversations")
      .select("id,created_at,customer_name,customer_phone,channel,lead_captured,lead_contacted,messages")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(100);

    const leads = (conversations ?? []).filter((conversation) => conversation.lead_captured);

    const { data: whatsappEvents } = await supabase
      .from("whatsapp_message_events")
      .select("id,session_id,direction,whatsapp_message_id,from_number,body_text,delivery_status,error_message,created_at")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      business: {
        ...business,
        customInstructions: business.system_prompt,
        customFaqs: business.custom_faqs ?? [],
      },
      agencyAccess: hasAgencyAccess(authUser.email),
      stats: {
        totalConversations,
        leadsCaptured,
        monthlyConversations,
        monthlyMessages: business.message_count_month ?? 0,
      },
      conversations: conversations ?? [],
      leads,
      whatsappEvents: whatsappEvents ?? [],
    });
  } catch (err) {
    console.error("[business GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    assertSupabaseConfig();

    const body = (await req.json()) as Record<string, unknown>;
    const businessId = typeof body.businessId === "string" ? body.businessId.trim() : "";
    const requestedEmail = normalizeEmail(typeof body.email === "string" ? body.email : null);
    const updates = pickSafeUpdates(body);

    if (!businessId && !requestedEmail) {
      return NextResponse.json({ error: "businessId or email required" }, { status: 400 });
    }

    if (requestedEmail && requestedEmail !== authUser.email && !hasAgencyAccess(authUser.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
    }

    const lookupQuery = supabase
      .from("businesses")
      .select("id,owner_email")
      .limit(1);

    const { data: business, error: lookupError } = businessId
      ? await lookupQuery.eq("id", businessId).single()
      : await lookupQuery.eq("owner_email", requestedEmail ?? authUser.email).single();

    if (lookupError || !business) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    if (!hasAgencyAccess(authUser.email) && business.owner_email !== authUser.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("businesses")
      .update(updates)
      .eq("id", business.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ business: data });
  } catch (err) {
    console.error("[business PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
