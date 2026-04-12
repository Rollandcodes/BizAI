import type { Metadata } from 'next';
import Link from 'next/link';

import { SEO_COMPETITORS } from '@/lib/seo-data';

const BASE_URL = 'https://www.cypai.app';

export const metadata: Metadata = {
  title: 'Best Alternatives to Tidio, Intercom, Zendesk & More | CypAI',
  description:
    'Compare CypAI against Tidio, GoHighLevel, Intercom, Drift, Zendesk, Freshdesk, Crisp, ManyChat, and Tawk.to. See why service businesses choose CypAI for WhatsApp AI and lead capture.',
  keywords: [
    'best live chat alternative',
    'Tidio alternative',
    'Intercom alternative',
    'Zendesk alternative',
    'GoHighLevel alternative',
    'Drift alternative',
    'Freshdesk alternative',
    'WhatsApp chatbot alternative',
    'AI chatbot for small business',
    'CypAI vs competitors',
  ],
  alternates: { canonical: `${BASE_URL}/alternatives` },
  openGraph: {
    title: 'Best Alternatives to Tidio, Intercom, Zendesk & More | CypAI',
    description: 'See how CypAI compares to every major live chat and AI chatbot tool — with better WhatsApp support, flat pricing, and 15-minute setup.',
    url: `${BASE_URL}/alternatives`,
    siteName: 'CypAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Chatbot Alternatives | CypAI',
    description: 'Compare CypAI vs Tidio, Intercom, GoHighLevel, Drift, Zendesk, Freshdesk and more.',
  },
};

const differentiators = [
  {
    icon: '📱',
    title: 'Native WhatsApp Cloud API',
    body: 'Real two-way WhatsApp sync via Meta\'s official API — not a third-party bridge or add-on.',
  },
  {
    icon: '🌍',
    title: '5-language auto-detection',
    body: 'Detects and responds in English, Greek, Turkish, Arabic, and Russian from the first message.',
  },
  {
    icon: '⚡',
    title: '15-minute setup',
    body: 'One onboarding wizard. Paste one line of script on your website. Done. No agency needed.',
  },
  {
    icon: '💰',
    title: 'Flat pricing from $49/month',
    body: 'No per-seat fees, no per-conversation charges. One price, unlimited conversations.',
  },
  {
    icon: '🎯',
    title: 'Built for service businesses',
    body: 'Purpose-built for car rentals, barbershops, hotels, clinics, gyms, restaurants, and more.',
  },
  {
    icon: '📊',
    title: 'Lead CRM + delivery tracking',
    body: 'Every lead logged with full conversation history, channel badges, and WhatsApp delivery status.',
  },
];

export default function AlternativesIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:px-10 text-center">
        <p className="mb-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Competitor Comparisons
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          The best alternative to{' '}
          <span className="text-amber-400">every live chat tool</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          See how CypAI compares to Tidio, GoHighLevel, Intercom, Drift, Zendesk, Freshdesk, Crisp, ManyChat, and Tawk.to — and why service businesses choose CypAI.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Try CypAI Free →
          </Link>
          <Link
            href="/pricing"
            className="rounded-2xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            See Pricing
          </Link>
        </div>
      </section>

      {/* ── Competitor cards ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-10">
        <h2 className="mb-8 text-2xl font-bold text-white">
          All comparisons
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_COMPETITORS.map((comp) => (
            <Link
              key={comp.slug}
              href={`/alternatives/${comp.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500/50 hover:bg-zinc-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Alternative to
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white group-hover:text-blue-400 transition">
                    {comp.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 capitalize">{comp.category}</p>
                </div>
                <span className="text-blue-400 opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400 line-clamp-2">{comp.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {comp.cypaiAdvantages.slice(0, 2).map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300"
                  >
                    ✓ {a.split(' ').slice(0, 4).join(' ')}…
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why CypAI ────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Why CypAI Wins</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Six reasons service businesses choose CypAI over everything else
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <span className="text-3xl">{d.icon}</span>
                <h3 className="mt-3 text-base font-bold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick comparison table ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            At a glance — CypAI vs the market
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-zinc-700 py-3 pr-6 text-left font-semibold text-zinc-400">Tool</th>
                  <th className="border-b border-zinc-700 px-4 py-3 text-center font-semibold text-zinc-400">Native WhatsApp</th>
                  <th className="border-b border-zinc-700 px-4 py-3 text-center font-semibold text-zinc-400">5-language AI</th>
                  <th className="border-b border-zinc-700 px-4 py-3 text-center font-semibold text-zinc-400">Lead CRM</th>
                  <th className="border-b border-zinc-700 px-4 py-3 text-left font-semibold text-zinc-400">Starting Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-600/10">
                  <td className="py-3 pr-6 font-bold text-blue-400">CypAI</td>
                  <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                  <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                  <td className="px-4 py-3 text-center text-emerald-400">✓</td>
                  <td className="py-3 text-zinc-300">$49 / month flat</td>
                </tr>
                {[
                  { name: 'Tidio',       whatsapp: '✗ Add-on', lang: '~',  crm: '~',  price: '$329 / month (AI)' },
                  { name: 'GoHighLevel', whatsapp: '~ Bridge', lang: '~',  crm: '✓',  price: '$97 / month' },
                  { name: 'Intercom',    whatsapp: '✗',        lang: '~',  crm: '~',  price: '$74 / seat / month' },
                  { name: 'Drift',       whatsapp: '✗',        lang: '✗',  crm: '~',  price: '$2,500 / month' },
                  { name: 'Zendesk',     whatsapp: '✗ Enterprise', lang: '~', crm: '~', price: '$55 / seat / month' },
                  { name: 'Freshdesk',   whatsapp: '✗ Add-on', lang: '~',  crm: '✗',  price: '$15 / seat / month' },
                  { name: 'Crisp',       whatsapp: '~ Limited', lang: '~', crm: '~',  price: '$25 / month' },
                  { name: 'ManyChat',    whatsapp: '~ Restricted', lang: '✗', crm: '✗', price: '$15 / month' },
                  { name: 'Tawk.to',     whatsapp: '✗',        lang: '✗',  crm: '✗',  price: 'Free (limited)' },
                ].map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900'}>
                    <td className="py-3 pr-6 text-zinc-300">
                      <Link href={`/alternatives/${SEO_COMPETITORS.find((c) => c.name === row.name)?.slug || '#'}`} className="hover:text-blue-400 hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 text-center ${row.whatsapp === '✓' ? 'text-emerald-400' : 'text-zinc-500'}`}>{row.whatsapp}</td>
                    <td className={`px-4 py-3 text-center ${row.lang === '✓' ? 'text-emerald-400' : 'text-zinc-500'}`}>{row.lang}</td>
                    <td className={`px-4 py-3 text-center ${row.crm === '✓' ? 'text-emerald-400' : 'text-zinc-500'}`}>{row.crm}</td>
                    <td className="py-3 text-zinc-400">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Stop paying for features you don&apos;t use
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-300">
            CypAI does exactly what a service business needs — lead capture, WhatsApp, multilingual AI, and a CRM — starting at $49/month.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start 7-Day Free Trial →
            </Link>
            <Link
              href="/pricing"
              className="rounded-2xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

