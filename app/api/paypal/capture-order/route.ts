import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PLAN_EXPIRY_DAYS = 31;
const AFFILIATE_COMMISSION = 15.8; // $15.80 per pro referral

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getPayPalToken(): Promise<string> {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json() as { access_token?: string };
  if (!data.access_token) throw new Error("No PayPal access token");
  return data.access_token;
}

interface SignupData {
  businessName?: string;
  yourName?: string;
  ownerName?: string;
  email?: string;
  whatsapp?: string;
  businessType?: string;
  website?: string;
  referralCode?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      orderID?: string;
      planId?: string;
      signupData?: SignupData;
      businessEmail?: string;
    };

    const { orderID, planId, signupData, businessEmail } = body;
    const email = (signupData?.email ?? businessEmail ?? "").trim().toLowerCase();

    if (!orderID || !planId) {
      return NextResponse.json({ error: "orderID and planId are required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "customer email is required" }, { status: 400 });
    }

    // Capture PayPal payment
    const token = await getPayPalToken();
    const captureRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      }
    );

    if (!captureRes.ok) {
      const err = await captureRes.text();
      throw new Error(`PayPal capture failed: ${captureRes.status} ${err}`);
    }

    const captureData = await captureRes.json() as { status: string };
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed", paypalStatus: captureData.status },
        { status: 400 }
      );
    }

    const supabase = admin();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PLAN_EXPIRY_DAYS);

    // Map "starter" to "basic" for DB constraint compatibility
    const dbPlan = planId === "starter" ? "basic" : planId;
    const referralCode = signupData?.referralCode?.trim().toUpperCase() ?? null;

    const { data: business, error: upsertError } = await supabase
      .from("businesses")
      .upsert(
        {
          owner_email:            email,
          owner_name:             signupData?.ownerName ?? signupData?.yourName ?? email,
          business_name:          signupData?.businessName ?? email,
          business_type:          signupData?.businessType ?? "other",
          whatsapp:               signupData?.whatsapp ?? "",
          website:                signupData?.website ?? "",
          plan:                   dbPlan,
          plan_expires_at:        expiresAt.toISOString(),
          paypal_order_id:        orderID,
          paypal_subscription_id: orderID,
          widget_color:           "#2563eb",
          referral_code:          referralCode,
        },
        { onConflict: "owner_email" }
      )
      .select("id, owner_email, business_name, plan, referral_code")
      .single();

    if (upsertError || !business) {
      console.error("[capture-order] upsert error:", upsertError);
      // Payment succeeded but DB failed — return partial success
      return NextResponse.json({
        success: true,
        warning: "Payment received. Account setup in progress.",
        user: { email, plan: planId },
      });
    }

    // Handle affiliate commission for Pro plan
    if (planId === "pro" && business.referral_code) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id, total_referrals, total_earnings")
        .eq("referral_code", business.referral_code)
        .maybeSingle();

      if (affiliate) {
        await supabase.from("affiliates").update({
          total_referrals: (affiliate.total_referrals ?? 0) + 1,
          total_earnings: Number(((affiliate.total_earnings ?? 0) + AFFILIATE_COMMISSION).toFixed(2)),
        }).eq("id", affiliate.id);
      }
    }

    return NextResponse.json({
      success: true,
      businessId: business.id,
      user: {
        id:           business.id,
        email:        business.owner_email,
        businessName: business.business_name,
        plan:         business.plan,
      },
      message: "Payment successful! Welcome to CypAI.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[capture-order]", message);
    return NextResponse.json(
      { success: false, error: "Failed to capture payment", details: message },
      { status: 500 }
    );
  }
}
