'use client';

import { Building2, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { HeroV2 } from '@/components/ui/hero-v2';
import { PricingGrid } from '@/components/ui/pricing-grid';
import { FaqsSection } from '@/components/ui/faqs-1';

const trustLogos = ['DriveEasy Rentals', 'Nicosia Barber Co.', 'Sunset Restaurant', 'Kyrenia Clinic'];

const featureCards = [
  {
    title: 'Lead Capture That Works',
    description: 'Automatically collects names and phone numbers from real customer conversations.',
    Icon: MessageCircle,
  },
  {
    title: 'Built for Local Teams',
    description: 'Handles common requests in English, Turkish, Arabic, and Russian.',
    Icon: Building2,
  },
  {
    title: 'Fast and Reliable',
    description: 'Instant responses with realistic flows for bookings, pricing, and follow-ups.',
    Icon: Zap,
  },
  {
    title: 'Safe by Default',
    description: 'Secure data handling with clear controls and audit-friendly customer records.',
    Icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroV2 />

      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 lg:px-6">
          {trustLogos.map((logo) => (
            <span key={logo} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">
              {logo}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="bg-[var(--color-neutral)] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Everything your team needs to respond faster</h2>
            <p className="mt-2 text-slate-600">
              Purpose-built for Northern Cyprus businesses that want more bookings and fewer missed messages.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map(({ title, description, Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-[#0F6B66]/10 p-2 text-[#0F6B66]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PricingGrid />
      <FaqsSection />
    </main>
  );
}