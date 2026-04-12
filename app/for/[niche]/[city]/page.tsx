import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  getNicheSEO,
  getCitySEO,
  getAllNicheCity,
  SEO_NICHES,
  SEO_CITIES,
} from '@/lib/seo-data';

const BASE_URL = 'https://www.cypai.app';

type PageProps = {
  params: Promise<{ niche: string; city: string }>;
};

export async function generateStaticParams() {
  return getAllNicheCity();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { niche: nicheSlug, city: citySlug } = await params;
  const niche = getNicheSEO(nicheSlug);
  const city = getCitySEO(citySlug);
  if (!niche || !city) return { title: 'Not Found' };

  const title = `${niche.keyword.charAt(0).toUpperCase() + niche.keyword.slice(1)} in ${city.name} | CypAI`;
  const description = `CypAI is the fastest way for ${city.name} ${niche.plural.toLowerCase()} to capture leads, answer WhatsApp messages, and handle customer inquiries 24/7 — starting at $49/month.`;
  const url = `${BASE_URL}/for/${niche.slug}/${city.slug}`;

  return {
    title,
    description,
    keywords: [
      `${niche.keyword} ${city.name}`,
      `AI chatbot ${city.name}`,
      `${niche.name.toLowerCase()} AI assistant ${city.name}`,
      `WhatsApp chatbot ${city.name}`,
      `customer service AI ${city.country}`,
      `lead capture ${niche.name.toLowerCase()} ${city.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'CypAI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function NicheCityPage({ params }: PageProps) {
  const { niche: nicheSlug, city: citySlug } = await params;
  const niche = getNicheSEO(nicheSlug);
  const city = getCitySEO(citySlug);
  if (!niche || !city) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CypAI',
    applicationCategory: 'BusinessApplication',
    description: `AI chatbot for ${niche.plural.toLowerCase()} in ${city.name}`,
    url: `${BASE_URL}/for/${niche.slug}/${city.slug}`,
    offers: {
      '@type': 'Offer',
      price: '49',
      priceCurrency: 'USD',
      description: 'Starting price per month',
    },
    operatingSystem: 'Web',
    featureList: niche.features,
  };

  // Peer city suggestions for internal linking
  const peerCities = SEO_CITIES.filter((c) => c.slug !== city.slug).slice(0, 4);
  const peerNiches = SEO_NICHES.filter((n) => n.slug !== niche.slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:px-10 text-center">
        <p className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          {city.name} · {niche.name}
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {niche.emoji} {niche.keyword.charAt(0).toUpperCase() + niche.keyword.slice(1)}{' '}
          <span className="text-blue-400">in {city.name}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          CypAI answers every customer enquiry, captures every lead, and handles{' '}
          <strong className="text-white">{niche.useCase}</strong> — even while you sleep. Built for {city.name} {niche.plural.toLowerCase()}.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Free — 7-Day Trial →
          </Link>
          <Link
            href="/demo"
            className="rounded-2xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            See Live Demo
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-500">No credit card required. Live in 15 minutes.</p>
      </section>

      {/* ── Pain Points ──────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Sound familiar? Common challenges for {city.name} {niche.plural.toLowerCase()}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {niche.painPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <span className="mt-0.5 text-red-400 text-lg leading-none">✗</span>
                <p className="text-sm leading-6 text-zinc-300">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Solution / Features ──────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">The Fix</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            What CypAI does for {niche.plural.toLowerCase()} in {city.name}
          </h2>
          <ul className="mt-8 space-y-4">
            {niche.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-blue-600 text-center text-xs font-bold leading-5 text-white">✓</span>
                <p className="text-base leading-7 text-zinc-300">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4 sm:px-10">
          {[
            { stat: '24/7', label: 'Customer Coverage' },
            { stat: '5', label: 'Languages Supported' },
            { stat: '15 min', label: 'Setup Time' },
            { stat: '$49', label: 'Starting / Month' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-white">{stat}</p>
              <p className="mt-1 text-sm font-medium text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            How it works for a {city.name} {niche.name.toLowerCase()}
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Connect in 15 minutes',
                body: `Complete our onboarding wizard with your ${niche.name.toLowerCase()} details. No developer. No code.`,
              },
              {
                step: '2',
                title: 'AI goes live on your site + WhatsApp',
                body: 'Customers asking questions at any hour get instant, accurate replies — in their own language.',
              },
              {
                step: '3',
                title: 'Leads appear in your dashboard',
                body: `Every enquiry from ${city.name} customers is captured with full contact details and conversation history, ready for your follow-up.`,
              },
            ].map(({ step, title, body }) => (
              <li key={step} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <span className="text-4xl font-black text-blue-500">{step}</span>
                <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-6">
            {niche.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <dt className="text-base font-semibold text-white">{faq.q}</dt>
                <dd className="mt-3 text-sm leading-7 text-zinc-400">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Internal Linking ─────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Other cities
              </h3>
              <ul className="mt-4 space-y-2">
                {peerCities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/for/${niche.slug}/${c.slug}`}
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {niche.keyword.charAt(0).toUpperCase() + niche.keyword.slice(1)} in {c.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Other business types in {city.name}
              </h3>
              <ul className="mt-4 space-y-2">
                {peerNiches.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/for/${n.slug}/${city.slug}`}
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {n.keyword.charAt(0).toUpperCase() + n.keyword.slice(1)} in {city.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to put your {city.name} {niche.name.toLowerCase()} on autopilot?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-300">
            Join businesses across Cyprus using CypAI to capture more leads, answer more questions, and close more sales — without hiring more staff.
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
              See Plans & Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
