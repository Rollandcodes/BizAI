import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How CypAI Works | Simple Step-by-Step Guide for Business Owners',
  description:
    'Learn how CypAI works in very simple language. See how to set it up, train it, connect your website and WhatsApp, and use each feature step by step.',
  alternates: {
    canonical: 'https://www.cypai.app/how-it-works',
  },
}

const steps = [
  {
    title: 'Sign up and enter your business details',
    detail:
      'Tell CypAI your business name, what kind of business you run, your WhatsApp number, your website, your working hours, and the languages your customers speak.',
  },
  {
    title: 'Teach the AI your prices and common questions',
    detail:
      'Add the things customers always ask about: prices, availability, booking rules, delivery, opening hours, or anything else that matters.',
  },
  {
    title: 'Put CypAI on your website and connect WhatsApp',
    detail:
      'Install the website chat widget and, if you want, connect WhatsApp too. That way customers can talk to your business wherever they already message you.',
  },
  {
    title: 'Watch conversations, leads, and bookings in the dashboard',
    detail:
      'Every chat is saved for you. You can see who asked what, who became a lead, and what needs your follow-up, all in one clean place.',
  },
  {
    title: 'Improve the AI using real customer questions',
    detail:
      'If customers keep asking the same new question, add that answer to your training. CypAI gets stronger as you teach it from real life.',
  },
  {
    title: 'Use analytics and follow-ups to grow',
    detail:
      'Once the basics are working, use the CRM, follow-up tools, analytics, and automation features to recover more leads and stay organized.',
  },
]

const featureMapping = [
  ['AI Chat Widget', 'Talks to website visitors right away so they do not leave before asking their question.'],
  ['WhatsApp Integration', 'Lets CypAI help customers on WhatsApp too, so you do not miss messages there.'],
  ['CRM + Lead Pipeline', 'Saves names, phone numbers, and lead status so you stop using memory or messy notes.'],
  ['Bookings', 'Collects booking details in a clean way so you can confirm them faster.'],
  ['Follow-up Tools', 'Helps you come back to interested customers who got distracted or did not finish.'],
  ['Analytics Dashboard', 'Shows simple numbers so you can see whether chats and leads are improving or dropping.'],
  ['Recovery Automation', 'Helps bring back signups or payments that were started but not completed.'],
  ['Agent Audit', 'Lets you review what the AI said so you can improve quality and stay safe.'],
]

const beginnerExplainers = [
  {
    title: 'If you have never used an AI tool before',
    body:
      'That is fine. You do not need to “learn AI” first. Just think of CypAI as a helper you train with your own business information. If you can explain your business to a new employee, you can set up CypAI.',
  },
  {
    title: 'If you do not have a developer',
    body:
      'You can still use CypAI. The onboarding wizard does most of the work. If your website allows custom code, you can paste the widget yourself. If not, you can send the widget code to whoever manages your website.',
  },
  {
    title: 'If you feel like you need to set up everything at once',
    body:
      'You do not. Start with business info, prices, FAQs, and the website widget. That already gives you value. Then add WhatsApp, bookings, analytics, and follow-ups one step at a time.',
  },
]

const dailyUse = [
  'Open the dashboard and read new conversations.',
  'Reply to strong leads or booking requests quickly.',
  'Notice any question the AI could not answer well.',
  'Update your FAQs, prices, or instructions when needed.',
  'Check analytics to see how many chats and leads you got.',
]

const nicheGuides = [
  {
    title: 'How CypAI works for car rentals',
    detail: 'Built for availability checks, pricing questions, date capture, and booking requests.',
    href: '/how-it-works/car-rentals',
  },
  {
    title: 'How CypAI works for clinics',
    detail: 'Built for patient inquiries, appointment request capture, and cleaner front-desk workflow.',
    href: '/how-it-works/clinics',
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 bg-zinc-950 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">How it works</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">How to use CypAI in your business, step by step</h1>
          <p className="mt-5 max-w-3xl text-zinc-400">
            This page explains CypAI in simple words. If you are not technical, that is okay. We will walk through what CypAI does, how you set it up, and how you use it in everyday business life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/setup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
              Open Beginner Setup Guide
            </Link>
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900">
              Read Full Blog Walkthrough
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Step {index + 1}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{step.title}</h2>
                <p className="mt-3 text-base leading-7 text-zinc-400">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">What each feature means in plain language</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-2 bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              <div className="p-3">Feature</div>
              <div className="border-l border-zinc-800 p-3">What it helps you do</div>
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">Beginner guides by business type</h2>
          <p className="mt-3 max-w-3xl text-zinc-400">
            Pick the guide that matches your business so you get examples that feel familiar.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {nicheGuides.map((guide) => (
              <article key={guide.href} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{guide.detail}</p>
                <Link href={guide.href} className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                  Open guide
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">A few things people worry about at the start</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {beginnerExplainers.map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">What you do after setup</h2>
          <ul className="mt-8 space-y-3">
            {dailyUse.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">✓</span>
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Need a slower walkthrough?</h2>
            <p className="mt-2 text-sm text-zinc-400">Use the setup guide and beginner blog if you want the whole process explained more gently and in more detail.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/setup" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
              Open setup guide
            </Link>
            <Link href="/blog/how-to-set-up-cypai-in-your-business-a-beginner-friendly-guide" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
              Read blog guide
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
