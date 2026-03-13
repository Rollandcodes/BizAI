import { NextResponse } from 'next/server';

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL;

  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error('Missing PayPal server configuration');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('PayPal access token missing from response');
  }

  return data.access_token;
}

export async function GET() {
  try {
    const accessToken = await getPayPalAccessToken();
    const baseUrl = process.env.PAYPAL_BASE_URL;

    const response = await fetch(`${baseUrl}/v1/identity/generate-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'en_US',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate PayPal client token: ${response.status}`);
    }

    const data = (await response.json()) as { client_token?: string };
    if (!data.client_token) {
      throw new Error('PayPal client token missing from response');
    }

    return NextResponse.json({ clientToken: data.client_token });
  } catch (error) {
    console.error('PayPal client token error:', error);
    return NextResponse.json(
      { error: 'Failed to get client token' },
      { status: 500 },
    );
  }
}