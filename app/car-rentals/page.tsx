import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Medical Tourism | CypAI',
  description: 'CypAI helps medical tourism clinics in Northern Cyprus qualify IVF, dental, and aesthetic enquiries in five languages with law-aware triage and revenue recovery.',
}

const pillars = [
  'IVF, dental, and aesthetics triage',
  '2026 law-compliant responses',
  'Multilingual qualification in RU / TR / EN / AR / DE',
  'WhatsApp and website lead recovery',
]

const examples = [
  'I want IVF options for next month.',
  'Do you handle dental implants for international patients?',
  'Can you explain the travel and residency implications?',
  'What is the best WhatsApp number for consultation?',
]

export default function MedicalTourismPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Medical Tourism</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Convert international patient enquiries into qualified consultations.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-400">CypAI is tuned for Northern Cyprus clinics that need fast, multilingual lead qualification for IVF, dental, and aesthetics.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">See Live Demo</Link>
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
          <h2 className="text-3xl font-extrabold text-white">Real messages CypAI can handle for clinics</h2>
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
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400">Faster replies, fewer missed international leads, and cleaner consultation requests with all key details collected before your team follows up.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">View Market Fit</Link>
            <Link href="/pricing" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">View Plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}