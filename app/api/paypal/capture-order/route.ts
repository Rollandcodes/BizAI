import { NextRequest, NextResponse } from 'next/server';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';
import { isValidPlanId, PLANS } from '@/lib/plans';

const supabase = createServerClient();

// ============================================================================
// Types
// ============================================================================

interface CaptureOrderRequest {
  orderID: string;
  planId: string;
  businessEmail: string;
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
  plan: string;
  message: string;
}

// ============================================================================
// Environment Setup
// ============================================================================

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
// Sandbox: https://api-m.sandbox.paypal.com  |  Live: https://api-m.paypal.com
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get PayPal access token using Client Credentials flow
 */
async function getPayPalAccessToken(): Promise<string> {
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
    const { orderID, planId, businessEmail } = body as CaptureOrderRequest;

    // ========================================================================
    // Validate request
    // ========================================================================
    if (!orderID || !planId || !businessEmail) {
      return NextResponse.json(
        {
          error: 'Missing required fields: orderID, planId, businessEmail',
        },
        { status: 400 }
      );
    }

    if (!isValidPlanId(planId)) {
      return NextResponse.json(
        { error: `Invalid plan ID: ${planId}` },
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
        { error: 'Payment was not completed' },
        { status: 400 }
      );
    }

    // ========================================================================
    // Update business record in Supabase
    // ========================================================================
    const planExpiresAt = calculatePlanExpiration();

    const { data: updatedBusiness, error: updateError } = await supabase
      .from('businesses')
      .update({
        plan: planId,
        plan_expires_at: planExpiresAt,
        paypal_subscription_id: orderID,
      })
      .eq('owner_email', businessEmail)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to update business record',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    if (!updatedBusiness) {
      return NextResponse.json(
        { error: 'Business not found for email: ' + businessEmail },
        { status: 404 }
      );
    }

    // ========================================================================
    // Return success response
    // ========================================================================
    return NextResponse.json({
      success: true,
      plan: planId,
      message: `Payment successful! Your ${PLANS[planId].name} plan is now active and expires on ${new Date(planExpiresAt).toLocaleDateString()}.`,
    } as CaptureOrderResponse);
  } catch (error) {
    console.error('Capture order API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to capture order', details: errorMessage },
      { status: 500 }
    );
  }
}
