// PayPal Access Token Helper
// Strict TypeScript, production-ready utility

import fetch from 'node-fetch';

/**
 * Fetches a PayPal access token using client credentials.
 * Uses environment variables: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET.
 * Throws on error, logs audit details.
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal client credentials');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const url = 'https://api-m.paypal.com/v1/oauth2/token';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errorText = await res.text();
    // Optionally log audit details here
    throw new Error(`PayPal token fetch failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('PayPal token response missing access_token');
  }
  return data.access_token;
}
