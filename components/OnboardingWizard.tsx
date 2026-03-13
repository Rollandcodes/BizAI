'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';
import { PLANS } from '@/lib/plans';

type CustomFaq = {
  question: string;
  answer: string;
};

type BusinessHoursDay = {
  open: string;
  close: string;
  closed: boolean;
};

type BusinessHours = Record<string, BusinessHoursDay>;

type WizardBusiness = {
  id: string;
  business_name: string;
  business_type?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  widget_color?: string | null;
  welcome_message?: string | null;
  widget_position?: string | null;
  plan: 'trial' | 'basic' | 'starter' | 'pro' | 'business';
  business_hours?: BusinessHours | null;
  languages?: string[] | null;
  custom_faqs?: CustomFaq[] | null;
  pricing_info?: string | null;
  common_questions_text?: string | null;
  additional_info?: string | null;
  onboarding_complete?: boolean | null;
};

type WizardData = {
  businessName: string;
  businessType: string;
  whatsapp: string;
  website: string;
  businessHours: BusinessHours;
  languages: string[];
  pricesText: string;
  commonQuestionsText: string;
  additionalInfo: string;
  widgetColor: string;
  widgetPosition: 'bottom-right' | 'bottom-left';
  welcomeMessage: string;
};

const STEP_STORAGE_PREFIX = 'cypai-onboarding-step-';
const TOTAL_STEPS = 5;
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const languageOptions = ['English', 'Turkish', 'Arabic', 'Russian'];
const businessTypeOptions = [
  { value: 'car_rental', label: 'Car Rental' },
  { value: 'barbershop', label: 'Barbershop' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'gym', label: 'Gym' },
  { value: 'other', label: 'Other' },
];
const stepLabels = ['Welcome', 'Business Info', 'Train AI', 'Customize', 'Get Widget'];

function createDefaultHours(): BusinessHours {
  return {
    Mon: { open: '09:00', close: '18:00', closed: false },
    Tue: { open: '09:00', close: '18:00', closed: false },
    Wed: { open: '09:00', close: '18:00', closed: false },
    Thu: { open: '09:00', close: '18:00', closed: false },
    Fri: { open: '09:00', close: '18:00', closed: false },
    Sat: { open: '09:00', close: '14:00', closed: false },
    Sun: { open: '09:00', close: '14:00', closed: true },
  };
}

function hoursFromBusiness(value?: BusinessHours | null) {
  const fallback = createDefaultHours();
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  return weekDays.reduce<BusinessHours>((accumulator, day) => {
    const source = value[day];
    accumulator[day] = {
      open: source?.open || fallback[day].open,
      close: source?.close || fallback[day].close,
      closed: typeof source?.closed === 'boolean' ? source.closed : fallback[day].closed,
    };
    return accumulator;
  }, {});
}

function faqTextFromList(faqs?: CustomFaq[] | null, fallbackText?: string | null) {
  if (fallbackText?.trim()) {
    return fallbackText;
  }

  return (faqs || [])
    .filter((faq) => faq.question.trim() || faq.answer.trim())
    .map((faq) => `Q: ${faq.question.trim()}\nA: ${faq.answer.trim()}`)
    .join('\n\n');
}

function buildInitialData(business: WizardBusiness): WizardData {
  return {
    businessName: business.business_name || '',
    businessType: business.business_type || 'other',
    whatsapp: business.whatsapp || '',
    website: business.website || '',
    businessHours: hoursFromBusiness(business.business_hours),
    languages: business.languages && business.languages.length > 0 ? business.languages : ['English'],
    pricesText: business.pricing_info || '',
    commonQuestionsText: faqTextFromList(business.custom_faqs, business.common_questions_text),
    additionalInfo: business.additional_info || '',
    widgetColor: business.widget_color || '#2563eb',
    widgetPosition: business.widget_position === 'bottom-left' ? 'bottom-left' : 'bottom-right',
    welcomeMessage: business.welcome_message || 'Hi! 👋 How can I help you today?',
  };
}

export default function OnboardingWizard({
  business,
  onComplete,
}: {
  business: WizardBusiness;
  onComplete: () => Promise<void> | void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(() => buildInitialData(business));
  const [saving, setSaving] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [error, setError] = useState('');

  const storageKey = `${STEP_STORAGE_PREFIX}${business.id}`;
  const planKey = business.plan === 'basic' ? 'starter' : business.plan;
  const planConfig = PLANS[planKey] ?? PLANS.pro;
  const widgetCode = `<script src="https://cypai.app/widget.js" data-business-id="${business.id}"></script>`;

  useEffect(() => {
    setData(buildInitialData(business));
    const storedStep = window.localStorage.getItem(storageKey);
    const parsedStep = Number(storedStep);
    if (Number.isFinite(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS) {
      setStep(parsedStep);
    } else {
      setStep(1);
    }
  }, [business, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(step));
  }, [step, storageKey]);

  const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const colorSwatchRef = useRef<HTMLSpanElement>(null);
  const colorButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  useEffect(() => {
    if (colorSwatchRef.current) {
      colorSwatchRef.current.style.backgroundColor = data.widgetColor;
    }
    if (colorButtonRef.current) {
      colorButtonRef.current.style.backgroundColor = data.widgetColor;
    }
  }, [data.widgetColor]);

  function updateField<Key extends keyof WizardData>(field: Key, value: WizardData[Key]) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function updateBusinessHours(day: string, field: keyof BusinessHoursDay, value: string | boolean) {
    setData((current) => ({
      ...current,
      businessHours: {
        ...current.businessHours,
        [day]: {
          ...current.businessHours[day],
          [field]: value,
        },
      },
    }));
  }

  function toggleLanguage(language: string) {
    setData((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter((item) => item !== language)
        : [...current.languages, language],
    }));
  }

  async function saveStep(partial: { markComplete?: boolean } = {}) {
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          onboardingData: data,
          onboardingComplete: partial.markComplete === true,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save onboarding step');
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save onboarding step');
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    if (step === 2) {
      if (!data.businessName.trim() || !data.businessType.trim() || !data.whatsapp.trim()) {
        setError('Business name, business type, and WhatsApp number are required.');
        return;
      }
    }

    if (step === 3 || step === 4) {
      await saveStep();
    }

    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  async function handleSkip() {
    if (step !== 3 && step !== 4) {
      return;
    }

    await saveStep();
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  async function handleFinish() {
    await saveStep({ markComplete: true });
    window.localStorage.removeItem(storageKey);
    await onComplete();
  }

  async function handleCopyCode() {
    await navigator.clipboard.writeText(widgetCode);
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1800);
  }

  const previewAlignment = data.widgetPosition === 'bottom-left' ? 'items-start' : 'items-end';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-4 py-8">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">First-Time Setup</p>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Set up your AI assistant</h2>
            </div>
            <div className="text-right text-sm text-slate-500">
              Step {step} of {TOTAL_STEPS}
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-full bg-slate-100">
            <div ref={progressBarRef} className="h-2 rounded-full bg-blue-600 transition-all duration-300" />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {stepLabels.map((label, index) => (
              <span key={label} className={index + 1 <= step ? 'text-slate-700' : ''}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_40%),#f8fafc] p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Welcome to CypAI</p>
                <h3 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900">
                  Let&apos;s set up your AI assistant in 5 minutes
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  We&apos;ll collect your business details, train the assistant on your prices and FAQs, customize the widget, and generate the code you&apos;ll paste into your site.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Let&apos;s Start
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Your Plan</p>
                    <h4 className="mt-1 text-2xl font-extrabold text-slate-900">{planConfig.name}</h4>
                  </div>
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    ${planConfig.price}/mo
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {planConfig.features.slice(0, 8).map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Business Info</h3>
                <p className="mt-2 text-sm text-slate-500">Tell CypAI how your business operates so the assistant can answer with real details.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Business Name" required>
                  <input aria-label="Business Name" placeholder="DriveEasy Car Rentals" value={data.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={inputClassName} />
                </Field>
                <Field label="Business Type" required>
                  <select aria-label="Business Type" value={data.businessType} onChange={(event) => updateField('businessType', event.target.value)} className={inputClassName}>
                    {businessTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="WhatsApp Number" required>
                  <input value={data.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} className={inputClassName} placeholder="+90 533 842 5559" />
                </Field>
                <Field label="Website URL" hint="Optional">
                  <input value={data.website} onChange={(event) => updateField('website', event.target.value)} className={inputClassName} placeholder="https://yourbusiness.com" />
                </Field>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">Business Hours</h4>
                <div className="mt-3 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  {weekDays.map((day) => {
                    const hours = data.businessHours[day];
                    return (
                      <div key={day} className="grid items-center gap-3 md:grid-cols-[80px_120px_120px_auto]">
                        <span className="text-sm font-semibold text-slate-700">{day}</span>
                        <input aria-label={`${day} opening time`} type="time" value={hours.open} disabled={hours.closed} onChange={(event) => updateBusinessHours(day, 'open', event.target.value)} className={inputClassName} />
                        <input aria-label={`${day} closing time`} type="time" value={hours.close} disabled={hours.closed} onChange={(event) => updateBusinessHours(day, 'close', event.target.value)} className={inputClassName} />
                        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" checked={hours.closed} onChange={(event) => updateBusinessHours(day, 'closed', event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                          Closed
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">Languages Spoken</h4>
                <div className="mt-3 flex flex-wrap gap-3">
                  {languageOptions.map((language) => (
                    <label key={language} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" checked={data.languages.includes(language)} onChange={() => toggleLanguage(language)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                      {language}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Train Your AI</h3>
                <p className="mt-2 text-sm text-slate-500">Give the assistant your pricing, common questions, and any important rules or notes.</p>
              </div>

              <Field label="What are your prices?" required>
                <textarea rows={7} value={data.pricesText} onChange={(event) => updateField('pricesText', event.target.value)} className={textareaClassName} placeholder={"Economy car: $25/day\nCompact car: $35/day\nSUV: $55/day"} />
              </Field>

              <Field label="What are your most common questions?" required>
                <textarea rows={8} value={data.commonQuestionsText} onChange={(event) => updateField('commonQuestionsText', event.target.value)} className={textareaClassName} placeholder={"Q: Do you deliver to the airport?\nA: Yes, free delivery to Ercan Airport"} />
              </Field>

              <Field label="Anything else the AI should know?" hint="Optional">
                <textarea rows={7} value={data.additionalInfo} onChange={(event) => updateField('additionalInfo', event.target.value)} className={textareaClassName} placeholder={"We require a deposit of $100..."} />
              </Field>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Customize Widget</h3>
                  <p className="mt-2 text-sm text-slate-500">Set your colors, widget position, and the first message customers will see.</p>
                </div>

                <Field label="Widget Color">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3">
                    <input aria-label="Widget Color" title="Widget Color" type="color" value={data.widgetColor} onChange={(event) => updateField('widgetColor', event.target.value)} className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0" />
                    <span ref={colorSwatchRef} className="h-8 w-8 rounded-full border border-slate-200" />
                    <span className="text-sm font-medium text-slate-700">{data.widgetColor}</span>
                  </div>
                </Field>

                <Field label="Widget Position">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: 'bottom-right', label: 'Bottom Right' },
                      { value: 'bottom-left', label: 'Bottom Left' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateField('widgetPosition', option.value as WizardData['widgetPosition'])}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${data.widgetPosition === option.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Welcome Message">
                  <textarea aria-label="Welcome Message" placeholder="Hi! 👋 How can I help you today?" rows={5} value={data.welcomeMessage} onChange={(event) => updateField('welcomeMessage', event.target.value)} className={textareaClassName} />
                </Field>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Live Preview</p>
                <div className={`mt-4 flex h-[420px] rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 ${previewAlignment}`}>
                  <div className="mt-auto flex flex-col gap-3">
                    <div className="max-w-[260px] rounded-3xl rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-md">
                      {data.welcomeMessage}
                    </div>
                    <div ref={colorButtonRef} className="flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-lg">
                      💬
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Get Your Widget</h3>
                  <p className="mt-2 text-sm text-slate-500">Paste this code before the closing body tag on your website to start capturing leads.</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
                    <code>{widgetCode}</code>
                  </pre>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => void handleCopyCode()} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                      <Copy className="h-4 w-4" />
                      {copyState === 'copied' ? 'Copied!' : 'Copy Code'}
                    </button>
                    <span className="text-sm text-slate-500">Paste this before {'</body>'} on your website.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">QR Code for Walk-In Customers</p>
                <div className="mt-5 flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <QRCode value={`https://cypai.app/chat/${business.id}`} size={180} fgColor="#0f172a" />
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-900">{data.businessName || business.business_name}</p>
                    <p className="mt-1 text-sm text-slate-500">Scan to talk to your AI assistant instantly</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-200 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : <span />}

              {(step === 3 || step === 4) ? (
                <button type="button" onClick={() => void handleSkip()} disabled={saving} className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 disabled:opacity-50">
                  Skip this step
                </button>
              ) : null}
            </div>

            {step < 5 ? (
              <button type="button" onClick={() => void handleNext()} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Saving…' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={() => void handleFinish()} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                {saving ? 'Finishing…' : 'Go to Dashboard'}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {hint ? <span className="text-xs font-medium text-slate-400">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

const inputClassName = 'h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';
const textareaClassName = 'w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';
