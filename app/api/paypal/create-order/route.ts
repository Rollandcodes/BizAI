import { NextRequest, NextResponse } from 'next/server'

const PLANS: Record<string, { price: string; name: string }> = {
  starter:  { price: '29.00',  name: 'CypAI Starter Plan'  },
  pro:      { price: '79.00',  name: 'CypAI Pro Plan'      },
  business: { price: '149.00', name: 'CypAI Business Plan' }
}

async function getPayPalToken(): Promise<string> {
  const clientId     = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const baseUrl      = process.env.PAYPAL_BASE_URL!

  console.log('PayPal baseUrl:', baseUrl)
  console.log('PayPal clientId exists:', !!clientId)
  console.log('PayPal secret exists:', !!clientSecret)

  const auth = Buffer.from(`${clientId}:${clientSecret}`)
    .toString('base64')

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type':  'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  const data = await res.json()
  console.log('Token response status:', res.status)

  if (!data.access_token) {
    console.error('Token error:', data)
    throw new Error('Failed to get PayPal token')
  }

  return data.access_token
}

// ✅ THIS IS WHAT WAS MISSING — named POST export
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, customerEmail } = body

    console.log('Creating order for plan:', planId)

    const plan = PLANS[planId]
    if (!plan) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}` },
        { status: 400 }
      )
    }

    const token   = await getPayPalToken()
    const baseUrl = process.env.PAYPAL_BASE_URL!

    const orderRes = await fetch(
      `${baseUrl}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: plan.price
            },
            description: plan.name,
            custom_id:   customerEmail || 'unknown'
          }],
          application_context: {
            brand_name:  'CypAI',
            landing_page: 'BILLING',
            user_action:  'PAY_NOW',
            payment_method: {
              payer_selected: 'PAYPAL',
              payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
            },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment`
          }
        })
      }
    )

    const orderData = await orderRes.json()
    console.log('Order created:', orderData.id)

    if (!orderData.id) {
      console.error('Order creation failed:', orderData)
      return NextResponse.json(
        { error: 'PayPal order creation failed', details: orderData },
        { status: 500 }
      )
    }

    return NextResponse.json({ id: orderData.id })

  } catch (error: any) {
    console.error('create-order error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

// Handles browser hitting the URL directly (GET)
export async function GET() {
  return NextResponse.json({
    message: 'CypAI PayPal create-order endpoint',
    status:  'ready',
    method:  'POST required'
  })
}