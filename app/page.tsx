// â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
// â•‘  BizAI â€” Landing Page                                    â•‘
// â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  ArrowRight, Bot, BarChart2, Check, Globe, Menu,
  MessageCircle, Smartphone, Star, Users, X, Zap, Shield,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PLANS } from '@/lib/plans';

// â”€â”€ Static data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const planDetails = {
  basic: {
    price: 29,
    subtitle: 'Perfect for small businesses',
    features: ['500 messages/month', 'Website chat widget', 'Lead capture (name + phone)', 'Email support', '1 business location'],
  },
  pro: {
    price: 79,
    subtitle: 'Most popular for growing businesses',
    features: ['Unlimited messages', 'Website + WhatsApp', 'Advanced analytics', 'Priority support', 'Custom AI personality', '1 business location'],
  },
  business: {
    price: 149,
    subtitle: 'For serious businesses',
    features: ['Everything in Pro', 'Multiple locations', 'Custom integrations', 'White-label option', '24/7 phone support', 'Custom AI training'],
  },
} as const;
type PlanKey = keyof typeof planDetails;

const features = [
  { Icon: Bot,            title: 'AI That Knows Your Business', desc: 'Trained on your services, prices, and FAQs â€” not a generic chatbot.' },
  { Icon: MessageCircle,  title: 'WhatsApp Integration',        desc: 'Auto-replies to WhatsApp messages 24/7 while you sleep.' },
  { Icon: Users,          title: 'Lead Capture',                desc: 'Collects customer name and phone automatically â€” zero missed prospects.' },
  { Icon: Globe,          title: 'Multilingual',                desc: 'Speaks English, Turkish, Arabic, and Russian fluently.' },
  { Icon: Zap,            title: 'Instant Responses',           desc: 'Zero wait time, 24/7 availability â€” every question gets an answer.' },
  { Icon: Smartphone,     title: 'Works Everywhere',            desc: 'Website chat, WhatsApp, and Instagram DMs â€” all channels covered.' },
];

const steps = [
  { num: '01', emoji: 'ðŸ¢', title: 'Tell Us About Your Business', desc: 'We configure your AI with your services, prices, FAQs, and tone of voice.' },
  { num: '02', emoji: 'ðŸ¤–', title: 'We Train Your AI',            desc: 'Custom trained on your business context and ready to go in under 24 hours.' },
  { num: '03', emoji: 'ðŸš€', title: 'Start Getting Leads',         desc: 'Your AI handles customers while you focus on running your business.' },
];

const testimonials = [
  { quote: 'Our car rental bookings increased 40% after adding BizAI. The AI handles inquiries all night long.', name: 'Ahmed K.',   role: 'Car Rental Owner, Kyrenia' },
  { quote: 'I was skeptical but setup was done in less than 24 hours. My barbershop never misses an appointment.', name: 'Mehmet Y.', role: 'Barbershop Owner, Famagusta' },
  { quote: 'Students get instant answers about available rooms at any hour. My WhatsApp is finally quiet!', name: 'Sara M.',     role: 'Student Housing, Nicosia' },
];

const faqs = [
  { id: '1', q: 'How long does setup take?',                           a: "Setup typically takes 24 hours. We configure your AI, train it on your business, and test everything before going live. You'll receive a confirmation email once ready." },
  { id: '2', q: 'Do I need technical knowledge?',                      a: 'Not at all. After signing up you copy-paste one line of code onto your website â€” we handle all the AI configuration and training.' },
  { id: '3', q: 'Which languages does the AI speak?',                  a: 'Your assistant speaks English, Turkish, Arabic, and Russian â€” perfect for the diverse audience in Northern Cyprus.' },
  { id: '4', q: 'Can it connect to my WhatsApp?',                      a: 'Yes! WhatsApp integration is available on Pro and Business plans. Your AI replies to WhatsApp messages 24/7 automatically.' },
  { id: '5', q: "What happens if the AI doesn't know the answer?",     a: "It gracefully collects the customer's contact details and flags the conversation for your review. You never lose a lead." },
  { id: '6', q: 'Can I customize what the AI says?',                   a: "Absolutely. Set the tone, personality, add specific FAQs, and update the AI's knowledge anytime from your dashboard." },
  { id: '7', q: 'How do I add the widget to my website?',              a: "After setup you'll get a one-line snippet from your dashboard. Paste it before your site's closing </body> tag â€” works with any website builder." },
  { id: '8', q: 'Can I cancel anytime?',                               a: 'Yes, cancel anytime with no penalties or hidden fees. Your data stays accessible for 30 days after cancellation.' },
];

const businessTypes = [
  { icon: 'ðŸš—', name: 'Car Rentals' }, { icon: 'ðŸ’ˆ', name: 'Barbershops' },
  { icon: 'ðŸ¥', name: 'Clinics' },    { icon: 'ðŸ½ï¸', name: 'Restaurants' },
  { icon: 'ðŸ¨', name: 'Hotels' },     { icon: 'ðŸ’ª', name: 'Gyms' },
];

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Home() {
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileOpen,      setMobileOpen]       = useState(false);
  const [period,          setPeriod]           = useState<'monthly' | 'yearly'>('monthly');
  const [isModalOpen,     setIsModalOpen]      = useState(false);
  const [selectedPlan,    setSelectedPlan]     = useState<PlanKey>('pro');
  const [payEmail,        setPayEmail]         = useState('');
  const [paymentError,    setPaymentError]     = useState('');
  const [paymentSuccess,  setPaymentSuccess]   = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function openModal(planKey: PlanKey) {
    setSelectedPlan(planKey);
    setPayEmail('');
    setPaymentError('');
    setPaymentSuccess(false);
    setIsModalOpen(true);
  }

  async function createOrder() {
    if (!payEmail.trim()) {
      setPaymentError('Please enter your email address.');
      throw new Error('Email required');
    }
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan, businessEmail: payEmail.trim() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data.orderID;
  }

  async function onApprove(data: { orderID: string }) {
    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID, planId: selectedPlan, businessEmail: payEmail }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Payment failed');
    setPaymentSuccess(true);
    setPaymentError('');
    setTimeout(() => { setIsModalOpen(false); setPaymentSuccess(false); }, 3500);
  }

  const nav = [
    { label: 'Features',    href: '#features' },
    { label: 'Pricing',     href: '#pricing' },
    { label: 'How It Works',href: '#how' },
    { label: 'FAQ',         href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* â•â• NAVBAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">BizAI</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(({ label, href }) => (
              <a key={label} href={href} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">{label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900">Login</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.03] hover:shadow-md">
              Start Free Trial <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">{label}</a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-slate-700">Login</Link>
              <Link href="/dashboard" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-20 pt-28 md:pb-28 md:pt-36">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f030_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f030_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div aria-hidden className="absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/15 to-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              <Bot className="h-3.5 w-3.5" /> AI-Powered Customer Service
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
              Your Business <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Never Sleeps</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-600">
              Deploy an AI assistant that answers customers 24/7 on your website and WhatsApp. Set up in 24 hours â€” no technical knowledge required.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.03]">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how" className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                See How It Works
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <span className="text-sm font-medium text-slate-700">Trusted by 50+ businesses in Cyprus</span>
            </div>
          </div>

          {/* Chat mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div aria-hidden className="absolute inset-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-2xl" />
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                <span className="text-sm font-semibold text-white">DriveEasy Car Rentals</span>
              </div>
              <div className="space-y-3 bg-slate-50 p-4">
                {[
                  { side: 'left',  text: 'ðŸ‘‹ Hi! How can I help you today?' },
                  { side: 'right', text: 'Do you have cars available this weekend?' },
                  { side: 'left',  text: 'Yes! 3 cars available Satâ€“Sun. May I get your name & phone? ðŸš—' },
                  { side: 'right', text: "Sure! I'm Ahmed, +90 548â€¦" },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${m.side === 'right' ? 'rounded-tr-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'rounded-tl-sm bg-white text-slate-700 shadow-sm'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    {[0, 150, 300].map(d => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-4 py-3">
                <div className="flex-1 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-400">Type a messageâ€¦</div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-6 animate-bounce">
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-base">ðŸŽ‰</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">New lead captured!</p>
                  <p className="text-xs text-slate-500">Ahmed â€” Car Rental</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â• LOGO BAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-y border-slate-100 bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-9 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            Trusted by businesses across Northern Cyprus
          </p>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
            {businessTypes.map(({ icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition-transform hover:scale-110">{icon}</div>
                <span className="text-xs font-medium text-slate-500">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• HOW IT WORKS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="how" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Live in 24 Hours</h2>
            <p className="mt-4 text-lg text-slate-500">From sign-up to live AI in one business day.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ num, emoji, title, desc }, i) => (
              <div key={num} className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                {i < 2 && <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-slate-300 md:block"><ArrowRight className="h-5 w-5" /></div>}
                <div className="mb-5 text-4xl font-black text-blue-600/20">{num}</div>
                <div className="mb-4 text-3xl">{emoji}</div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                <p className="leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• FEATURES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Everything Your Business Needs</h2>
            <p className="mt-4 text-lg text-slate-500">One AI assistant that handles it all â€” so you don&apos;t have to.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• PRICING â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="pricing" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Simple, Honest Pricing</h2>
            <p className="mt-4 text-lg text-slate-500">No hidden fees. Cancel anytime.</p>
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              {(['monthly', 'yearly'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${period === p ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                  {p === 'monthly' ? 'Monthly' : <>Yearly <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${period === 'yearly' ? 'bg-white/20' : 'bg-green-100 text-green-700'}`}>â€“17%</span></>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-3">
            {(['basic', 'pro', 'business'] as PlanKey[]).map(key => {
              const pd = planDetails[key];
              const popular = key === 'pro';
              const price = period === 'yearly' ? Math.round((pd.price * 10) / 12) : pd.price;
              return (
                <div key={key} className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${popular ? 'scale-[1.04] border-transparent bg-gradient-to-b from-blue-600 to-indigo-700 shadow-2xl shadow-blue-600/30' : 'border-slate-200 bg-white hover:shadow-lg'}`}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow">Most Popular</span>
                    </div>
                  )}
                  <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${popular ? 'text-blue-200' : 'text-slate-400'}`}>
                    {PLANS[key]?.name}
                  </div>
                  <p className={`mb-5 text-sm ${popular ? 'text-blue-100' : 'text-slate-500'}`}>{pd.subtitle}</p>
                  <div className="mb-6 flex items-end gap-1">
                    <span className={`text-5xl font-black ${popular ? 'text-white' : 'text-slate-900'}`}>${price}</span>
                    <span className={`mb-1.5 text-sm ${popular ? 'text-blue-100' : 'text-slate-400'}`}>/mo</span>
                  </div>
                  {period === 'yearly' && <p className={`-mt-4 mb-5 text-xs font-medium ${popular ? 'text-blue-200' : 'text-green-600'}`}>Save ${pd.price * 2}/year</p>}
                  <ul className="mb-8 flex-1 space-y-3">
                    {pd.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${popular ? 'text-blue-200' : 'text-blue-500'}`} />
                        <span className={popular ? 'text-blue-50' : 'text-slate-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => openModal(key)} className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all hover:scale-[1.02] ${popular ? 'bg-white text-blue-700 shadow-lg hover:bg-blue-50' : key === 'business' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                    {key === 'business' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-sm text-slate-400">
            <Shield className="h-4 w-4" /> Secure payments via PayPal Â· Cancel anytime Â· 7-day free trial
          </p>
        </div>
      </section>

      {/* â•â• TESTIMONIALS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Businesses Love BizAI</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <blockquote className="mb-6 leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">{name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â• FAQ â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="faq" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Common Questions</h2>
            <p className="mt-4 text-lg text-slate-500">Everything you need to know about BizAI.</p>
          </div>
          <Accordion type="single" collapsible defaultValue="1" className="-space-y-px">
            {faqs.map(({ id, q, a }) => (
              <AccordionItem key={id} value={id} className="relative border-x bg-white first:rounded-t-xl first:border-t last:rounded-b-xl last:border-b">
                <AccordionTrigger className="px-6 py-5 text-left text-base font-semibold text-slate-900 hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-slate-600 leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* â•â• CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Ready to Never Miss a<br />Customer Again?
          </h2>
          <p className="mt-5 text-lg text-blue-200">Join 50+ businesses already using BizAI in Northern Cyprus.</p>
          <a href="#pricing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.04]">
            Start Your Free Trial <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-sm text-blue-300/70">No credit card required Â· 7-day free trial</p>
        </div>
      </section>

      {/* â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <footer id="footer" className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600"><Bot className="h-4 w-4 text-white" /></div>
                <span className="text-lg font-extrabold">BizAI</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">AI customer service for local businesses in Northern Cyprus.</p>
              <p className="mt-3 text-sm text-slate-400">Made in Northern Cyprus ðŸ‡¨ðŸ‡¾</p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Dashboard', href: '/dashboard' }] },
              { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#footer' }] },
              { title: 'Legal',   links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(({ label, href }) => (
                    <li key={label}><a href={href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-400">Â© 2026 BizAI. All rights reserved.</p>
            <p className="mt-1 text-sm text-slate-400">Questions? <a href="mailto:support@bizai.example.com" className="text-blue-500 hover:underline">support@bizai.example.com</a></p>
          </div>
        </div>
      </footer>

      {/* â•â• PAYMENT MODAL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close payment modal">
              <X className="h-5 w-5" />
            </button>

            {paymentSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">ðŸŽ‰</div>
                <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="mt-2 text-slate-500">We&apos;ll contact you within 24 hours to set up your AI assistant.</p>
              </div>
            ) : (
              <>
                <h3 className="mb-1 text-2xl font-bold text-slate-900">Complete Your Purchase</h3>
                <p className="mb-6 text-sm text-slate-500">You&apos;re signing up for the <span className="font-semibold text-slate-900">{PLANS[selectedPlan]?.name}</span> plan.</p>
                <div className="mb-5 rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">Selected plan</p>
                  <p className="mt-0.5 text-lg font-bold text-blue-700">{PLANS[selectedPlan]?.name} â€” ${PLANS[selectedPlan]?.price}/month</p>
                </div>
                <div className="mb-5">
                  <label htmlFor="pay-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Business Email</label>
                  <input id="pay-email" type="email" value={payEmail} onChange={e => setPayEmail(e.target.value)} placeholder="owner@business.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                </div>
                {paymentError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{paymentError}</div>}
                {!isPending && (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={() => setPaymentError('Payment failed. Please try again.')}
                    style={{ layout: 'vertical', shape: 'rect', color: 'blue' }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
