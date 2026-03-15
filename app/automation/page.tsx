import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Automation Center | Less Manual Work with CypAI',
  description:
    'Discover how CypAI automates lead recovery, alerting, and follow-up operations so B2B SaaS teams can scale with less manual work.',
  alternates: {
    canonical: 'https://www.cypai.app/automation',
  },
}

const automationBlocks = [
  {
    title: 'Lead recovery automation',
    description:
      'Automatically process abandoned signup and payment events, send recovery messages, and monitor outcomes by event type.',
  },
  {
    title: 'Policy-driven retries',
    description:
      'Set retry windows and maximum retries per event to control delivery behavior without manual intervention.',
  },
  {
    title: 'Failure spike alerting',
    description:
      'Trigger alert notifications when failure rates cross thresholds, with cooldowns and destination controls.',
  },
  {
    title: 'Alert logs and exports',
    description:
      'Filter logs by trigger, outcome, and date range, then export CSV for ops, finance, and compliance reporting.',
  },
  {
    title: 'Webhook security',
    description:
      'Use signed webhook payloads and verification helpers to keep your automation pipelines secure and auditable.',
  },
  {
    title: 'Dashboard operations',
    description:
      'Use one dashboard for retries, policies, alert testing, and trend tracking instead of manual scripts.',
  },
]

export default function AutomationPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Automation</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Run more with less manual work</h1>
          <p className="mt-5 max-w-3xl text-zinc-400">
            CypAI gives B2B SaaS teams an automation control center for support, conversion recovery, and alert operations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {automationBlocks.map((item) => (
            <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">B2B SaaS outcomes you can expect</h2>
          <ul className="mt-6 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">Faster incident detection with less operational firefighting</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">Lower manual workload for support and growth teams</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">More recovered revenue from failed or abandoned funnels</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">Clear reporting with filterable audit-ready logs</li>
          </ul>
          <p className="mt-6 text-sm text-blue-300">Billing and subscription checkout remain processed via PayPal.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Open dashboard
          </Link>
          <Link href="/how-it-works" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
            Read setup flow
          </Link>
        </div>
      </section>
    </main>
  )
}
