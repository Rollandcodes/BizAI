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
  id: 'starter' | 'pro' | 'business';
  title: string;
  monthly: number;
  description: string;
  features: string[];
};

type Props = {
  dictionary: Dictionary;
};

const yearlySavings: Record<Plan['id'], number> = {
  starter: 58,
  pro: 158,
  business: 298,
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
      id: 'starter',
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
      features: ['Everything in Pro', 'Agent Audit Dashboard', 'Weekly Safety Score Report', 'Flagged Conversation Alerts', 'Monthly Compliance PDF Export', 'Sensitive Data Monitoring', 'Multi-location setup', 'Custom integrations', 'Phone support'],
    },
  ];

  function getDisplayedPrice(plan: Plan): string {
    if (billing === 'yearly') {
      const annualTotal = plan.monthly * 12 - yearlySavings[plan.id];
      return (annualTotal / 12).toFixed(2);
    }

    return String(plan.monthly);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Honest Pricing</h2>
          <p className="text-xl text-gray-500">No hidden fees. No contracts. Cancel anytime.</p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm font-semibold ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              aria-label="Toggle billing period"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${billing === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billing === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className={`text-sm font-semibold ${billing === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>Yearly</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Save 17%</span>
          </div>
        </div>

        {/* Urgency banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-8">
          <p className="text-amber-800 font-medium">
            ⚡ Limited Offer: Free setup included this month{' '}
            <span className="font-bold">(worth $99)</span> — only 5 spots remaining
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const highlighted = plan.id === 'pro';
            const isStarter = plan.id === 'starter';
            return (
              <article
                key={plan.id}
                className={`flex flex-col h-full rounded-2xl p-6 ${
                  highlighted
                    ? 'relative border-2 border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.15)] bg-white pt-10'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                {highlighted ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                    {dictionary.mostPopular}
                  </span>
                ) : null}
                <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
                {billing === 'yearly' ? (
                  <p className="mt-4 text-sm font-semibold text-slate-400 line-through">
                    ${plan.monthly}/mo
                  </p>
                ) : null}
                <p className="mt-2 text-4xl font-extrabold text-gray-900">
                  ${getDisplayedPrice(plan)}
                  <span className="text-base font-medium text-slate-500">/mo</span>
                </p>
                {plan.id === 'pro' ? (
                  <p className="mt-2 text-sm font-medium text-blue-600">🔥 Most chosen by Cyprus businesses</p>
                ) : null}
                {billing === 'yearly' ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      Save ${yearlySavings[plan.id]}/year
                    </span>
                    <span className="text-xs font-medium text-slate-500">Billed annually</span>
                  </div>
                ) : null}

                <ul className="flex-1 mt-4 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  aria-label={`Start ${plan.title} plan`}
                  onClick={() => {
                    trackEvent('pricing_plan_click', { plan: plan.id, billing });
                    router.push(`/signup?plan=${plan.id}`);
                  }}
                  className={
                    highlighted
                      ? 'w-full mt-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-200'
                      : isStarter
                        ? 'w-full mt-auto py-3 px-6 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-200'
                        : 'w-full mt-auto py-3 px-6 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200'
                  }
                >
                  Start Free Trial
                </button>
              </article>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
          <span>🔒 Secure PayPal Payments</span>
          <span>↩️ 7-Day Money Back Guarantee</span>
          <span>🇨🇾 Local Cyprus Support</span>
          <span>✓ Cancel Anytime</span>
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
  planId: 'starter' | 'pro' | 'business';
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