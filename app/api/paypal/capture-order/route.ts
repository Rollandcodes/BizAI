import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_EXPIRY_DAYS = 30;

type SignupData = {
  businessName: string;
  yourName?: string;
  ownerName?: string;
  email: string;
  whatsapp: string;
  businessType: string;
  website: string;
  plan: string;
};

interface CaptureBody {
  orderID: string;
  planId: string;
  signupData: SignupData;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
}

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
    const body = (await req.json()) as Partial<CaptureBody>;
    const { orderID, planId, signupData } = body;

    if (!orderID || !planId || !signupData?.email) {
      return NextResponse.json(
        { success: false, error: 'Missing orderID, planId, or signupData.email' },
        { status: 400 },
      );
    }

    const accessToken = await getPayPalToken();
    const captureRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!captureRes.ok) {
      const err = await captureRes.text();
      throw new Error(`PayPal capture failed: ${captureRes.status} ${err}`);
    }

    const captureData = (await captureRes.json()) as PayPalCaptureResponse;

    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 },
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PLAN_EXPIRY_DAYS);

    // Keep compatibility with the current DB constraint while preserving Starter in the UI.
    const dbPlan = planId === 'starter' ? 'basic' : planId;

    const { data: business, error } = await supabase
      .from('businesses')
      .upsert(
        {
          owner_email: signupData.email.trim().toLowerCase(),
          owner_name: signupData.ownerName || signupData.yourName || signupData.email,
          business_name: signupData.businessName,
          business_type: signupData.businessType || 'general',
          whatsapp: signupData.whatsapp || '',
          website: signupData.website || '',
          plan: dbPlan,
          plan_expires_at: expiresAt.toISOString(),
          paypal_subscription_id: orderID,
          widget_color: '#2563eb',
        },
        { onConflict: 'owner_email' },
      )
      .select('id, owner_email, business_name, plan')
      .single();

    if (error || !business) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({
        success: true,
        warning: 'Payment received, account setup delayed',
        user: {
          email: signupData.email,
          plan: planId,
        },
      });
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
      message: 'Payment successful!',
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to capture payment', details: message },
      { status: 500 },
    );
  }
}
