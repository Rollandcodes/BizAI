import type { Metadata } from 'next';
import Link from 'next/link';

import { SEO_NICHES, SEO_CITIES } from '@/lib/seo-data';

const BASE_URL = 'https://www.cypai.app';

export const metadata: Metadata = {
  title: 'AI Chatbot by Business Type & City | CypAI',
  description:
    'Find CypAI tailored for your business type and location — medical tourism, real estate, residency, clinic, hotel, restaurant, gym, or law firm across all Cyprus cities.',
  keywords: [
    'AI lead engine by niche Cyprus',
    'AI chatbot for medical tourism Cyprus',
    'AI chatbot for real estate residency Cyprus',
    'AI chatbot for car sales Cyprus',
    'chatbot for hotels Cyprus',
    'AI lead capture Cyprus businesses',
    'WhatsApp chatbot Cyprus',
  ],
  alternates: { canonical: `${BASE_URL}/for` },
  openGraph: {
    title: 'AI Chatbot by Business Type & City | CypAI',
    description: 'Explore CypAI landing pages for every major business niche in Cyprus — all cities, all industries.',
    url: `${BASE_URL}/for`,
    siteName: 'CypAI',
    type: 'website',
  },
};

export default function ForIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 sm:px-10 text-center">
        <p className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Programmatic SEO
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          CypAI for every business type{' '}
          <span className="text-blue-400">across Cyprus</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Explore AI tools and lead capture templates specific to your industry, city, and target buyer intent.
        </p>
      </section>

      {/* Grid: niche × city */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
        {SEO_NICHES.map((niche) => (
          <div key={niche.slug} className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-2xl">{niche.emoji}</span>
              <h2 className="text-xl font-bold text-white">{niche.name}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {SEO_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/for/${niche.slug}/${city.slug}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 py-14">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Don&apos;t see your city or business type?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-300">
            CypAI works for any service business. Sign up and configure your AI assistant in 15 minutes.
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
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

