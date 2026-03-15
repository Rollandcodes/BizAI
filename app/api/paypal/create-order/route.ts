import { NextRequest, NextResponse } from "next/server";

const PLAN_CONFIG: Record<string, { price: string; name: string }> = {
  starter:  { price: "29.00",  name: "BizAI Starter Plan"  },
  basic:    { price: "29.00",  name: "BizAI Starter Plan"  },
  pro:      { price: "79.00",  name: "BizAI Pro Plan"      },
  business: { price: "149.00", name: "BizAI Business Plan" },
};

async function getPayPalToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl      = process.env.PAYPAL_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json() as { access_token?: string };
  if (!data.access_token) throw new Error("No PayPal access token returned");
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { planId?: string; customerEmail?: string; businessEmail?: string };
    const { planId, customerEmail, businessEmail } = body;
    const email = customerEmail || businessEmail;

    if (!planId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    const plan = PLAN_CONFIG[planId];
    if (!plan) {
      return NextResponse.json({ error: `Invalid planId: ${planId}` }, { status: 400 });
    }

    const token   = await getPayPalToken();
    const baseUrl = process.env.PAYPAL_BASE_URL!;
    const appUrl  = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.cypai.app";

    const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: plan.price },
          description: plan.name,
          custom_id: email ?? "unknown",
        }],
        application_context: {
          brand_name: "CypAI",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: `${appUrl}/success`,
          cancel_url: `${appUrl}/payment`,
        },
      }),
    });

    const data = await res.json() as { id?: string };
    if (!data.id) {
      return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error("[create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "CypAI PayPal create-order", method: "POST required" });
}
