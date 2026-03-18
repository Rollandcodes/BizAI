import { Check, X } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing — CypAI | AI Customer Service for Cyprus Businesses',
  description: 'Simple, transparent pricing for CypAI. Start free for 7 days. Plans from $29/month. No credit card required. Cancel anytime.',
};

const features = {
  starter: [
    { name: '500 messages/month', included: true },
    { name: 'Website chat widget', included: true },
    { name: 'Basic CRM', included: true },
    { name: 'QR code generation', included: true },
    { name: '5 languages', included: true },
    { name: 'Basic analytics', included: true },
    { name: 'Email support', included: true },
    { name: 'WhatsApp integration', included: false },
    { name: 'Full CRM', included: false },
    { name: 'Booking system', included: false },
    { name: 'Automated follow-ups', included: false },
    { name: 'Advanced analytics', included: false },
    { name: 'Custom AI training', included: false },
    { name: 'Priority support', included: false },
    { name: 'Multi-location', included: false },
    { name: 'Agent audit', included: false },
    { name: 'Weekly PDF reports', included: false },
    { name: 'Agency workspace', included: false },
    { name: 'Phone support', included: false },
    { name: 'SLA', included: false },
  ],
  pro: [
    { name: '500 messages/month', included: true },
    { name: 'Website chat widget', included: true },
    { name: 'Basic CRM', included: true },
    { name: 'QR code generation', included: true },
    { name: '5 languages', included: true },
    { name: 'Basic analytics', included: true },
    { name: 'Email support', included: true },
    { name: 'WhatsApp integration', included: true },
    { name: 'Full CRM', included: true },
    { name: 'Booking system', included: true },
    { name: 'Automated follow-ups', included: true },
    { name: 'Advanced analytics', included: true },
    { name: 'Custom AI training', included: true },
    { name: 'Priority support', included: true },
    { name: 'Multi-location', included: false },
    { name: 'Agent audit', included: false },
    { name: 'Weekly PDF reports', included: false },
    { name: 'Agency workspace', included: false },
    { name: 'Phone support', included: false },
    { name: 'SLA', included: false },
  ],
  business: [
    { name: '500 messages/month', included: true },
    { name: 'Website chat widget', included: true },
    { name: 'Basic CRM', included: true },
    { name: 'QR code generation', included: true },
    { name: '5 languages', included: true },
    { name: 'Basic analytics', included: true },
    { name: 'Email support', included: true },
    { name: 'WhatsApp integration', included: true },
    { name: 'Full CRM', included: true },
    { name: 'Booking system', included: true },
    { name: 'Automated follow-ups', included: true },
    { name: 'Advanced analytics', included: true },
    { name: 'Custom AI training', included: true },
    { name: 'Priority support', included: true },
    { name: 'Multi-location', included: true },
    { name: 'Agent audit', included: true },
    { name: 'Weekly PDF reports', included: true },
    { name: 'Agency workspace', included: true },
    { name: 'Phone support', included: true },
    { name: 'SLA', included: true },
  ],
};

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
  },
  {
    question: 'What happens after the free trial?',
    answer: 'After your 7-day free trial, you can choose a plan that fits your needs. No credit card required to start.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
  },
  {
    question: 'Are there any long-term contracts?',
    answer: 'No, all plans are month-to-month or annual. No long-term commitments. Cancel anytime.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards through our secure payment processor Paddle.',
  },
  {
    question: 'How much can I save with annual billing?',
    answer: 'Annual billing gives you a 20% discount. That\'s essentially 2.4 months free!',
  },
];

export default function PricingPage() {
  const annual = false; // This will be state in client component
  
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <div className="pt-20 pb-12 text-center">
        <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 text-sm font-medium rounded-full mb-6">
          PRICING
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple pricing, no surprises.
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Transparent pricing that grows with your business. No hidden fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#16213e] rounded-full p-1 flex">
            <button className="px-6 py-2 rounded-full bg-amber-500 text-black font-medium text-sm">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full text-gray-400 font-medium text-sm hover:text-white transition-colors">
              Annual <span className="text-amber-400 ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="bg-[#16213e] rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Perfect for small businesses getting started with AI customer service.
            </p>
            <Link
              href="/signup?plan=starter"
              className="block w-full py-3 px-6 rounded-xl border border-white/10 text-center font-medium hover:bg-white/5 transition-colors"
            >
              Start Free Trial
            </Link>
            <ul className="mt-8 space-y-3">
              {features.starter.filter(f => f.included).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-[#16213e] rounded-2xl p-8 border-2 border-amber-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              For growing businesses that need more power and automation.
            </p>
            <Link
              href="/signup?plan=pro"
              className="block w-full py-3 px-6 rounded-xl bg-amber-500 text-black text-center font-bold hover:bg-amber-400 transition-colors"
            >
              Start Free Trial
            </Link>
            <ul className="mt-8 space-y-3">
              {features.pro.filter(f => f.included).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div className="bg-[#16213e] rounded-2xl p-8 border border-white/5">
            <h3 className="text-xl font-semibold mb-2">Business</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$149</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              For large organizations needing advanced features and support.
            </p>
            <Link
              href="/signup?plan=business"
              className="block w-full py-3 px-6 rounded-xl border border-white/10 text-center font-medium hover:bg-white/5 transition-colors"
            >
              Start Free Trial
            </Link>
            <ul className="mt-8 space-y-3">
              {features.business.filter(f => f.included).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Line */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          🔒 Secure card payment powered by Paddle · 30-day money-back guarantee · Cancel anytime
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-medium text-gray-400">Feature</th>
                <th className="text-center py-4 px-4 font-medium">Starter</th>
                <th className="text-center py-4 px-4 font-medium text-amber-400">Pro</th>
                <th className="text-center py-4 px-4 font-medium">Business</th>
              </tr>
            </thead>
            <tbody>
              {features.starter.map((feature, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 px-4 text-sm">{feature.name}</td>
                  <td className="py-3 px-4 text-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-amber-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {features.pro[i].included ? (
                      <Check className="w-5 h-5 text-amber-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {features.business[i].included ? (
                      <Check className="w-5 h-5 text-amber-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#16213e] rounded-xl p-6 border border-white/5">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-[#16213e] rounded-2xl p-8 border border-white/5 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-gray-400 mb-6">
            We offer custom enterprise solutions with dedicated support and custom integrations.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:cypai.app@cypai.app"
              className="px-6 py-3 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-colors"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/35799999999"
              className="px-6 py-3 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center pb-20">
        <p className="text-gray-400 mb-4">Still not sure? Try it free.</p>
        <Link
          href="/signup?plan=pro"
          className="inline-block px-8 py-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
        >
          Start Free Trial
        </Link>
      </div>
    </div>
  );
}
