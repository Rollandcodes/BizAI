# BizAI Setup Guide

## 1. Create a Supabase project and get keys
1. Go to https://supabase.com and create a new project.
2. In your project dashboard, open **Project Settings** -> **API**.
3. Copy these values into [`.env.local`](.env.local):
   - `NEXT_PUBLIC_SUPABASE_URL` -> Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` -> service role key
4. Open **SQL Editor** in Supabase.
5. Run the schema from [`supabase-schema.sql`](supabase-schema.sql).

## 2. Create an OpenAI API key
1. Go to https://platform.openai.com.
2. Open **API keys**.
3. Create a new secret key.
4. Add it to [`.env.local`](.env.local) as `OPENAI_API_KEY`.

## 3. Create a PayPal Sandbox app and get credentials
1. Go to https://developer.paypal.com.
2. Open **Dashboard** -> **My Apps & Credentials**.
3. Under **Sandbox**, create a new app.
4. Copy **Client ID** and **Secret**.
5. Add them to [`.env.local`](.env.local):
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (same value as Client ID)
   - `PAYPAL_BASE_URL` (`https://api-m.sandbox.paypal.com` for sandbox)
   - `PAYPAL_WEBHOOK_ID` (from PayPal dashboard webhook config)

## 4. Register PayPal webhook endpoint
1. In PayPal Developer Dashboard, open your app and create a webhook.
2. Set URL to:
   - Local: `http://localhost:3000/api/paypal/webhook`
   - Production: `https://www.cypai.app/api/paypal/webhook`
3. Subscribe to at least:
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.UPDATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `PAYMENT.SALE.COMPLETED`
4. Copy the generated webhook ID into `PAYPAL_WEBHOOK_ID`.
5. Re-run [`supabase-schema.sql`](supabase-schema.sql) to create `paypal_webhook_events`.

## 5. Run the project locally
1. Install dependencies:

```bash
npm install
```

2. Fill [`.env.local`](.env.local) with real values.
3. Start dev server:

```bash
npm run dev
```

4. Open http://localhost:3000.

## 6. Optional: Enable abandoned-flow recovery emails
1. Create a Resend account and API key.
2. Add these optional variables to `.env.local`:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (for example: `CypAI <noreply@cypai.app>`)
3. Re-run [`supabase-schema.sql`](supabase-schema.sql) to create `marketing_automation_queue`, `marketing_automation_policy`, `marketing_automation_alert_policy`, and `marketing_automation_alert_logs`.
4. The app will automatically queue and optionally email for:
   - `abandoned_signup`
   - `abandoned_payment`
5. Health check endpoint:
   - `GET /api/automation`
6. Delivery summary endpoint (dashboard-ready JSON):
   - `GET /api/automation` (includes `summary`, `recent` queue records, and `alertLogs` delivery history)
7. Optional alert webhook security and templates:
    - Add `AUTOMATION_ALERT_WEBHOOK_SECRET` to sign outgoing webhook alerts.
    - Webhook payload template is auto-selected:
       - Slack (`hooks.slack.com`) gets Slack `text` + `blocks` payload.
       - Discord (`discord.com/api/webhooks`) gets Discord `content` + `embeds` payload.
       - Other URLs receive a generic JSON payload.
    - Signature headers:
       - `X-CypAI-Timestamp`
       - `X-CypAI-Signature` (HMAC SHA-256 over `${timestamp}.${rawBody}`)
       - `X-CypAI-Signature-Version` (`v1`)
    - Receiver verification helper:
         - Use [`lib/webhookSignature.ts`](lib/webhookSignature.ts) in your receiving API route.
         - Example (Node runtime):

```ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyCypaiWebhookSignature } from '@/lib/webhookSignature';

export async function POST(request: NextRequest) {
   const rawBody = await request.text();
   const result = verifyCypaiWebhookSignature({
      secret: process.env.AUTOMATION_ALERT_WEBHOOK_SECRET || '',
      rawBody,
      headers: {
         timestamp: request.headers.get('x-cypai-timestamp'),
         signature: request.headers.get('x-cypai-signature'),
         version: request.headers.get('x-cypai-signature-version'),
      },
      options: { maxSkewMs: 5 * 60 * 1000 },
   });

   if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 401 });
   }

   return NextResponse.json({ ok: true });
}
```

## 7. Deploy to Vercel (GitHub connect)
1. Push the repository to GitHub.
2. Go to https://vercel.com and create a new project.
3. Import your GitHub repository.
4. In Vercel project settings, add all environment variables from [`.env.local`](.env.local).
5. Deploy.

## 8. Switch PayPal from sandbox to live
Update the PayPal base URL in both API routes:
1. [app/api/paypal/create-order/route.ts](app/api/paypal/create-order/route.ts)
2. [app/api/paypal/capture-order/route.ts](app/api/paypal/capture-order/route.ts)

Change:

```ts
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com';
```

To:

```ts
const PAYPAL_BASE_URL = 'https://api-m.paypal.com';
```

Then replace PayPal sandbox credentials in your environment variables with live credentials.

## 9. Optional: Connect WhatsApp unified inbox (website + WhatsApp sync)
1. Create a Meta app and enable WhatsApp Cloud API.
2. Set webhook URL:
   - Local: `http://localhost:3000/api/whatsapp`
   - Production: `https://www.cypai.app/api/whatsapp`
3. Configure webhook verify token and add these to `.env.local`:
   - `WHATSAPP_VERIFY_TOKEN`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_GRAPH_API_VERSION` (default `v21.0`)
   - `WHATSAPP_DEFAULT_BUSINESS_ID` (fallback business for unmatched phone number IDs)
4. Re-run [`supabase-schema.sql`](supabase-schema.sql) to apply:
   - `businesses.whatsapp_phone_number_id`
   - `conversations.channel`
   - `conversations.external_contact_id`
   - `whatsapp_message_events`
5. For multi-business mapping, set `businesses.whatsapp_phone_number_id` to each connected WhatsApp phone number ID.
6. Inbound WhatsApp text messages will:
   - be stored in `conversations` with `channel='whatsapp'`
   - auto-generate AI replies
   - send outbound reply through WhatsApp Cloud API
   - log inbound/outbound events in `whatsapp_message_events`

## 10. Optional: Restrict Agency Mode to approved owner emails
1. Add this server-only environment variable to `.env.local` and Vercel:
   - `AGENCY_ALLOWED_EMAILS=email1@example.com,email2@example.com`
2. Only owner emails in that comma-separated list will see and access the `Manage Clients` / Agency Mode tab.
3. Business plan alone is no longer enough to unlock Agency Mode.
4. If the variable is empty or missing, Agency Mode is disabled for everyone.
