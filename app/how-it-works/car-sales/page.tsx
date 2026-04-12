import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How CypAI Works for Car Sales | Beginner Guide',
  description:
    'A simple beginner guide for car dealerships and auto sales teams. Learn how CypAI handles stock inquiries, financing questions, and test-drive lead capture from website and WhatsApp.',
  alternates: {
    canonical: 'https://www.cypai.app/how-it-works/car-sales',
  },
};

const steps = [
  {
    title: 'Add your car sales information',
    detail:
      'Enter your available models, pricing ranges, financing notes, showroom hours, and common buying questions.',
  },
  {
    title: 'Connect website and WhatsApp',
    detail:
      'Install the chat widget and connect WhatsApp so buyers can ask questions from any channel in one place.',
  },
  {
    title: 'Capture qualified buyer leads',
    detail:
      'CypAI collects name, phone number, preferred model, and test-drive request details so your sales team can follow up fast.',
  },
  {
    title: 'Close opportunities with faster follow-up',
    detail:
      'Use the dashboard to review lead intent and continue the conversation with clear next steps for viewing, financing, or purchase.',
  },
];

const examples = [
  'Is the 2021 Toyota Corolla still available?',
  'How much is monthly payment with financing?',
  'Can I book a test drive for Saturday?',
  'Do you accept trade-ins?',
  'What is the mileage and warranty on this car?',
];

export default function CarSalesHowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="inline-flex rounded-full border border-teal-500/20 bg-teal-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Car Sales Beginner Guide
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            How CypAI works for car sales
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            If you sell cars, this page explains how CypAI helps you answer buyer questions quickly, qualify real leads, and schedule test drives without extra admin work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500">
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
              alt="CypAI dashboard showing car sales conversations and qualified leads"
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
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">Step {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Common car sales questions CypAI can answer</h2>
          <ul className="mt-6 space-y-3">
            {examples.map((example) => (
              <li key={example} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                &ldquo;{example}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Result you should expect</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-zinc-400">
            Faster first response, better-qualified test-drive requests, and fewer serious buyers lost because your team replied too late.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Read Full Beginner Blog
            </Link>
            <Link href="/pricing" className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-500">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

