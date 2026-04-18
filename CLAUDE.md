# CLAUDE.md — CypAI Developer Rules

You are an expert contributor to **CypAI** (`cypai.app`), an AI-powered SaaS chatbot platform for small businesses.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.1.6 App Router, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (server-side) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth / email-based dashboard access |
| AI | OpenAI GPT (chat completions) |
| Payments | PayPal |
| Deployment | Vercel |

---

## Build & Validation

Before every commit, ensure the project builds cleanly:

```bash
npm install
npm run build
```

Fix **all** TypeScript and build errors before committing. Never commit broken code.

Linting:
```bash
npm run lint
```

---

## Critical Safety Rules

- **Never push directly to `main`** — always use a PR branch.
- **Never delete** any file in `app/`, `components/`, `lib/`, `public/`, or `supabase-schema.sql`.
- **Never remove** Supabase RLS policies — database security depends on them.
- **Never expose** secrets or API keys in code.
- Only modify files directly relevant to the requested task.
- Never downgrade or remove existing features.

---

## Code Standards

- **TypeScript strict mode** — no `any`, no type assertions unless unavoidable.
- **Functional React** — hooks only, no class components.
- **Hooks order** — all `useState`, `useRef`, `useMemo`, `useEffect` calls must appear **before** any early `return` in a component to avoid React error #310.
- Components in `components/`, page routes in `app/`, utilities in `lib/`.
- Use Tailwind utility classes only — no inline `style={{}}` props except for truly dynamic values (e.g., widget color hex).
- Imports: use `@/` path aliases, not relative `../../`.
- No unnecessary `console.log` in committed code.

---

## Project Architecture

### Niche System
Business types and their AI prompts live in `lib/niches.ts` and `app/api/chat/route.ts`.
When adding a new niche, update all of:
1. `lib/niches.ts` — niche config
2. `app/api/chat/route.ts` — `NICHE_PROMPTS`
3. `lib/seo-data.ts` — SEO niche entry
4. `app/for/page.tsx` — metadata keywords
5. Business type selectors in `components/OnboardingWizard.tsx`, `app/dashboard/page.tsx`, `components/dashboard/AgencyTab.tsx`, `app/signup/page.tsx`

### Dashboard
- `app/dashboard/page.tsx` is a large single-file dashboard (`DashboardInner` component).
- It uses many hooks — be careful about hook order and conditional rendering.
- The early `if (!business) return ...` guard must always appear **after** all hook declarations.

### API Routes
- `app/api/business/route.ts` — main dashboard data loader and settings PATCH.
- `app/api/chat/route.ts` — AI chat completions with niche-aware prompts.
- `app/api/conversations/[conversationId]/route.ts` — conversation updates.
- All API responses must validate `businessId` ownership against the authenticated session.

### Database
- Schema is in `supabase-schema.sql` — consult it before writing any Supabase queries.
- Always use parameterized queries via the Supabase client, never raw string interpolation.
- RLS is enforced — all queries run as the business owner's role.

---

## Commit Style

```
feat: short description of new feature
fix: short description of bug resolved
refactor: describe what was restructured
perf: describe performance improvement
docs: describe documentation change
```

No merge commits in PRs — use squash or rebase.

---

## SEO & Content

- Programmatic SEO pages live under `app/for/[niche]/[city]/`.
- Niche data is in `lib/seo-data.ts`.
- How-it-works guides live under `app/how-it-works/[niche]/`.
- Never remove existing static pages — they carry SEO value.

---

## Payments

- PayPal integration lives in `app/api/paypal/`.
- Plan definitions and prices are in `lib/plans.ts`.
- Never change plan IDs without updating both the API and the database.

---

## Deployment

- Production URL: `https://cypai.app`
- Deployed on **Vercel** — the `main` branch auto-deploys.
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `ANTHROPIC_API_KEY`.
- Never hard-code environment values — always use `process.env.*`.

---

## Final Principle

**Stability first.** If in doubt between a clever solution and a simple one, choose simple. This is a live production SaaS with real customers.
