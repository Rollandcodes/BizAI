# BizAI — AI Customer Service Assistant for Local Businesses

This is a [Next.js](https://nextjs.org) project for BizAI, focused on AI customer service for local businesses in Northern Cyprus.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Recent Fixes

- Fixed homepage encoding artifacts and moved critical pages to clean UTF-8 output.
- Added explicit `<meta charSet="UTF-8" />` in root layout.
- Added HTML charset response headers for `/`, `/dashboard`, and `/widget/:businessId`.
- Restored FAQ answers and ensured all FAQ entries have question and answer content.
- Implemented new `HeroV2` with interactive demo modal and analytics events:
  - `hero_cta_click`
  - `hero_demo_open`
- Implemented new `PricingGrid` with monthly/yearly toggle, highlighted Pro plan, mobile swipe cards, and comparison table.
- Added pricing analytics events:
  - `pricing_plan_click`
  - `pricing_trial_start`
- Added accessibility improvements (CTA labels and visible keyboard focus states).

## Run Tests

Run production checks:

```bash
npm run build
```

Run Playwright smoke and E2E tests:

```bash
npm run test:e2e
```

Test coverage includes:

- Encoding smoke test (no mojibake artifacts like `â€”`, `ðŸ`, `Â·`)
- Hero presence and CTA interaction
- Demo modal open/visibility
- Pricing "Most Popular" label
- FAQ rendered answers (minimum 5)
- Mobile breakpoints (320, 375, 414, 768, 1024)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

Deploy via your connected GitHub repository or:

```bash
npm run deploy
```
