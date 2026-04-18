import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'High-Yield Real Estate & Residency | CypAI',
  description: 'CypAI helps Northern Cyprus property teams qualify investor buyers and residency-led enquiries with multilingual, law-aware lead recovery.',
}

const pillars = [
  'Investor qualification',
  'Residency intent capture',
  '2026 law-aware responses',
  'Multilingual triage in 5 languages',
]

const examples = [
  'I want a high-yield apartment under €200k.',
  'Can you explain the 5-year residency route?',
  'I am relocating with my family this year.',
  'What is the best WhatsApp number for a portfolio review?',
]

export default function RealEstateResidencyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
          <p className="inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Real Estate & Residency</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Convert investor interest into qualified property and residency leads.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-400">CypAI is built for Northern Cyprus agencies that need fast qualification, stronger follow-up, and fewer cold leads from international buyers.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">See Live Demo</Link>
            <Link href="/sign-up" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">Book a Demo</Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="grid gap-4 md:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-200">{pillar}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Real messages CypAI can handle for agencies</h2>
          <ul className="mt-6 space-y-3">
            {examples.map((example) => (
              <li key={example} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">“{example}”</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Result you should expect</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400">Faster replies, fewer missed investor leads, and cleaner qualification data before your sales team follows up.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">View Market Fit</Link>
            <Link href="/pricing" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">View Plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}