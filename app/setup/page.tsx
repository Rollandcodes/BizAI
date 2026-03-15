import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CypAI Setup Guide | Step-by-Step Beginner Walkthrough',
  description:
    'A simple step-by-step setup guide for CypAI. Learn how to onboard yourself, train the AI, connect your website and WhatsApp, and use the dashboard with zero technical stress.',
  alternates: {
    canonical: 'https://www.cypai.app/setup',
  },
};

const setupSteps = [
  {
    step: 'Step 1',
    title: 'Create your account',
    body:
      'Sign up, choose your plan, and enter your business email. Do not worry about making the perfect choice. You can improve your setup as you go.',
  },
  {
    step: 'Step 2',
    title: 'Tell CypAI about your business',
    body:
      'Add your business name, type, WhatsApp number, website, business hours, and the languages your customers speak. This is how the AI learns the basics.',
  },
  {
    step: 'Step 3',
    title: 'Teach it your prices and FAQs',
    body:
      'Write down your real prices and the common questions customers always ask. Use plain words. The clearer you are, the better the AI answers.',
  },
  {
    step: 'Step 4',
    title: 'Customize the chat widget',
    body:
      'Pick your widget color, where it should appear, and the welcome message customers will see first. Keep it simple and friendly.',
  },
  {
    step: 'Step 5',
    title: 'Add CypAI to your website',
    body:
      'Copy the widget code from your dashboard and paste it into your website. If you have a developer, send them the code. If you use a website builder, paste it in the custom code section.',
  },
  {
    step: 'Step 6',
    title: 'Connect WhatsApp if you use it',
    body:
      'If customers message you on WhatsApp, connect it so CypAI can answer there too and keep everything organized in one place.',
  },
  {
    step: 'Step 7',
    title: 'Watch your conversations and leads',
    body:
      'Open the dashboard every day or every few days. Check new chats, follow up with leads, and improve the AI when you see repeated questions.',
  },
];

const featureCards = [
  {
    title: 'Website Chat Widget',
    body: 'This is the little chat bubble on your website. It helps answer questions immediately so visitors do not leave without talking to you.',
  },
  {
    title: 'WhatsApp Integration',
    body: 'This lets CypAI talk to customers on WhatsApp too, so you do not have to switch between different places and forget conversations.',
  },
  {
    title: 'CRM & Leads',
    body: 'This is your organized customer list. It saves names, phone numbers, and conversations so you know who to contact and who is serious.',
  },
  {
    title: 'Bookings',
    body: 'If your business takes bookings or appointments, CypAI can collect the details and help you confirm them much faster.',
  },
  {
    title: 'Follow-ups',
    body: 'This helps you talk again to people who showed interest but did not finish. Many sales are saved by a simple second message.',
  },
  {
    title: 'Analytics',
    body: 'This shows what is happening in your business in simple numbers: chats, leads, activity times, and trends. It helps you improve without guessing.',
  },
];

const dailyChecklist = [
  'Open the dashboard and check new conversations.',
  'Reply to serious leads or bookings quickly.',
  'Look for questions customers keep asking again and again.',
  'Update your FAQs or prices if something is missing.',
  'Check analytics to see whether lead volume is going up or down.',
];

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <p className="inline-flex rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Beginner Setup Guide
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            How to set up CypAI in your business, step by step
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            This page is made for non-technical business owners. No jargon. No confusing instructions. Just the exact steps you need to get CypAI working in your business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              Start Free Trial
            </Link>
            <Link href="/how-it-works" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Read How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Visual walkthrough (so you can see each step)</h2>
          <p className="mt-3 max-w-3xl text-zinc-400">
            These illustrations show what the setup and dashboard flow looks like, so it feels easier before you start.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              {
                src: '/images/guides/onboarding-wizard.svg',
                alt: 'CypAI onboarding wizard visual',
                title: '1) Fill business info',
              },
              {
                src: '/images/guides/whatsapp-sync.svg',
                alt: 'CypAI website and WhatsApp sync visual',
                title: '2) Connect channels',
              },
              {
                src: '/images/guides/dashboard-leads.svg',
                alt: 'CypAI dashboard and leads visual',
                title: '3) Track leads and conversations',
              },
            ].map((item) => (
              <article key={item.src} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <Image src={item.src} alt={item.alt} width={1200} height={720} className="h-auto w-full" />
                <p className="border-t border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-200">{item.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="grid gap-4 md:grid-cols-2">
            {setupSteps.map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">{item.step}</p>
                <h2 className="mt-3 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">What each main feature means in normal language</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">How to onboard yourself without getting stuck</h2>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base leading-8 text-zinc-300">
              Do not try to make everything perfect on day one. The best approach is to make CypAI useful first, then make it better every week. Start with your business info, your prices, and your top 10 questions. Then install the widget. That gives you a working system quickly.
            </p>
            <p className="mt-4 text-base leading-8 text-zinc-300">
              After that, use real customer conversations to improve your setup. If customers ask something new, teach the AI that answer. If many people ask for bookings, improve the booking flow. If leads are not being followed up, use CRM and follow-up tools more consistently.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Simple weekly checklist</h2>
          <ul className="mt-6 space-y-3">
            {dailyChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">✓</span>
                <span className="text-sm leading-7 text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <h2 className="text-3xl font-extrabold text-white">Need the long version?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-400">
            Read the full beginner blog guide for a deeper explanation of how to use CypAI in everyday business life.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
              Read Full Blog Guide
            </Link>
            <Link href="/pricing" className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
