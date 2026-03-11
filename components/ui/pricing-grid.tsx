'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { trackEvent } from '@/lib/analytics';
import type { Dictionary } from '@/lib/i18n';

type Plan = {
  id: 'basic' | 'pro' | 'business';
  title: string;
  monthly: number;
  description: string;
  features: string[];
};

type Props = {
  dictionary: Dictionary;
};

export function PricingGrid({ dictionary }: Props) {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const plans: Plan[] = [
    {
      id: 'basic',
      title: dictionary.starter,
      monthly: 29,
      description: 'For new businesses',
      features: ['500 messages/month', 'Website widget', 'Lead capture', 'Email support'],
    },
    {
      id: 'pro',
      title: dictionary.pro,
      monthly: 79,
      description: 'For growing teams',
      features: ['Unlimited messages', 'WhatsApp integration', 'Priority support', 'Advanced analytics'],
    },
    {
      id: 'business',
      title: dictionary.business,
      monthly: 149,
      description: 'For multi-location operations',
      features: ['Everything in Pro', 'Multi-location setup', 'Custom integrations', 'Phone support'],
    },
  ];

  function getPrice(monthly: number): number {
    if (billing === 'yearly') {
      return Math.round((monthly * 10) / 12);
    }
    return monthly;
  }

  function openCheckoutModal(plan: Plan) {
    setSelectedPlan(plan);
    setCustomerEmail('');
    setPaymentError('');
    setIsSuccess(false);
    setIsModalOpen(true);
  }

  function closeCheckoutModal() {
    setIsModalOpen(false);
    setPaymentError('');
  }

  return (
    <section id="pricing" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{dictionary.pricingTitle}</h2>
          <p className="mt-2 text-slate-600">{dictionary.pricingSubtitle}</p>

          <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              aria-label="Switch to monthly billing"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66] ${billing === 'monthly' ? 'bg-[#0F6B66] text-white' : 'text-slate-700'}`}
            >
              {dictionary.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              aria-label="Switch to yearly billing"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66] ${billing === 'yearly' ? 'bg-[#0F6B66] text-white' : 'text-slate-700'}`}
            >
              {dictionary.yearly}
            </button>
          </div>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {plans.map((plan) => {
            const highlighted = plan.id === 'pro';
            return (
              <article
                key={plan.id}
                className={`w-[84%] shrink-0 snap-center rounded-2xl border p-6 md:w-auto ${highlighted ? 'border-[#FF6B4A] shadow-md ring-2 ring-[#FF6B4A]/20' : 'border-slate-200'}`}
              >
                {highlighted ? (
                  <p className="mb-3 inline-flex rounded-full bg-[#FF6B4A] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {dictionary.mostPopular}
                  </p>
                ) : null}
                <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
                <p className="mt-4 text-4xl font-extrabold text-slate-900">
                  ${getPrice(plan.monthly)}
                  <span className="text-base font-medium text-slate-500">/mo</span>
                </p>

                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#0F6B66]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  aria-label={`Start ${plan.title} plan`}
                  onClick={() => {
                    trackEvent('pricing_plan_click', { plan: plan.id, billing });
                    trackEvent('pricing_checkout_open', { plan: plan.id, billing });
                    openCheckoutModal(plan);
                  }}
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B66] ${highlighted ? 'bg-[#0F6B66] text-white hover:bg-[#0b5450]' : 'border border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                >
                  Start {plan.title} Plan
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">{dictionary.starter}</th>
                <th className="px-4 py-3 font-semibold">{dictionary.pro}</th>
                <th className="px-4 py-3 font-semibold">{dictionary.business}</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow feature="Website Chat" starter="Yes" pro="Yes" business="Yes" />
              <ComparisonRow feature="WhatsApp" starter="No" pro="Yes" business="Yes" />
              <ComparisonRow feature="Analytics" starter="Basic" pro="Advanced" business="Advanced" />
              <ComparisonRow feature="Support" starter="Email" pro="Priority" business="24/7 Phone" />
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedPlan ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="paypal-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 id="paypal-modal-title" className="text-xl font-bold text-slate-900">
                Start Your {selectedPlan.title} Plan
              </h3>
              <button
                type="button"
                onClick={closeCheckoutModal}
                className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close payment modal"
              >
                ✕
              </button>
            </div>

            <label htmlFor="checkout-email" className="mb-2 block text-sm font-medium text-slate-700">
              Enter your business email
            </label>
            <input
              id="checkout-email"
              type="email"
              value={customerEmail}
              onChange={(event) => {
                setCustomerEmail(event.target.value);
                setPaymentError('');
              }}
              placeholder="you@business.com"
              className="mb-4 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-[#0F6B66]"
            />

            {paymentError ? <p className="mb-3 text-sm font-medium text-red-600">{paymentError}</p> : null}

            {isSuccess ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                🎉 Payment successful! Setting up your account...
              </div>
            ) : (
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                  currency: 'USD',
                  intent: 'capture',
                }}
              >
                <PayPalCheckoutButtons
                  planId={selectedPlan.id}
                  customerEmail={customerEmail}
                  onPaymentError={setPaymentError}
                  onSuccess={() => {
                    setIsSuccess(true);
                    window.setTimeout(() => {
                      router.push('/dashboard');
                    }, 900);
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PayPalCheckoutButtons({
  planId,
  customerEmail,
  onPaymentError,
  onSuccess,
}: {
  planId: 'basic' | 'pro' | 'business';
  customerEmail: string;
  onPaymentError: (message: string) => void;
  onSuccess: () => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Loading secure PayPal checkout...
      </div>
    );
  }

  return (
    <PayPalButtons
      forceReRender={[planId, customerEmail]}
      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
      createOrder={async () => {
        const email = customerEmail.trim();
        if (!email) {
          const msg = 'Please enter your business email before continuing.';
          onPaymentError(msg);
          throw new Error(msg);
        }

        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, customerEmail: email }),
        });

        const data = (await res.json()) as { id?: string; error?: string };
        if (!res.ok || !data.id) {
          const msg = data.error || 'Unable to create PayPal order.';
          onPaymentError(msg);
          throw new Error(msg);
        }

        return data.id;
      }}
      onApprove={async (data) => {
        const email = customerEmail.trim();
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderID: data.orderID,
            planId,
            customerEmail: email,
          }),
        });

        const result = (await res.json()) as { success?: boolean; error?: string };
        if (!res.ok || !result.success) {
          const msg = result.error || 'Payment failed';
          onPaymentError(msg);
          return;
        }

        onSuccess();
      }}
      onError={() => {
        onPaymentError('Payment failed. Please try again.');
      }}
    />
  );
}

function ComparisonRow({
  feature,
  starter,
  pro,
  business,
}: {
  feature: string;
  starter: string;
  pro: string;
  business: string;
}) {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-4 py-3 font-medium text-slate-900">{feature}</td>
      <td className="px-4 py-3 text-slate-600">{starter}</td>
      <td className="px-4 py-3 text-slate-600">{pro}</td>
      <td className="px-4 py-3 text-slate-600">{business}</td>
    </tr>
  );
}