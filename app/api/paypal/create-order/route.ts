import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const PLANS = {
  starter:  { price: '29.00',  name: 'BizAI Starter Plan' },
  basic:    { price: '29.00',  name: 'BizAI Basic Plan' },
  pro:      { price: '79.00',  name: 'BizAI Pro Plan' },
  business: { price: '149.00', name: 'BizAI Business Plan' },
} as const;

type PlanKey = keyof typeof PLANS;

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
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

    if (!planId || !(planId in PLANS)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!customerEmail) {
      return NextResponse.json({ error: 'Missing customerEmail' }, { status: 400 });
    }

    const plan = PLANS[planId as PlanKey];
    const accessToken = await getAccessToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
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
          brand_name: 'BizAI Cyprus',
          return_url: `${appUrl}/success`,
          cancel_url: `${appUrl}/payment?plan=${planId}`,
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
