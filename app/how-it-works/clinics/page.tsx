import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How CypAI Works for Clinics | Beginner Guide',
  description:
    'A simple beginner guide for clinics and medical practices. Learn how CypAI handles patient inquiries, appointment requests, and follow-up workflows with clear step-by-step onboarding.',
  alternates: {
    canonical: 'https://www.cypai.app/how-it-works/clinics',
  },
};

const steps = [
  {
    title: 'Add your clinic basics',
    detail:
      'Enter services, consultation hours, simple pricing guidance, location details, and common patient questions.',
  },
  {
    title: 'Set communication rules',
    detail:
      'Tell CypAI what it can answer and what should be escalated to your team. This keeps replies safe and clear.',
  },
  {
    title: 'Capture appointment requests',
    detail:
      'CypAI asks for patient name, phone number, preferred date, and service type so your reception team can confirm quickly.',
  },
  {
    title: 'Use dashboard follow-up',
    detail:
      'Your team checks leads and appointment requests in one place and replies faster with less admin stress.',
  },
];

const examples = [
  'Are you open on Saturday?',
  'How much is first consultation?',
  'I need an appointment this week.',
  'Do you have female doctor available?',
  'Where is your clinic located?',
];

export default function ClinicHowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Clinic Beginner Guide
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            How CypAI works for clinics
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            This page explains, in simple language, how clinics can use CypAI to answer patient questions and organize appointment requests without technical complexity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              Start Free Trial
            </Link>
            <Link href="/setup" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Beginner Setup Steps
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src="/images/guides/dashboard-leads.svg"
              alt="CypAI dashboard showing patient conversations and leads for clinic workflows"
              width={1200}
              height={720}
              className="h-auto w-full"
              priority
            />
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
          <h2 className="text-3xl font-extrabold text-white">Common clinic questions CypAI can answer</h2>
          <ul className="mt-6 space-y-3">
            {examples.map((example) => (
              <li key={example} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                “{example}”
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Result you should expect</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400">
            Better patient response speed, fewer missed appointment requests, and a cleaner daily workflow for your reception and admin team.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Read Full Beginner Blog
            </Link>
            <Link href="/pricing" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

