'use client';

import { startTransition, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

type BizUser = {
  id?: string;
  email?: string;
  businessName?: string;
  plan?: string;
};

export default function SuccessPage() {
  const [user, setUser] = useState<BizUser>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bizai_user') ?? localStorage.getItem('cypai_user');
      if (raw) {
        const parsed = JSON.parse(raw) as BizUser;
        startTransition(() => setUser(parsed));
        Analytics.signupCompleted(parsed.plan ?? 'unknown');
      }
    } catch {
      // ignore
    }
    return undefined;
  }, []);

  const businessName = user.businessName ?? 'your business';
  const email = user.email ?? '';
  const dashboardHref = '/dashboard';

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="w-full max-w-lg">
        {/* Checkmark */}
        <div className="mb-8 flex justify-center">
          <div className="success-pop flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-200">
            <Check className="h-9 w-9 stroke-[3] text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">?? You&apos;re all set!</h1>
          <p className="mt-2 text-lg font-semibold text-zinc-300">
            Welcome to CypAI,{' '}
            <span className="text-blue-400">{businessName}</span>
          </p>
        </div>

        {/* Status card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/30">
          <div className="border-b border-zinc-800 px-6 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Setup Progress</p>
          </div>
          <ul className="divide-y divide-zinc-800">
            {[
              { done: true,  label: 'Payment confirmed' },
              { done: false, label: 'AI setup in progress (within 24 hrs)' },
              { done: false, label: 'Widget code will be emailed to you' },
            ].map(({ done, label }) => (
              <li key={label} className="flex items-center gap-3 px-6 py-3.5">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${done ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                  {done ? '?' : '?'}
                </span>
                <span className={`text-sm font-medium ${done ? 'text-zinc-100' : 'text-zinc-400'}`}>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Message box */}
        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-5 text-sm leading-relaxed text-zinc-400 shadow-xl shadow-black/30">
          <p>
            We&apos;ve received your payment and will have your AI assistant configured within 24 hours.
          </p>
          {email && (
            <p className="mt-3">
              You&apos;ll receive an email at{' '}
              <span className="font-semibold text-zinc-100">{email}</span> with:
            </p>
          )}
          {!email && <p className="mt-3">You&apos;ll receive an email shortly with:</p>}
          <ul className="mt-2 space-y-1 pl-4">
            <li className="list-disc">Your widget installation code</li>
            <li className="list-disc">Dashboard login link</li>
            <li className="list-disc">Setup instructions</li>
          </ul>
          <p className="mt-4 font-semibold text-zinc-200">Questions? We&apos;re here:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="mailto:cypai.app@cypai.app"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
            >
              ?? Email Us
            </a>
            <a
              href="https://wa.me/905338425559"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#25D366] px-4 py-2 text-sm font-semibold text-[#1a9e4a] transition hover:bg-green-50"
            >
              ?? WhatsApp Us
            </a>
          </div>
        </div>

        {/* Dashboard CTA */}
        <a
          href={dashboardHref}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
        >
          Go to Your Dashboard ?
        </a>
        <p className="mt-3 text-center text-xs text-zinc-500">
          Bookmark your dashboard link for easy access
        </p>
      </div>
    </main>
  );
}

