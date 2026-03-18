'use client'

import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Hotels | CypAI',
}

export default function HotelsPage() {
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
          <span className="mb-4 inline-block rounded-full bg-[#e8a020]/20 px-4 py-2 text-sm font-semibold text-[#e8a020]">
            🏨 For Hotels & Guesthouses in Cyprus
          </span>
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            Your hotel never sleeps.<br />Neither does your AI receptionist.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            CypAI answers guest enquiries in any language, captures direct bookings 24/7, and saves you 15% Booking.com commission.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
            >
              Start Free Trial — No Credit Card
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-gray-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              See Live Demo →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <span>✓ 7-day free trial</span>
            <span>·</span>
            <span>✓ Setup in 15 minutes</span>
            <span>·</span>
            <span>✓ Cancel anytime</span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Join 200+ Cyprus businesses already using CypAI
          </p>
        </div>
      </section>

      {/* Pain Section - Sound familiar? */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#1a1a2e]">Sound familiar?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">💤</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">International guests message at 2am — <strong>no one replies</strong></p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You lose <strong>direct bookings to Booking.com</strong> because you reply too slowly</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Guests write in <strong>Russian, Arabic, German</strong> — hard to respond correctly</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🔁</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You answer <strong>the same room rate and availability questions</strong> every day</p>
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
              <h3 className="text-xl font-bold text-[#1a1a2e]">Tell CypAI about your hotel</h3>
              <p className="mt-2 text-gray-600">Add room types, rates, amenities, policies. Takes 10 minutes.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">2</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Connect WhatsApp and your website</h3>
              <p className="mt-2 text-gray-600">One line of code for the website widget. 2 minutes to connect your WhatsApp Business number.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">3</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Watch enquiries become bookings</h3>
              <p className="mt-2 text-gray-600">Every enquiry answered instantly in 5 languages. More direct bookings. Less commission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Everything hotels need</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">Built specifically for hotels and guesthouses in Cyprus</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">24/7 Guest Enquiries</h3>
              <p className="mt-2 text-gray-600">Answer every guest enquiry instantly — even at 3am.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">💰</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Direct Booking Capture</h3>
              <p className="mt-2 text-gray-600">Guests book directly — bypass Booking.com and save 15-25% commission.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌐</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Multi-Language Responses</h3>
              <p className="mt-2 text-gray-600">Russian, Arabic, English, Turkish, Greek — all handled automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🏠</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Room Rate FAQ</h3>
              <p className="mt-2 text-gray-600">Instant answers about rates and availability — 24/7.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📅</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Availability Checking</h3>
              <p className="mt-2 text-gray-600">CypAI checks availability and confirms bookings automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🏨</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Booking.com Alternative</h3>
              <p className="mt-2 text-gray-600">Every direct booking saves you 15-25% in commission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Your guests speak many languages.<br />CypAI speaks them all.</h2>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-3xl">
            <span>🇬🇧</span>
            <span>🇹🇷</span>
            <span>🇸🇦</span>
            <span>🇷🇺</span>
            <span>🇬🇷</span>
          </div>
          <p className="text-gray-600">Auto-detects language. Responds automatically.</p>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a2e]">Common questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"We already use Booking.com messaging"</h3>
              <p className="mt-2 text-gray-600">CypAI handles your direct WhatsApp and website enquiries — the ones that would otherwise pay Booking.com 15-25% commission. Every direct booking saves you money.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Our guests prefer to call"</h3>
              <p className="mt-2 text-gray-600">International guests increasingly prefer WhatsApp. No language barrier, no roaming charges, message at any time.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Is it worth the cost?"</h3>
              <p className="mt-2 text-gray-600">Every direct booking saves 15-25% Booking.com commission. CypAI pays for itself with ONE recovered direct booking per month.</p>
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
              <p className="mt-3 text-sm text-gray-500">Perfect for small guesthouses</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 500 messages/month</li>
                <li>✓ Website chat widget</li>
                <li>✓ Multi-language support</li>
                <li>✓ FAQ automation</li>
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
              <p className="mt-3 text-sm text-gray-500">For growing hotels</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Unlimited messages</li>
                <li>✓ WhatsApp integration</li>
                <li>✓ Booking system</li>
                <li>✓ Direct booking capture</li>
                <li>✓ Post-stay follow-up</li>
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
              <p className="mt-3 text-sm text-gray-500">For hotel groups</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-location support</li>
                <li>✓ Priority support</li>
                <li>✓ SLA guarantee</li>
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
            🔒 Secure payment by Paddle · 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Every unanswered enquiry<br />is a booking lost to Booking.com.</h2>
          <Link
            href="/signup?plan=pro"
            className="mt-8 inline-block rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
          >
            Start Your Free Trial Now →
          </Link>
          <p className="mt-4 text-sm text-gray-400">No credit card. Cancel anytime.</p>
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
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1a1a2e]">Home</Link>
              <Link href="#pricing" className="hover:text-[#1a1a2e]">Pricing</Link>
              <Link href="/demo" className="hover:text-[#1a1a2e]">Demo</Link>
              <Link href="/contact" className="hover:text-[#1a1a2e]">Contact</Link>
              <Link href="/privacy" className="hover:text-[#1a1a2e]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#1a1a2e]">Terms</Link>
              <Link href="/refund-policy" className="hover:text-[#1a1a2e]">Refund Policy</Link>
            </div>
            <p className="text-sm text-gray-500">© 2025 CypAI. Built in Northern Cyprus.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
