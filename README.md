# CypAI (BizAI)

AI-powered customer support and lead capture platform for local businesses, built with Next.js, Supabase, OpenAI, and PayPal.

## Overview

CypAI helps businesses respond instantly to customer questions across web chat and WhatsApp, capture leads, and manage conversations from a unified dashboard.

It is designed for service businesses that need:

- 24/7 automated responses
- Multilingual customer communication
- Lead capture and conversation tracking
- Fast setup with embeddable widgets

## Key Features

- AI chat widget for business websites
- Conversation and lead management dashboard
- Industry-specific demo and onboarding flows
- PayPal checkout and webhook handling
- Graceful degraded mode for AI provider issues
- E2E coverage with Playwright
- SEO sitemap and robots generation via next-sitemap

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Supabase (database + auth patterns)
- OpenAI API
- PayPal APIs + webhook verification
- Tailwind CSS
- Playwright (E2E)

## Project Structure

- [app](app): App Router pages and API routes
- [components](components): UI and feature components
- [lib](lib): Shared utilities, API clients, and config helpers
- [public](public): Static assets including sitemap and robots
- [tests](tests): Playwright end-to-end test specs
- [supabase-schema.sql](supabase-schema.sql): Database schema and migrations
- [SETUP.md](SETUP.md): Full setup instructions

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- Supabase project
- OpenAI API key
- PayPal developer app

## Environment Variables

Create `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run test:e2e` - Run Playwright E2E suite
- `npm run deploy` - Deploy via Vercel CLI
- `npm run postbuild` - Generate sitemap using next-sitemap

## Database Setup

Run [supabase-schema.sql](supabase-schema.sql) in Supabase SQL Editor to create required tables and indexes.

## PayPal Setup

- Create a sandbox app in PayPal Developer Dashboard
- Configure webhook endpoint:
  - Local: `http://localhost:3000/api/paypal/webhook`
  - Production: `https://www.cypai.app/api/paypal/webhook`
- Subscribe to:
  - `BILLING.SUBSCRIPTION.CREATED`
  - `BILLING.SUBSCRIPTION.ACTIVATED`
  - `BILLING.SUBSCRIPTION.UPDATED`
  - `BILLING.SUBSCRIPTION.CANCELLED`
  - `PAYMENT.SALE.COMPLETED`

## SEO Sitemap

Sitemap is generated with next-sitemap using [next-sitemap.config.js](next-sitemap.config.js).

Generated output:

- [public/sitemap.xml](public/sitemap.xml)
- [public/sitemap-0.xml](public/sitemap-0.xml)
- [public/robots.txt](public/robots.txt)

## Testing

Run E2E tests:

```bash
npm run test:e2e
```

Current suite covers major user journeys, including:

- Homepage and navigation
- Signup/payment guards and flow
- Dashboard tab behavior
- Demo chat and degraded mode UI
- Blog and widget states

## Deployment

Recommended: Vercel (GitHub-connected CI and CD).

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Security Notes

- Never expose service-role keys on the client
- Keep webhook signature verification enabled
- Rotate API keys regularly
- Use production PayPal credentials only in production environments

## License

This project is licensed under the terms in [LICENSE](LICENSE).
