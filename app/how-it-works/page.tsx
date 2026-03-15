import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How CypAI Works | B2B SaaS Setup Guide',
  description:
    'Learn how to connect CypAI to your website and WhatsApp, automate support and lead recovery, and run your B2B SaaS operations with less manual work.',
  alternates: {
    canonical: 'https://www.cypai.app/how-it-works',
  },
}

const steps = [
  {
    title: 'Create your account and configure business context',
    detail:
      'Add business type, service catalog, prices, FAQs, and custom AI instructions so answers match your exact offer.',
  },
  {
    title: 'Connect channels yourself in minutes',
    detail:
      'Paste the widget script in your website and connect WhatsApp for omnichannel support without engineering effort.',
  },
  {
    title: 'Activate automation policies',
    detail:
      'Enable retry policies, alert thresholds, and webhook notifications so recovery flows run automatically.',
  },
  {
    title: 'Track outcomes and optimize',
    detail:
      'Use CRM, conversation analytics, and alert logs to improve conversion rate and reduce operational workload.',
  },
]

const featureMapping = [
  ['AI Chat Widget', 'Missed website leads and slow responses'],
  ['WhatsApp Integration', 'Fragmented support across channels'],
  ['Recovery Automation', 'Lost revenue from abandoned signup and payment'],
  ['Alerting + Webhooks', 'Late incident detection and manual monitoring'],
  ['CRM + Lead Pipeline', 'Manual lead tracking in spreadsheets'],
  ['Analytics Dashboard', 'No visibility into language, volume, and conversion trends'],
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 bg-zinc-950 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">How it works</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">From setup to automation in one B2B SaaS workflow</h1>
          <p className="mt-5 max-w-3xl text-zinc-400">
            CypAI is built to reduce manual support and conversion recovery work. The flow below shows exactly how teams connect the system, automate operations, and scale.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Step {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">What CypAI solves per feature</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-2 bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <div className="p-3">Feature</div>
              <div className="border-l border-zinc-800 p-3">Problem solved</div>
            </div>
            {featureMapping.map(([feature, problem], i) => (
              <div key={feature} className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950'}`}>
                <div className="border-t border-zinc-800 p-3 text-zinc-100">{feature}</div>
                <div className="border-l border-t border-zinc-800 p-3 text-zinc-400">{problem}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Billing stays on PayPal</h2>
            <p className="mt-2 text-sm text-zinc-400">CypAI checkout remains PayPal-based so your payment receiver stays exactly where you want it.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
              View pricing
            </Link>
            <Link href="/signup?plan=pro" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
              Start free trial
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
