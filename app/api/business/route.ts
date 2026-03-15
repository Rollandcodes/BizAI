import { NextRequest, NextResponse } from "next/server";
import { assertSupabaseConfig, createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

function getAgencyEmails(): string[] {
  return (process.env.AGENCY_ALLOWED_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

function hasAgencyAccess(email?: string | null): boolean {
  if (!email) return false;
  return getAgencyEmails().includes(email.trim().toLowerCase());
}

export async function GET(req: NextRequest) {
  try {
    assertSupabaseConfig();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const businessId = searchParams.get("businessId")?.trim();

    if (!email && !businessId) {
      return NextResponse.json({ error: "email or businessId required" }, { status: 400 });
    }

    // Fetch business
    const query = supabase
      .from("businesses")
      .select("id,owner_email,business_name,business_type,owner_name,whatsapp,whatsapp_phone_number_id,website,widget_color,widget_position,welcome_message,business_hours,languages,pricing_info,common_questions_text,additional_info,custom_faqs,onboarding_complete,plan,plan_expires_at,paypal_subscription_id,system_prompt,referral_code,message_count_month");

    const { data: business, error } = businessId
      ? await query.eq("id", businessId).single()
      : await query.eq("owner_email", email!).single();

    if (error || !business) {
      return NextResponse.json({ business: null, error: "No account found" }, { status: 404 });
    }

    // Stats
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
    const leadsCaptured = (convResult.data ?? []).filter(c => c.lead_captured).length;
    const monthlyConversations = monthlyResult.count ?? 0;

    // Conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id,created_at,customer_name,customer_phone,channel,lead_captured,lead_contacted,messages")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(100);

    // Leads
    const leads = (conversations ?? []).filter(c => c.lead_captured);

    // WhatsApp events
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
      agencyAccess: hasAgencyAccess(business.owner_email),
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
    const body = await req.json() as Record<string, unknown>;
    const { businessId, email, ...updates } = body as { businessId?: string; email?: string } & Record<string, unknown>;

    if (!businessId && !email) {
      return NextResponse.json({ error: "businessId or email required" }, { status: 400 });
    }

    const query = supabase.from("businesses").update(updates);
    const { data, error } = businessId
      ? await query.eq("id", businessId).select().single()
      : await query.eq("owner_email", (email as string).toLowerCase()).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ business: data });
  } catch (err) {
    console.error("[business PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
