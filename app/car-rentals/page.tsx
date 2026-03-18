'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CarRentalsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="CypAI Home">
            <Image
              src="/images/cypai-logo.png"
              alt="CypAI"
              width={160}
              height={48}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Pricing</a>
            <Link href="/demo" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Demo</Link>
          </nav>
          <Link
            href="/signup?plan=pro"
            className="rounded-lg bg-[#e8a020] px-4 py-2 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#1a1a2e] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Stop losing bookings<br />
            <span className="text-[#e8a020]">while you sleep.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
            Your car rental business answers WhatsApp at 3am. CypAI answers automatically — in any language. Capture every enquiry, 24/7.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
            >
              Start Free Trial — No Credit Card →
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-gray-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              See Live Demo →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span>✓ 7-day free trial</span>
            <span>·</span>
            <span>✓ Setup in 15 minutes</span>
            <span>·</span>
            <span>✓ Cancel anytime</span>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Join [X] Cyprus businesses already using CypAI
          </p>
        </div>
      </section>

      {/* Pain Section - Sound familiar? */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#1a1a2e]">Sound familiar?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Late-night enquiries get missed</p>
                <p className="mt-1 text-gray-600">Customers WhatsApp at 11pm asking "how much for an SUV for 3 days?" You're asleep. They book with a competitor.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Language barriers with tourists</p>
                <p className="mt-1 text-gray-600">International tourists message in Russian, Arabic, German. You only speak Turkish and English. You struggle to reply.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Missed bookings because you're busy</p>
                <p className="mt-1 text-gray-600">You're at the car yard, not at a computer. Enquiries go unanswered. Customers move on.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Repetitive questions waste your time</p>
                <p className="mt-1 text-gray-600">40% of messages are "what's your cheapest car?" — the same answer, every single time.</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-lg font-semibold text-[#1a1a2e]">
            CypAI fixes all of this. <span className="text-[#e8a020]">Automatically.</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1a1a2e]">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">1</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Tell CypAI about your business</h3>
              <p className="mt-2 text-gray-600">Add your prices, fleet details, hours, and policies. Takes 10 minutes. The AI learns your business quickly.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">2</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Connect your WhatsApp and website</h3>
              <p className="mt-2 text-gray-600">One line of code for the website widget. 2 minutes to connect your WhatsApp Business number.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">3</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Watch enquiries turn into bookings</h3>
              <p className="mt-2 text-gray-600">CypAI handles conversations 24/7 in 5 languages. You review the dashboard and confirm bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Everything car rental businesses need</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">Built specifically for car rental companies in Cyprus</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📱</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">WhatsApp Automation</h3>
              <p className="mt-2 text-gray-600">90% of your customers contact you via WhatsApp. CypAI answers instantly, 24/7.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Multi-Language Replies</h3>
              <p className="mt-2 text-gray-600">Tourists from 10+ countries message in their language. CypAI replies in kind.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">💰</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Instant Price Quotes</h3>
              <p className="mt-2 text-gray-600">AI provides exact quotes from your rate cards. No back-and-forth needed.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">👥</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Lead Capture</h3>
              <p className="mt-2 text-gray-600">Every enquiry is captured — even "do you have availability for next week?"</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🔄</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Automatic Follow-up</h3>
              <p className="mt-2 text-gray-600">Follow up automatically with people who enquired but didn't book.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📅</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Booking Confirmations</h3>
              <p className="mt-2 text-gray-600">Confirmation sent automatically. Reduce no-shows with booking details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Your customers speak many languages.<br />CypAI speaks them all.</h2>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-3xl">
            <span>🇬🇧</span>
            <span>🇹🇷</span>
            <span>🇸🇦</span>
            <span>🇷🇺</span>
            <span>🇬🇷</span>
          </div>
          <p className="text-gray-600">Auto-detects language. Responds automatically. No translator needed.</p>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a2e]">Common questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"I don't trust AI to represent my business"</h3>
              <p className="mt-2 text-gray-600">You train CypAI with your exact prices and policies. It says exactly what you tell it to say. You're always in control.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Setup sounds complicated"</h3>
              <p className="mt-2 text-gray-600">15 minutes. We walk you through it. One line of code for your website, or just connect your WhatsApp. That's it.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"$79/month is expensive for a small business"</h3>
              <p className="mt-2 text-gray-600">One missed booking in peak season = €80-150 lost. CypAI pays for itself in 1 recovered booking per month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Simple pricing</h2>
          <p className="mb-12 text-center text-gray-600">7-day free trial on all plans. No credit card required.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase text-gray-500">Starter</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $29<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">Perfect for small local businesses</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 500 messages/month</li>
                <li>✓ Website chat widget</li>
                <li>✓ Lead capture</li>
                <li>✓ Basic CRM</li>
                <li>✓ 5 language support</li>
              </ul>
              <Link
                href="/signup?plan=starter"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-[#e8a020] bg-white p-8 shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e8a020] px-4 py-1.5 text-xs font-bold text-[#1a1a2e]">
                ⭐ Most Popular
              </span>
              <p className="text-sm font-semibold uppercase text-gray-500">Pro</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $79<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For growing businesses</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Unlimited messages</li>
                <li>✓ WhatsApp integration</li>
                <li>✓ Full CRM</li>
                <li>✓ Booking system</li>
                <li>✓ Follow-up tools</li>
                <li>✓ Multi-language support</li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="mt-8 block rounded-xl bg-[#e8a020] px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Business */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase text-gray-500">Business</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $149<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For multi-location businesses</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-location support</li>
                <li>✓ Agency workspace</li>
                <li>✓ SLA guarantee</li>
                <li>✓ Priority support</li>
              </ul>
              <Link
                href="/signup?plan=business"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Secure card payment powered by Paddle — trusted by 3,000+ software companies.<br />
            Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Set up before peak season.<br />Takes 15 minutes.</h2>
          <Link
            href="/signup?plan=pro"
            className="mt-8 inline-block rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
          >
            Start Your Free Trial Now →
          </Link>
          <p className="mt-4 text-sm text-gray-400">No credit card. No commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f9fb] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/images/cypai-logo.png"
                alt="CypAI"
                width={120}
                height={36}
                className="h-7 w-auto"
              />
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1a1a2e]">Home</Link>
              <Link href="#pricing" className="hover:text-[#1a1a2e]">Pricing</Link>
              <Link href="/demo" className="hover:text-[#1a1a2e]">Demo</Link>
              <Link href="/contact" className="hover:text-[#1a1a2e]">Contact</Link>
              <Link href="/privacy" className="hover:text-[#1a1a2e]">Privacy</Link>
            </div>
            <p className="text-sm text-gray-500">© 2025 CypAI. Built in Northern Cyprus.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
