import type { Metadata } from 'next'
import Link from 'next/link'

import { SEO_COMPETITORS } from '@/lib/seo-data'

const BASE_URL = 'https://www.cypai.app'

export const metadata: Metadata = {
  title: 'Best Alternatives to Tidio, Intercom, Zendesk & More | CypAI',
  description: 'Compare CypAI against live chat tools and see why medical tourism and residency-led property teams choose it for WhatsApp AI and lead recovery.',
  alternates: { canonical: `${BASE_URL}/alternatives` },
}

export default function AlternativesIndexPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center sm:px-10">
        <p className="mb-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Competitor Comparisons</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">The best alternative for high-ticket lead recovery</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">See how CypAI compares to live chat tools — and why medical tourism and residency-led property teams choose CypAI for multilingual qualification and faster follow-up.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/sign-up" className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-blue-500">Try CypAI Free →</Link>
          <Link href="/pricing" className="rounded-2xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white">See Pricing</Link>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:px-10">
        <h2 className="mb-8 text-2xl font-bold text-white">All comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_COMPETITORS.map((comp) => (
            <Link key={comp.slug} href={`/alternatives/${comp.slug}`} className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500/50 hover:bg-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Alternative to</p>
                  <h3 className="mt-1 text-lg font-bold text-white group-hover:text-blue-400 transition">{comp.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500 capitalize">{comp.category}</p>
                </div>
                <span className="text-blue-400 opacity-0 transition group-hover:opacity-100">→</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400 line-clamp-2">{comp.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}