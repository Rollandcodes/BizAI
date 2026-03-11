'use client';

import { useState } from 'react';
import { ArrowRight, PlayCircle, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { Dictionary } from '@/lib/i18n';

type Props = {
  dictionary: Dictionary;
};

export function HeroV2({ dictionary }: Props) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  function handlePrimaryCta() {
    trackEvent('hero_cta_click', { location: 'hero_primary' });
  }

  function openDemo() {
    trackEvent('hero_demo_open', { location: 'hero_secondary' });
    setIsDemoOpen(true);
  }

  return (
    <section className="relative overflow-hidden bg-[var(--color-neutral)] pb-14 pt-24 md:pb-20 md:pt-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,107,102,0.16),transparent_45%)]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 md:gap-12 lg:grid-cols-2 lg:px-6">
        <div className="order-1 flex flex-col gap-5">
          <p className="inline-flex w-fit rounded-full border border-[#0F6B66]/20 bg-white px-3 py-1 text-xs font-semibold text-[#0F6B66]">
            {dictionary.heroBadge}
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            {dictionary.heroTitle}
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            {dictionary.heroSubtitle}
          </p>

          <div className="order-1 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pricing"
              onClick={handlePrimaryCta}
              aria-label={dictionary.ctaButton}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F6B66] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5450] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66]"
            >
              {dictionary.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={openDemo}
              aria-label={dictionary.heroSecondaryCta}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66]"
            >
              {dictionary.heroSecondaryCta}
              <PlayCircle className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500">{dictionary.heroMicrotrust}</p>

          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">DriveEasy Rentals</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">Nicosia Barber Co.</div>
          </div>
        </div>

        <div className="order-2">
          <button
            type="button"
            onClick={openDemo}
            aria-label={dictionary.playDemo}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66]"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">DriveEasy Car Rentals</p>
              <span className="text-xs font-medium text-[#0F6B66]">{dictionary.playDemo}</span>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
              <p className="w-fit max-w-[90%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-slate-700 shadow-sm">👋 {dictionary.demoCustomer1}</p>
              <p className="ml-auto w-fit max-w-[90%] rounded-xl rounded-tr-sm bg-[#0F6B66] px-3 py-2 text-white">{dictionary.demoAi1}</p>
              <p className="w-fit max-w-[90%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-slate-700 shadow-sm">{dictionary.demoCustomer2}</p>
              <p className="ml-auto w-fit max-w-[90%] rounded-xl rounded-tr-sm bg-[#0F6B66] px-3 py-2 text-white">{dictionary.demoAi2}</p>
            </div>
          </button>
        </div>
      </div>

      {isDemoOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{dictionary.demoTitle}</h3>
              <button
                type="button"
                onClick={() => setIsDemoOpen(false)}
                aria-label="Close demo modal"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="w-fit max-w-[80%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-slate-700">{dictionary.demoCustomer1}</p>
              <p className="ml-auto w-fit max-w-[80%] rounded-xl rounded-tr-sm bg-[#0F6B66] px-3 py-2 text-white">{dictionary.demoAi1}</p>
              <p className="w-fit max-w-[80%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-slate-700">{dictionary.demoCustomer2}</p>
              <p className="ml-auto w-fit max-w-[80%] rounded-xl rounded-tr-sm bg-[#0F6B66] px-3 py-2 text-white">{dictionary.demoAi2}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}