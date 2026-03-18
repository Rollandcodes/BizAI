import { NextRequest, NextResponse } from "next/server";
import { assertSupabaseConfig, createServerClient } from "@/lib/supabase";

const supabase = createServerClient();

/**
 * GET /api/dashboard/business
 * 
 * Returns the current user's business data based on email query parameter.
 * Uses owner_email field (not email) to query the businesses table.
 * 
 * Query params:
 * - email: The owner's email address (required)
 * 
 * Returns:
 * - 200: { business: Business }
 * - 400: { error: "email required" }
 * - 401: Unauthorized (not authenticated)
 * - 404: { error: "No account found" }
 * - 500: { error: "Internal server error" }
 */
export async function GET(req: NextRequest) {
  try {
    assertSupabaseConfig();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 });
    }

    // Fetch business by owner_email (not email - that's the bug in the sub-pages)
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
      .eq("owner_email", email)
      .single();

    if (error || !business) {
      console.log("[dashboard/business] No business found for email:", email, "error:", error);
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
