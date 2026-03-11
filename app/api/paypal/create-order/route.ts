import { NextRequest, NextResponse } from 'next/server';
import { PLANS, isValidPlanId } from '@/lib/plans';

// ============================================================================
// Types
// ============================================================================

interface CreateOrderRequest {
  planId: string;
  businessEmail: string;
}

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links?: Array<{
    rel: string;
    href: string;
  }>;
}

interface CreateOrderResponse {
  orderID: string;
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

    const data = (await response.json()) as PayPalTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('PayPal token error:', error);
    throw error;
  }
}

/**
 * Create PayPal order
 */
async function createPayPalOrder(
  amount: string,
  planId: string,
  accessToken: string
): Promise<string> {
  const plan = PLANS[planId];

  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
            description: plan.description,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
              cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=cancelled`,
              user_action: 'PAY_NOW',
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to create PayPal order: ${response.status} ${error}`
      );
    }

    const data = (await response.json()) as PayPalOrderResponse;
    return data.id;
  } catch (error) {
    console.error('PayPal order creation error:', error);
    throw error;
  }
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { planId, businessEmail } = body as CreateOrderRequest;

    // ========================================================================
    // Validate request
    // ========================================================================
    if (!planId || !businessEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, businessEmail' },
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
    // Get plan details
    // ========================================================================
    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // ========================================================================
    // Get PayPal access token
    // ========================================================================
    const accessToken = await getPayPalAccessToken();

    // ========================================================================
    // Create PayPal order
    // ========================================================================
    const orderID = await createPayPalOrder(plan.price, planId, accessToken);

    return NextResponse.json({
      orderID,
    } as CreateOrderResponse);
  } catch (error) {
    console.error('Create order API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: 'Failed to create order', details: errorMessage },
      { status: 500 }
    );
  }
}
