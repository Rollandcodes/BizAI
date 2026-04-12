import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How CypAI Works for Car Rentals | Beginner Guide',
  description:
    'A simple beginner guide for car rental businesses. Learn how to use CypAI to answer inquiries, capture bookings, and follow up with leads from website and WhatsApp.',
  alternates: {
    canonical: 'https://www.cypai.app/how-it-works/car-rentals',
  },
};

const steps = [
  {
    title: 'Set up your rental information',
    detail:
      'Add your car types, daily prices, required documents, opening hours, and common policies like deposits and insurance.',
  },
  {
    title: 'Connect website and WhatsApp',
    detail:
      'Install the widget on your website and connect WhatsApp so tourist and local inquiries come into one organized workflow.',
  },
  {
    title: 'Let CypAI collect booking details',
    detail:
      'CypAI asks for name, phone number, pickup date, return date, and preferred car type so your team gets a complete request.',
  },
  {
    title: 'Confirm bookings faster',
    detail:
      'Use the dashboard to review requests and follow up quickly with available options, documents, and payment steps.',
  },
];

const examples = [
  'Do you have SUV available from Friday to Monday?',
  'How much is economy car per day?',
  'Can you deliver to airport?',
  'What documents do I need for rental?',
  'Can I pay cash at pickup?',
];

export default function CarRentalHowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Car Rental Beginner Guide
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            How CypAI works for car rentals
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            If you run a car rental business, this page shows exactly how CypAI helps you answer inquiries, collect booking details, and reduce missed leads.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
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
              src="/images/guides/whatsapp-sync.svg"
              alt="CypAI website and WhatsApp messages syncing into one dashboard for car rental leads"
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
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Step {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-14">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Real messages CypAI can handle for rentals</h2>
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
            Faster replies, fewer missed weekend leads, and cleaner booking requests with all key details collected before your team follows up.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Read Full Beginner Blog
            </Link>
            <Link href="/pricing" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

