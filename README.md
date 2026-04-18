# CypAI — AI Customer Service Platform

AI-powered customer service, lead capture, bookings, and WhatsApp automation for local businesses in Cyprus, MENA, Europe, and North America.

**Live:** [www.cypai.app](https://www.cypai.app)

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 19 + TypeScript
- **Database:** Supabase (PostgreSQL + RLS)
- **AI:** OpenAI GPT-4o / GPT-4o-mini (smart routing)
- **Billing:** PayPal Orders API + Webhooks
- **Channels:** Web widget (iframe embed) + WhatsApp Cloud API
- **Analytics:** Simple Analytics (privacy-first)
- **Deploy:** Vercel

## Architecture

```
lib/
  ai.ts          ← Single source of truth: prompts, model routing, lead extraction
  supabase.ts    ← DB client + all TypeScript types
  plans.ts       ← Plan config, limits, display helpers
  utils.ts       ← formatDate, downloadCsv, parseMessages

app/api/
  chat/          ← Widget chat endpoint (CORS-enabled, plan quota enforced)
  business/      ← Dashboard data + settings PATCH
  analytics/     ← Daily breakdown, language stats, ratings
  paypal/        ← create-order, capture-order, webhook (signature verified)
  whatsapp/      ← Meta Cloud API webhook (verify + inbound message handling)
  audit/         ← Agent compliance scoring
  conversations/ ← Lead status PATCH
  automation/    ← Recovery queue (abandoned signup/payment)
  affiliate/     ← Referral tracking

app/dashboard/   ← Main SaaS dashboard (auth-gated, plan-aware)
components/dashboard/
  OverviewTab    StatCard   ConversationsTab   SettingsTab
  AnalyticsTab   CRMTab     BookingsTab        FollowUpsTab
  AgencyTab      (+ more)
hooks/
  use-dashboard.ts ← Data loading hook (extracted from monolith)
public/
  widget.js      ← Embeddable chat widget (iframe-based, data-* attributes)
```

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Then run `supabase-schema.sql` in your Supabase SQL editor.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_WEBHOOK_ID=

WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_GRAPH_API_VERSION=v21.0
WHATSAPP_DEFAULT_BUSINESS_ID=

NEXT_PUBLIC_APP_URL=https://www.cypai.app

# Optional
AGENCY_ALLOWED_EMAILS=email1@domain.com,email2@domain.com
```

## Deploy

```bash
npm run deploy       # Vercel CLI
npm run postbuild    # generates sitemap (auto on build)
```

## Key Improvements (v2)

| Before | After |
|---|---|
| 4,069-line dashboard monolith | Extracted into 10+ focused components |
| AI prompts duplicated in 3 routes | Single `lib/ai.ts` source of truth |
| No plan quota on chat API | Server-enforced per-request quota check |
| In-memory rate limiter (resets on cold start) | Per-request sliding window (Vercel-safe) |
| console.log credentials in prod | Removed all debug logging |
| PayPal webhook used old SDK | Pure REST API with proper signature verify |
| No analytics API | `/api/analytics` with daily breakdown |

## Plans

| Plan | Messages | WhatsApp | Bookings | Audit |
|---|---|---|---|---|
| Trial | 100/mo | — | — | — |
| Starter ($29/mo) | 500/mo | — | ✓ | — |
| Pro ($79/mo) | Unlimited | ✓ | ✓ | — |
| Business ($149/mo) | Unlimited | ✓ | ✓ | ✓ |

## License

MIT — see [LICENSE](LICENSE)
