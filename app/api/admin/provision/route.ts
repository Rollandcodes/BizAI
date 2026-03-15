import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/admin/provision
 *
 * Creates or updates a business account without requiring PayPal payment.
 * Used by the CypAI admin to manually provision trial or paid accounts.
 *
 * Authorization: Bearer <ADMIN_SECRET>
 *
 * Body:
 *   email        string  required — owner email
 *   businessName string  required — business display name
 *   ownerName    string  optional
 *   businessType string  optional (defaults to "other")
 *   whatsapp     string  optional
 *   website      string  optional
 *   plan         string  optional ("trial" | "basic" | "pro" | "business", defaults to "trial")
 *   daysValid    number  optional — days until plan expires (defaults to 30; 0 = no expiry)
 */

const VALID_PLANS = ["trial", "basic", "pro", "business"] as const;
type ValidPlan = (typeof VALID_PLANS)[number];

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) return false; // Endpoint disabled if ADMIN_SECRET not set
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  return token === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json() as {
      email?: string;
      businessName?: string;
      ownerName?: string;
      businessType?: string;
      whatsapp?: string;
      website?: string;
      plan?: string;
      daysValid?: number;
    };

    const email = body.email?.trim().toLowerCase();
    const businessName = body.businessName?.trim();

    if (!email || !businessName) {
      return NextResponse.json(
        { error: "email and businessName are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const rawPlan = body.plan ?? "trial";
    const plan: ValidPlan = (VALID_PLANS as readonly string[]).includes(rawPlan)
      ? (rawPlan as ValidPlan)
      : "trial";

    const daysValid = typeof body.daysValid === "number" ? body.daysValid : 30;
    let planExpiresAt: string | null = null;
    if (daysValid > 0) {
      const expires = new Date();
      expires.setDate(expires.getDate() + daysValid);
      planExpiresAt = expires.toISOString();
    }

    const supabase = adminClient();

    const { data: business, error } = await supabase
      .from("businesses")
      .upsert(
        {
          owner_email:     email,
          business_name:   businessName,
          owner_name:      body.ownerName?.trim() ?? email,
          business_type:   body.businessType?.trim() ?? "other",
          whatsapp:        body.whatsapp?.trim() ?? "",
          website:         body.website?.trim() ?? "",
          plan,
          plan_expires_at: planExpiresAt,
          widget_color:    "#2563eb",
        },
        { onConflict: "owner_email" }
      )
      .select("id, owner_email, business_name, plan, plan_expires_at")
      .single();

    if (error || !business) {
      console.error("[admin/provision] upsert error:", error);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      businessId: business.id,
      email: business.owner_email,
      businessName: business.business_name,
      plan: business.plan,
      planExpiresAt: business.plan_expires_at,
      dashboardUrl: `https://cypai.app/dashboard?email=${encodeURIComponent(business.owner_email)}`,
    });
  } catch (err) {
    console.error("[admin/provision]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
