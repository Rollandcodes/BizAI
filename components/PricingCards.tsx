'use client';

import { useState } from 'react';

interface Plan {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: 29,
    features: [
      'Up to 5 conversations/day',
      'Basic AI responses',
      'Email support',
      '1 business location',
    ],
  },
  {
    name: 'Professional',
    price: 79,
    popular: true,
    features: [
      'Unlimited conversations',
      'Advanced AI responses',
      'Priority support',
      'Up to 10 locations',
      'Custom branding',
      'Analytics dashboard',
    ],
  },
  {
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited everything',
      'Custom AI training',
      'Dedicated support',
      'Unlimited locations',
      'Advanced analytics',
      'API access',
      'White-label solution',
    ],
  },
];

export default function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (planName: string) => {
    setLoading(planName);
    try {
      // TODO: Implement PayPal integration
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      });

      const data = await response.json();
      // TODO: Redirect to PayPal approval URL
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 py-12">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-lg p-8 ${
            plan.popular
              ? 'border-2 border-blue-500 shadow-xl scale-105'
              : 'border border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="text-blue-500 font-semibold text-sm mb-2">
              Most Popular
            </div>
          )}
          <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handlePlanSelect(plan.name)}
            disabled={loading === plan.name}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              plan.popular
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'border border-blue-500 text-blue-500 hover:bg-blue-50'
            } disabled:opacity-50`}
          >
            {loading === plan.name ? 'Processing...' : 'Get Started'}
          </button>
        </div>
      ))}
    </div>
  );
}
