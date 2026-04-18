import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'How CypAI Works for Medical Tourism | Beginner Guide',
  description: 'Learn how CypAI helps medical tourism clinics qualify IVF, dental, and aesthetics enquiries with multilingual, law-aware lead recovery.',
}

const steps = [
  { title: 'Set up your treatment info', detail: 'Add your services, common questions, timelines, and WhatsApp contact flow.' },
  { title: 'Connect website and WhatsApp', detail: 'Bring all enquiries into one organized workflow for fast qualification.' },
  { title: 'Let CypAI triage the lead', detail: 'CypAI asks for treatment type, travel timing, budget, and contact details.' },
  { title: 'Confirm consultations faster', detail: 'Use the dashboard to follow up with the strongest patient leads first.' },
]

const examples = [
  'I need a dental implant consultation next month.',
  'Do you handle IVF for overseas patients?',
  'Can you explain the travel and follow-up process?',
  'What is the best WhatsApp number for a private consultation?',
]

export default function MedicalTourismHowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Medical Tourism Beginner Guide</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">How CypAI works for medical tourism clinics</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">If you run a clinic in Northern Cyprus, this page shows exactly how CypAI helps you answer enquiries, collect consultation details, and reduce missed international leads.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Start Free Trial</Link>
            <Link href="/demo" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">See Live Demo</Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image src="/images/guides/whatsapp-sync.svg" alt="CypAI website and WhatsApp messages syncing into one dashboard for medical tourism leads" width={1200} height={720} className="h-auto w-full" priority />
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Step {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-300">{item.detail}</p>
              </article>
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
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400">Faster replies, fewer missed weekend inquiries, and cleaner consultation requests with all key details collected before your team follows up.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">Read Full Beginner Blog</Link>
            <Link href="/pricing" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">View Plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}