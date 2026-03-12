import { NextRequest, NextResponse } from 'next/server';

const PLAN_PRICES: Record<string, { price: string; name: string }> = {
  starter: { price: '29.00', name: 'CypAI Starter Plan' },
  pro: { price: '79.00', name: 'CypAI Pro Plan' },
  business: { price: '149.00', name: 'CypAI Business Plan' },
};

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { planId?: string; customerEmail?: string };
    const { planId, customerEmail } = body;

    if (!planId || !(planId in PLAN_PRICES)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = PLAN_PRICES[planId];
    const accessToken = await getPayPalToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const res = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'USD', value: plan.price },
            description: plan.name,
            custom_id: customerEmail,
          },
        ],
        application_context: {
          brand_name: 'CypAI',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${appUrl}/success`,
          cancel_url: `${appUrl}/payment`,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal create-order failed: ${res.status} ${err}`);
    }

    const orderData = (await res.json()) as { id: string };
    return NextResponse.json({ id: orderData.id });
  } catch (error) {
    console.error('PayPal create-order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
