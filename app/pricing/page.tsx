'use client'

import Link from 'next/link'

export default function PricingPage() {
  return (
    <div
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}
    >
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[#0a0a0a]">
            <span>🤖</span>
            <span>CypAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden text-sm text-gray-500 hover:text-[#0a0a0a] sm:block">
              Contact
            </Link>
            <Link href="/login" className="hidden text-sm text-gray-500 hover:text-[#0a0a0a] sm:block">
              Log In
            </Link>
            <Link href="/signup?plan=pro" className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#1a1a1a]">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Pricing</p>
          <h1 className="mt-4 text-5xl font-black leading-none tracking-tight text-[#0a0a0a] sm:text-6xl">
            Simple, Transparent Plans
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Pick the plan that fits your business. Start free for 7 days, cancel anytime.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '$29',
                desc: 'Perfect for small local businesses',
                plan: 'starter',
                popular: false,
                features: [
                  '500 messages/month',
                  'Website chat widget',
                  'Lead capture',
                  'Basic analytics',
                  'Email support',
                ],
              },
              {
                name: 'Pro',
                price: '$79',
                desc: 'Best for growing businesses',
                plan: 'pro',
                popular: true,
                features: [
                  'Unlimited messages',
                  'WhatsApp integration',
                  'CRM & lead management',
                  'Booking system',
                  'Follow-up tools',
                  'Advanced analytics',
                ],
              },
              {
                name: 'Business',
                price: '$149',
                desc: 'For agencies and multi-location teams',
                plan: 'business',
                popular: false,
                features: [
                  'Everything in Pro',
                  'Agent audit tools',
                  'Weekly compliance reports',
                  'Multi-location setup',
                  'Priority support',
                ],
              },
            ].map((card) => (
              <article
                key={card.name}
                className={`rounded-2xl bg-white p-8 ${card.popular ? 'border-2 border-black' : 'border border-gray-200'}`}
              >
                {card.popular ? (
                  <span className="inline-block rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                ) : null}

                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-gray-400">{card.name}</p>
                <p className="mt-3 text-5xl font-black text-[#0a0a0a]">{card.price}</p>
                <p className="mt-1 text-sm text-gray-500">/mo</p>
                <p className="mt-4 text-sm text-gray-600">{card.desc}</p>

                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="font-bold text-[#0a0a0a]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${card.plan}`}
                  className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                    card.popular
                      ? 'bg-black text-white hover:bg-[#1a1a1a]'
                      : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Start Free Trial
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
