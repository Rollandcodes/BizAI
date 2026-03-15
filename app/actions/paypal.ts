// PayPal Order Creation Server Action
// Strict TypeScript, production-ready

import { getPayPalAccessToken } from '@/lib/integrations/paypal-access-token';
import { createBookingAuditLog } from '@/lib/audit-log';

/**
 * Creates a PayPal order for a booking.
 * Throws on error, logs audit details.
 */
export async function createPayPalOrder(
  bookingId: string,
  amount: number,
  currency: 'EUR',
  description: string
): Promise<{ id: string; status: string; links: Array<{ rel: string; href: string; method: string }> }> {
  const accessToken = await getPayPalAccessToken();
  const url = 'https://api-m.paypal.com/v2/checkout/orders';

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: bookingId,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description,
      },
    ],
    application_context: {
      brand_name: 'CypAI',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    await createBookingAuditLog({ bookingId, action: 'paypal_order_failed', details: errorText });
    throw new Error(`PayPal order creation failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  await createBookingAuditLog({ bookingId, action: 'paypal_order_created', details: data });
  return {
    id: data.id,
    status: data.status,
    links: data.links,
  };
}
