'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { Analytics } from '@/lib/analytics';

const PLAN_STYLES: Record<string, { badge: string; dot: string }> = {
  starter: { badge: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  basic: { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  pro:   { badge: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500' },
  business: { badge: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
};

const BUSINESS_TYPES = [
  'Car Rental',
  'Barbershop / Salon',
  'Student Accommodation',
  'Restaurant / Cafe',
  'Dental / Medical Clinic',
  'Gym / Fitness',
  'Hotel / Guesthouse',
  'Other',
];

type FormData = {
  businessName: string;
  yourName: string;
  email: string;
  whatsapp: string;
  businessType: string;
  website: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const plan = PLANS[planId] ?? PLANS.pro;
  const planStyle = PLAN_STYLES[planId] ?? PLAN_STYLES.pro;

  const [form, setForm] = useState<FormData>({
    businessName: '',
    yourName: '',
    email: '',
    whatsapp: '',
    businessType: '',
    website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.businessName.trim()) next.businessName = 'Business name is required.';
    if (!form.yourName.trim())     next.yourName     = 'Your name is required.';
    if (!form.email.trim())        next.email        = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                   next.email        = 'Enter a valid email address.';
    if (!form.whatsapp.trim())     next.whatsapp     = 'WhatsApp number is required.';
    if (!form.businessType)        next.businessType = 'Please select your business type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    Analytics.signupStarted(planId);
    localStorage.setItem(
      'cypai_signup',
      JSON.stringify({ ...form, plan: planId }),
    );
    router.push(`/payment?plan=${planId}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-slate-900">🤖 CypAI</a>
          <a href="/" className="text-sm font-semibold text-slate-500 transition hover:text-slate-800">← Back</a>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              {/* Step 1 — active */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</div>
                <span className="text-sm font-semibold text-slate-900">Your Details</span>
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-slate-200">
                <div className="h-full w-0 rounded-full bg-blue-600" />
              </div>
              {/* Step 2 — inactive */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-xs font-bold text-slate-400">2</div>
                <span className="text-sm font-semibold text-slate-400">Payment</span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            {/* Plan badge */}
            <div className="mb-5 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${planStyle.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${planStyle.dot}`} />
                {plan.name} Plan — ${plan.price}/month
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">Set up your AI assistant</h1>
            <p className="mt-1.5 text-sm text-slate-500">Takes 2 minutes. Live in 24 hours.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">

              {/* Business Name */}
              <Field
                label="Business Name"
                required
                error={errors.businessName}
              >
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => set('businessName', e.target.value)}
                  placeholder="e.g. DriveEasy Car Rentals"
                  className={inputCls(!!errors.businessName)}
                />
              </Field>

              {/* Your Name */}
              <Field label="Your Name" required error={errors.yourName}>
                <input
                  type="text"
                  value={form.yourName}
                  onChange={(e) => set('yourName', e.target.value)}
                  placeholder="e.g. Ahmed Yilmaz"
                  className={inputCls(!!errors.yourName)}
                />
              </Field>

              {/* Email */}
              <Field label="Email Address" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="cypai.app@cypai.app"
                  className={inputCls(!!errors.email)}
                />
              </Field>

              {/* WhatsApp */}
              <Field label="WhatsApp Number" required error={errors.whatsapp}>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  placeholder="+90 533 XXX XXXX"
                  className={inputCls(!!errors.whatsapp)}
                />
              </Field>

              {/* Business Type */}
              <Field label="Business Type" required error={errors.businessType} htmlFor="business-type">
                <select
                  id="business-type"
                  aria-label="Business Type"
                  value={form.businessType}
                  onChange={(e) => set('businessType', e.target.value)}
                  className={selectCls(!!errors.businessType)}
                >
                  <option value="" disabled>Select your business type…</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>

              {/* Website */}
              <Field label="Business Website" sublabel="Optional" error={errors.website}>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set('website', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className={inputCls(false)}
                />
              </Field>

              {/* What's included */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {plan.name} Plan includes
                </p>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
              >
                Continue to Payment →
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-slate-400">
              🔒 Your information is secure and never shared
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------- small helpers ----------

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition',
    'placeholder:text-slate-400',
    hasError
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
  ].join(' ');
}

function selectCls(hasError: boolean) {
  return [
    'w-full appearance-none rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition',
    hasError
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
  ].join(' ');
}

function Field({
  label,
  sublabel,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500">*</span>}
        {sublabel && <span className="font-normal text-slate-400">({sublabel})</span>}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js App Router
export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
