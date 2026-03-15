import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCompetitorSEO, SEO_COMPETITORS } from '@/lib/seo-data';

const BASE_URL = 'https://www.cypai.app';

type PageProps = {
  params: Promise<{ competitor: string }>;
};

export async function generateStaticParams() {
  return SEO_COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor: slug } = await params;
  const comp = getCompetitorSEO(slug);
  if (!comp) return { title: 'Not Found' };

  const title = `${comp.name} Alternative for Small Businesses | CypAI`;
  const description = `Looking for a ${comp.name} alternative? See how CypAI compares — better WhatsApp support, flat pricing, and 15-minute setup for service businesses.`;
  const url = `${BASE_URL}/alternatives/${comp.slug}`;

  return {
    title,
    description,
    keywords: [
      `${comp.name} alternative`,
      `${comp.name} vs CypAI`,
      `best ${comp.name} alternative`,
      `${comp.name} alternative for small business`,
      `${comp.name} alternative Cyprus`,
      `replace ${comp.name}`,
      'AI chatbot alternative',
      'WhatsApp chatbot alternative',
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'CypAI',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <XIcon />;
  }
  return <span className="text-sm text-zinc-300">{value}</span>;
}

export default async function AlternativePage({ params }: PageProps) {
  const { competitor: slug } = await params;
  const comp = getCompetitorSEO(slug);
  if (!comp) notFound();

  const peerCompetitors = SEO_COMPETITORS.filter((c) => c.slug !== comp.slug).slice(0, 5);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${comp.name} Alternative | CypAI`,
    description: `Compare CypAI vs ${comp.name} — features, pricing, and WhatsApp support for service businesses.`,
    url: `${BASE_URL}/alternatives/${comp.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${BASE_URL}/alternatives` },
        { '@type': 'ListItem', position: 3, name: `${comp.name} Alternative`, item: `${BASE_URL}/alternatives/${comp.slug}` },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <nav className="mx-auto max-w-5xl px-6 pt-8 sm:px-10">
        <ol className="flex items-center gap-2 text-xs text-zinc-500">
          <li><Link href="/" className="hover:text-zinc-300">Home</Link></li>
          <li>/</li>
          <li><Link href="/alternatives" className="hover:text-zinc-300">Alternatives</Link></li>
          <li>/</li>
          <li className="text-zinc-300">{comp.name}</li>
        </ol>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              {comp.name} Alternative
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              The smarter{' '}
              <span className="text-amber-400">{comp.name}</span>{' '}
              alternative for service businesses
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-300">{comp.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
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
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Pricing at a glance
            </p>
            <p className="text-sm leading-7 text-zinc-300">{comp.pricingNote}</p>
          </div>
        </div>
      </section>

      {/* ── Why people switch ────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Why businesses switch from {comp.name}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {comp.weaknesses.map((w) => (
              <li key={w} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <XIcon />
                <p className="text-sm leading-6 text-zinc-300">{w}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CypAI advantages ─────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            What you get with CypAI instead
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {comp.cypaiAdvantages.map((a) => (
              <li key={a} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <CheckIcon />
                <p className="text-sm leading-6 text-zinc-300">{a}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            CypAI vs {comp.name} — feature comparison
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-zinc-700 py-3 pr-6 text-left text-sm font-semibold text-zinc-400">
                    Feature
                  </th>
                  <th className="border-b border-zinc-700 py-3 px-4 text-center text-sm font-semibold text-blue-400">
                    CypAI
                  </th>
                  <th className="border-b border-zinc-700 py-3 px-4 text-center text-sm font-semibold text-zinc-400">
                    {comp.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comp.tableComparison.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900'}
                  >
                    <td className="py-3 pr-6 text-sm text-zinc-300">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <FeatureCell value={row.cypai} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <FeatureCell value={row.competitor} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {comp.name} vs CypAI — common questions
          </h2>
          <dl className="mt-8 space-y-6">
            {comp.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <dt className="text-base font-semibold text-white">{faq.q}</dt>
                <dd className="mt-3 text-sm leading-7 text-zinc-400">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to make the switch from {comp.name}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-blue-100">
            7-day free trial. No credit card. Live on your website and WhatsApp in 15 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/demo"
              className="rounded-2xl border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white/80"
            >
              See Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Other alternatives ───────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            More comparisons
          </h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {peerCompetitors.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/alternatives/${c.slug}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500/50 hover:text-white"
                >
                  {c.name} vs CypAI →
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/alternatives"
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-blue-500/50 hover:text-white"
              >
                All comparisons →
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
