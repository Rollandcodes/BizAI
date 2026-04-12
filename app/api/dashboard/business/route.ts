import { NextResponse } from "next/server";
import { assertSupabaseConfig, createServerClient } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/clerk-auth";

const supabase = createServerClient();

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    assertSupabaseConfig();

    const { data: business, error } = await supabase
      .from("businesses")
      .select(`
        id,
        owner_email,
        business_name,
        business_type,
        owner_name,
        whatsapp,
        whatsapp_phone_number_id,
        website,
        widget_color,
        widget_position,
        welcome_message,
        business_hours,
        languages,
        pricing_info,
        common_questions_text,
        additional_info,
        custom_faqs,
        onboarding_complete,
        plan,
        plan_expires_at,
        paypal_subscription_id,
        message_count_month,
        system_prompt,
        referral_code,
        created_at
      `)
      .eq("owner_email", authUser.email)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "No account found" }, { status: 404 });
    }

    return NextResponse.json({
      business: {
        ...business,
        customInstructions: business.system_prompt,
        customFaqs: business.custom_faqs ?? [],
      },
    });
  } catch (err) {
    console.error("[dashboard/business GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
