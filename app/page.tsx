'use client';

import { useEffect, useMemo, useState } from 'react';
import { Building2, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { HeroV2 } from '@/components/ui/hero-v2';
import { PricingGrid } from '@/components/ui/pricing-grid';
import { FaqsSection } from '@/components/ui/faqs-1';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDictionary,
  isLocale,
  type Locale,
} from '@/lib/i18n';

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
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) {
      setLocale(stored);
    }
  }, []);

  function handleLanguageChange(next: Locale) {
    setLocale(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="text-lg font-extrabold text-slate-900">BizAI</div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#features" className="hover:text-slate-900">{dictionary.navFeatures}</a>
            <a href="#pricing" className="hover:text-slate-900">{dictionary.navPricing}</a>
            <a href="#faq" className="hover:text-slate-900">{dictionary.navFaq}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.navContact}</a>
          </nav>
          <LanguageSwitcher value={locale} onChange={handleLanguageChange} />
        </div>
      </header>

      <HeroV2 dictionary={dictionary} />

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
              Purpose-built for Cyprus businesses that want more bookings and fewer missed messages.
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

      <PricingGrid dictionary={dictionary} />
      <FaqsSection dictionary={dictionary} />

      <footer id="footer" className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:px-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">BizAI</h3>
            <p className="mt-1 text-sm text-slate-600">{dictionary.footerTagline}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{dictionary.footerMadeIn}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <a href="#footer" className="hover:text-slate-900">{dictionary.footerContact}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.footerPrivacy}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.footerTerms}</a>
            <a href="#pricing" className="hover:text-slate-900">{dictionary.footerDemo}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}