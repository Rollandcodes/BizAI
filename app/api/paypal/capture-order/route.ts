import { NextRequest, NextResponse } from 'next/server';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';
import { isValidPlanId } from '@/lib/plans';

const supabase = createServerClient();

// ============================================================================
// Types
// ============================================================================

interface CaptureOrderRequest {
  orderID: string;
  planId: string;
  customerEmail: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
}

interface CaptureOrderResponse {
  success: boolean;
  businessId?: string;
  message: string;
  error?: string;
}

// ============================================================================
// Environment Setup
// ============================================================================

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get PayPal access token using Client Credentials flow
 */
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal auth failed: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('PayPal token error:', error);
    throw error;
  }
}

/**
 * Capture PayPal order
 */
async function capturePayPalOrder(
  orderID: string,
  accessToken: string
): Promise<PayPalCaptureResponse> {
  try {
    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to capture PayPal order: ${response.status} ${error}`
      );
    }

    const data = (await response.json()) as PayPalCaptureResponse;
    return data;
  } catch (error) {
    console.error('PayPal capture error:', error);
    throw error;
  }
}

/**
 * Calculate plan expiration date (30 days from now)
 */
function calculatePlanExpiration(): string {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate.toISOString();
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    assertSupabaseConfig();

    const body = await request.json();
    const {
      orderID,
      planId,
      customerEmail,
      businessEmail,
    } = body as CaptureOrderRequest & { businessEmail?: string };

    const email = customerEmail || businessEmail;

    // ========================================================================
    // Validate request
    // ========================================================================
    if (!orderID || !planId || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: orderID, planId, customerEmail',
        },
        { status: 400 }
      );
    }

    if (!isValidPlanId(planId)) {
      return NextResponse.json(
        { success: false, error: `Invalid plan ID: ${planId}` },
        { status: 400 }
      );
    }

    // ========================================================================
    // Get PayPal access token
    // ========================================================================
    const accessToken = await getPayPalAccessToken();

    // ========================================================================
    // Capture PayPal order
    // ========================================================================
    const captureResult = await capturePayPalOrder(orderID, accessToken);

    if (
      captureResult.status !== 'COMPLETED' &&
      captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status !==
        'COMPLETED'
    ) {
      console.error('PayPal capture not completed:', captureResult);
      return NextResponse.json(
        { success: false, error: 'Payment failed' },
        { status: 400 }
      );
    }

    // ========================================================================
    // Update business record in Supabase
    // ========================================================================
    const planExpiresAt = calculatePlanExpiration();

    const { data: existingBusiness, error: existingBusinessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingBusinessError) {
      console.error('Supabase lookup error:', existingBusinessError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save business record',
        },
        { status: 500 }
      );
    }

    const businessPayload = {
      owner_email: email,
      plan: planId,
      plan_expires_at: planExpiresAt,
      paypal_subscription_id: orderID,
    };

    const saveQuery = existingBusiness?.id
      ? supabase
          .from('businesses')
          .update(businessPayload)
          .eq('id', existingBusiness.id)
      : supabase.from('businesses').insert({
          ...businessPayload,
          business_name: email.split('@')[0] || 'New Business',
          widget_color: '#0F6B66',
        });

    const { data: savedBusiness, error: saveError } = await saveQuery
      .select('id')
      .single();

    if (saveError || !savedBusiness) {
      console.error('Supabase save error:', saveError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save business record',
        },
        { status: 500 }
      );
    }

    // ========================================================================
    // Return success response
    // ========================================================================
    return NextResponse.json({
      success: true,
      businessId: savedBusiness.id,
      message: 'Payment successful!',
    } as CaptureOrderResponse);
  } catch (error) {
    console.error('Capture order API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { success: false, error: 'Payment failed', details: errorMessage },
      { status: 500 }
    );
  }
}
