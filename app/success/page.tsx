'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowConfetti(false), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ecfeff,_#ffffff_45%)] px-4 py-16">
      {showConfetti ? <ConfettiBurst /> : null}

      <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
        <p className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Payment Confirmed
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Success! Your Payment Was Received</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Your AI assistant is being set up. We&apos;ll email you within 24 hours.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#0F6B66] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5450]"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 36 }, (_, idx) => idx);
  const colors = ['#22c55e', '#0ea5e9', '#f97316', '#eab308', '#ec4899', '#14b8a6'];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {pieces.map((piece) => {
        const left = (piece * 17) % 100;
        const delay = (piece % 8) * 120;
        const duration = 1800 + (piece % 7) * 220;
        const rotate = (piece % 9) * 35;
        const color = colors[piece % colors.length];

        return (
          <span
            key={piece}
            className="absolute top-[-10%] h-2.5 w-2.5 rounded-sm"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `confetti-fall ${duration}ms ease-out ${delay}ms forwards`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
