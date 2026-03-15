'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
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
type FormTouched = Partial<Record<keyof FormData, boolean>>;

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const refParam = params.get('ref')?.trim().toUpperCase() || '';
  const plan = PLANS[planId] ?? PLANS.pro;
  const planStyle = PLAN_STYLES[planId] ?? PLAN_STYLES.pro;
  const [referralCode, setReferralCode] = useState('');
  const hasSubmittedRef = useRef(false);

  const [form, setForm] = useState<FormData>({
    businessName: '',
    yourName: '',
    email: '',
    whatsapp: '',
    businessType: '',
    website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(REF_STORAGE_KEY) || '' : '';
    const normalized = (refParam || stored).trim().toUpperCase();
    if (normalized) {
      setReferralCode(normalized);
      localStorage.setItem(REF_STORAGE_KEY, normalized);
    }
  }, [refParam]);

  function getFieldError(field: keyof FormData, draft: FormData): string | undefined {
    switch (field) {
      case 'businessName':
        return draft.businessName.trim() ? undefined : 'Business name is required.';
      case 'yourName':
        return draft.yourName.trim() ? undefined : 'Your name is required.';
      case 'email': {
        if (!draft.email.trim()) return 'Email address is required.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)
          ? undefined
          : 'Enter a valid email address.';
      }
      case 'whatsapp':
        return draft.whatsapp.trim() ? undefined : 'WhatsApp number is required.';
      case 'businessType':
        return draft.businessType ? undefined : 'Please select your business type.';
      case 'website':
      default:
        return undefined;
    }
  }

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const nextForm = { ...form, [field]: value };
      setErrors((prev) => ({ ...prev, [field]: getFieldError(field, nextForm) }));
    }
  }

  function handleBlur(field: keyof FormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field, form) }));
  }

  function validate(): boolean {
    const next: FormErrors = {};
    const requiredFields: (keyof FormData)[] = ['businessName', 'yourName', 'email', 'whatsapp', 'businessType'];
    for (const field of requiredFields) {
      const error = getFieldError(field, form);
      if (error) next[field] = error;
    }
    setErrors(next);
    setTouched({
      businessName: true,
      yourName: true,
      email: true,
      whatsapp: true,
      businessType: true,
    });
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    hasSubmittedRef.current = true;
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

  useEffect(() => {
    const sendAbandonmentEvent = () => {
      if (hasSubmittedRef.current) return;
      if (!form.email.trim() && !form.businessName.trim() && !form.yourName.trim() && !form.whatsapp.trim()) {
        return;
      }

      const payload = {
        eventType: 'abandoned_signup',
        planId,
        email: form.email.trim(),
        businessName: form.businessName.trim(),
        yourName: form.yourName.trim(),
        businessType: form.businessType,
        source: 'signup_page',
      };

      Analytics.signupAbandoned(planId);

      try {
        const body = JSON.stringify(payload);
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/automation', new Blob([body], { type: 'application/json' }));
        } else {
          fetch('/api/automation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(() => undefined);
        }
      } catch {
        // Do nothing - abandonment tracking should never block UX.
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendAbandonmentEvent();
      }
    };

    window.addEventListener('beforeunload', sendAbandonmentEvent);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', sendAbandonmentEvent);
    };
  }, [form, planId]);

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
              {Object.keys(errors).length > 0 ? (
                <div className="md:col-span-2" role="alert" aria-live="polite">
                  <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200">
                    Please correct the highlighted fields and try again.
                  </p>
                </div>
              ) : null}

              {/* Business Name */}
              <div>
                <Field
                  label="Business Name"
                  required
                  error={errors.businessName}
                  htmlFor="business-name"
                  errorId="business-name-error"
                >
                  <input
                    id="business-name"
                    type="text"
                    value={form.businessName}
                    onChange={(e) => set('businessName', e.target.value)}
                    onBlur={() => handleBlur('businessName')}
                    placeholder="e.g. DriveEasy Car Rentals"
                    className={inputCls(!!errors.businessName)}
                    aria-describedby={errors.businessName ? 'business-name-error' : undefined}
                  />
                </Field>
              </div>

              {/* Your Name */}
              <div>
                <Field label="Your Name" required error={errors.yourName} htmlFor="your-name" errorId="your-name-error">
                  <input
                    id="your-name"
                    type="text"
                    value={form.yourName}
                    onChange={(e) => set('yourName', e.target.value)}
                    onBlur={() => handleBlur('yourName')}
                    placeholder="e.g. Ahmed Yilmaz"
                    className={inputCls(!!errors.yourName)}
                    aria-describedby={errors.yourName ? 'your-name-error' : undefined}
                  />
                </Field>
              </div>

              {/* Email */}
              <div>
                <Field label="Email Address" required error={errors.email} htmlFor="email-address" errorId="email-address-error">
                  <input
                    id="email-address"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="cypai.app@cypai.app"
                    className={inputCls(!!errors.email)}
                    aria-describedby={errors.email ? 'email-address-error' : undefined}
                  />
                </Field>
              </div>

              {/* WhatsApp */}
              <div>
                <Field label="WhatsApp Number" required error={errors.whatsapp} htmlFor="whatsapp-number" errorId="whatsapp-number-error">
                  <input
                    id="whatsapp-number"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                    onBlur={() => handleBlur('whatsapp')}
                    placeholder="+90 533 XXX XXXX"
                    className={inputCls(!!errors.whatsapp)}
                    aria-describedby={errors.whatsapp ? 'whatsapp-number-error' : undefined}
                  />
                </Field>
              </div>

              {/* Business Type */}
              <div>
                <Field label="Business Type" required error={errors.businessType} htmlFor="business-type" errorId="business-type-error">
                  <select
                    id="business-type"
                    aria-label="Business Type"
                    value={form.businessType}
                    onChange={(e) => set('businessType', e.target.value)}
                    onBlur={() => handleBlur('businessType')}
                    className={selectCls(!!errors.businessType)}
                    aria-describedby={errors.businessType ? 'business-type-error' : undefined}
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
                <Field label="Business Website" sublabel="Optional" error={errors.website} htmlFor="business-website" errorId="business-website-error">
                  <input
                    id="business-website"
                    type="url"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                    onBlur={() => handleBlur('website')}
                    placeholder="https://yourbusiness.com"
                    className={inputCls(false)}
                    aria-describedby={errors.website ? 'business-website-error' : undefined}
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
  errorId,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  errorId?: string;
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
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-400" role="status" aria-live="polite">
          {error}
        </p>
      )}
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

