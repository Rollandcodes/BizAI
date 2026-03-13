'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { Analytics } from '@/lib/analytics';

const PLAN_STYLES: Record<string, { badge: string; dot: string }> = {
  starter: { badge: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  basic: { badge: 'bg-zinc-800 text-zinc-300 border-zinc-700', dot: 'bg-zinc-400' },
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

const REF_STORAGE_KEY = 'cypai_referral_code';

type FormErrors = Partial<Record<keyof FormData, string>>;

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const refParam = params.get('ref')?.trim().toUpperCase() || '';
  const plan = PLANS[planId] ?? PLANS.pro;
  const planStyle = PLAN_STYLES[planId] ?? PLAN_STYLES.pro;
  const [referralCode, setReferralCode] = useState('');

  const [form, setForm] = useState<FormData>({
    businessName: '',
    yourName: '',
    email: '',
    whatsapp: '',
    businessType: '',
    website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(REF_STORAGE_KEY) || '' : '';
    const normalized = (refParam || stored).trim().toUpperCase();
    if (normalized) {
      setReferralCode(normalized);
      localStorage.setItem(REF_STORAGE_KEY, normalized);
    }
  }, [refParam]);

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
    const signupPayload = {
      businessName: form.businessName.trim(),
      business_name: form.businessName.trim(),
      yourName: form.yourName.trim(),
      name: form.yourName.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      phone: form.whatsapp.trim(),
      businessType: form.businessType,
      website: form.website.trim(),
      plan: planId,
      referralCode: referralCode || undefined,
    };
    localStorage.setItem('bizai_signup', JSON.stringify(signupPayload));
    localStorage.setItem('cypai_signup', JSON.stringify(signupPayload));
    router.push(`/payment?plan=${planId}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-white">🤖 CypAI</a>
          <a href="/" className="text-sm font-semibold text-zinc-400 transition hover:text-zinc-200">← Back</a>
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
                <span className="text-sm font-semibold text-zinc-100">Your Details</span>
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-zinc-800">
                <div className="h-full w-0 rounded-full bg-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-xs font-bold text-zinc-500">2</div>
                <span className="text-sm font-semibold text-zinc-500">Payment</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 shadow-xl shadow-black/30">

            {/* Plan badge */}
            <div className="mb-5 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${planStyle.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${planStyle.dot}`} />
                {plan.name} Plan — ${plan.price}/month
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-white">Set up your AI assistant</h1>
            <p className="mt-1.5 text-sm text-zinc-400">Takes 2 minutes. Live in 24 hours.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Business Name */}
              <div>
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
              </div>

              {/* Your Name */}
              <div>
                <Field label="Your Name" required error={errors.yourName}>
                  <input
                    type="text"
                    value={form.yourName}
                    onChange={(e) => set('yourName', e.target.value)}
                    placeholder="e.g. Ahmed Yilmaz"
                    className={inputCls(!!errors.yourName)}
                  />
                </Field>
              </div>

              {/* Email */}
              <div>
                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="cypai.app@cypai.app"
                    className={inputCls(!!errors.email)}
                  />
                </Field>
              </div>

              {/* WhatsApp */}
              <div>
                <Field label="WhatsApp Number" required error={errors.whatsapp}>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                    placeholder="+90 533 XXX XXXX"
                    className={inputCls(!!errors.whatsapp)}
                  />
                </Field>
              </div>

              {/* Business Type */}
              <div>
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
              </div>

              {/* Website */}
              <div>
                <Field label="Business Website" sublabel="Optional" error={errors.website}>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                    placeholder="https://yourbusiness.com"
                    className={inputCls(false)}
                  />
                </Field>
              </div>

              {/* What's included */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 md:col-span-2">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {plan.name} Plan includes
                </p>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] md:col-span-2"
              >
                Continue to Payment →
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-zinc-500">
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
    'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500',
    hasError
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
  ].join(' ');
}

function selectCls(hasError: boolean) {
  return [
    'w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition',
    hasError
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
      : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10',
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
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300">
        {label}
        {required && <span className="text-red-500">*</span>}
        {sublabel && <span className="font-normal text-zinc-500">({sublabel})</span>}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
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

