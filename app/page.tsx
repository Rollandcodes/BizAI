'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Menu, Send, X } from 'lucide-react';

import { PricingGrid } from '@/components/ui/pricing-grid';
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from '@/lib/i18n';
import { Analytics } from '@/lib/analytics';

// Constants
const WA_LINK =
  'https://wa.me/905338425559?text=Hi%2C%20I%27m%20interested%20in%20CypAI';
const WA_NUMBER = '+90 533 842 5559';
const CONTACT_EMAIL = 'cypai.app@cypai.app';

const DEMO_SYSTEM_PROMPT =
  'You are a friendly AI assistant for DriveEasy Car Rentals in Northern Cyprus. Help customers with: vehicle availability (Economy $25/day, Compact $35/day, SUV $55/day, Van $75/day), booking process, requirements (valid license, passport, credit card deposit), pickup locations (Nicosia, Kyrenia, Famagusta, Airport). Always try to collect customer name and phone number for bookings. Keep responses short and friendly. Use emojis occasionally.';

const DEMO_SUGGESTIONS = [
  'Do you have SUVs available this weekend?',
  'What documents do I need?',
  'How much does a compact cost?',
];

const HOW_STEPS = [
  { num: '01', title: 'Tell Us About Your Business', body: 'Fill in your services, prices, FAQs, and opening hours. Takes about 15 minutes.', visual: 'form' },
  { num: '02', title: 'We Train Your AI Agent', body: 'We configure and train your personal AI on your business data within 24 hours.', visual: 'training' },
  { num: '03', title: 'Deploy to Your Website', body: 'Paste one line of code. Your AI goes live instantly.', visual: 'deploy' },
  { num: '04', title: 'AI Handles Your Customers', body: 'Answers questions, captures leads, and books appointments 24/7 while you focus on work.', visual: 'chat' },
  { num: '05', title: 'Review & Improve', body: 'Login to your dashboard to see conversations, leads captured, and optimize your AI.', visual: 'dashboard' },
] as const;

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    q: 'How long does setup take?',
    a: 'Most businesses are live within 15 minutes. You fill in your business details, upload your FAQs and prices, and we generate your AI agent. No coding required.',
  },
  {
    id: 'faq-2',
    q: 'Which languages does the AI speak?',
    a: 'Your AI agent speaks English, Turkish, Arabic, and Russian — automatically detecting which language your customer is using and responding in the same language.',
  },
  {
    id: 'faq-3',
    q: 'How does WhatsApp integration work?',
    a: "On the Pro and Business plans, your AI connects to your WhatsApp Business number. When customers message you on WhatsApp, the AI responds instantly — 24/7, even when you're closed.",
  },
  {
    id: 'faq-4',
    q: 'Can I edit what the AI says?',
    a: 'Yes, fully. From your dashboard you can write custom instructions, add your prices, set your hours, and add FAQs. The AI learns your business and responds accordingly.',
  },
  {
    id: 'faq-5',
    q: 'How is customer data protected?',
    a: 'All conversations and lead data are stored securely in our encrypted database. We never share your customer data with third parties. Business plan includes compliance reports and audit logs.',
  },
  {
    id: 'faq-6',
    q: 'What happens after the 7-day trial?',
    a: "After your trial, you choose a paid plan starting at $29/month. If you don't upgrade, your widget stops responding but your data is kept safe for 30 days.",
  },
  {
    id: 'faq-7',
    q: 'Do I need a website to use CypAI?',
    a: 'No. You can use the QR code feature — print it and place it in your shop. Customers scan it and chat with your AI instantly, no website needed.',
  },
  {
    id: 'faq-8',
    q: 'Can I cancel anytime?',
    a: "Yes. No contracts, no cancellation fees. Cancel from your dashboard at any time and you won't be charged again.",
  },
];

const TESTIMONIALS = [
  {
    name: 'Mehmet Aydın',
    business: 'Kyrenia Car Rentals',
    location: 'Kyrenia, TRNC',
    text: 'Before CypAI, I was answering WhatsApp messages at midnight for price quotes. Now the AI handles everything. I wake up to confirmed bookings.',
    result: 'Bookings up 40% in first month',
    avatar: '🚗',
    stars: 5,
  },
  {
    name: 'Anastasia K.',
    business: 'Bellapais Accommodation',
    location: 'Bellapais, TRNC',
    text: "Our guests speak English, Russian, and Arabic. CypAI answers all of them instantly in their language. We haven't missed a single inquiry since setup.",
    result: 'Zero missed inquiries in 3 months',
    avatar: '🏠',
    stars: 5,
  },
  {
    name: 'Yusuf Özkan',
    business: 'Studio One Barbershop',
    location: 'Nicosia, TRNC',
    text: "I spent 2 hours a day answering 'what are your hours?' and 'how much is a haircut?'. CypAI answers all of that now. I just focus on cutting hair.",
    result: 'Saved 2+ hours every day',
    avatar: '✂️',
    stars: 5,
  },
];

const TRUST_ITEMS = ['🚗 Car Rentals', '💈 Barbershops', '🏠 Accommodation', '🍕 Restaurants', '🏥 Clinics', '💪 Gyms'];

const INTEGRATIONS = [
  { label: 'WhatsApp', emoji: '💬' },
  { label: 'Instagram', emoji: '📸' },
  { label: 'Website', emoji: '🌐' },
  { label: 'WordPress', emoji: '🔌' },
  { label: 'Wix', emoji: '🎨' },
  { label: 'Zapier', emoji: '⚡' },
  { label: 'Make.com', emoji: '🔗' },
  { label: 'Google Calendar', emoji: '📅' },
];

const FEATURES = [
  {
    icon: '💬',
    title: 'WhatsApp + Website Chat',
    desc: 'One AI handles both your website widget and WhatsApp Business — customers reach you wherever they prefer.',
  },
  {
    icon: '📩',
    title: 'Automatic Lead Capture',
    desc: 'AI collects customer name and phone number naturally in conversation. Every lead saved to your dashboard instantly.',
  },
  {
    icon: '🌍',
    title: '4 Languages Automatically',
    desc: 'Detects and responds in English, Turkish, Arabic, or Russian — whichever your customer writes in first.',
  },
  {
    icon: '📅',
    title: 'Booking & Appointment Flow',
    desc: 'AI guides customers through booking — collects dates, preferences, confirms details — then notifies you.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'See every conversation, all captured leads, satisfaction ratings, and weekly performance reports.',
  },
  {
    icon: '🔒',
    title: 'Business Plan: Agent Audit',
    desc: 'AI monitors itself for accuracy and safety. Get a weekly compliance PDF showing how well your agent performed.',
  },
  {
    icon: '⚡',
    title: '15-Minute Setup',
    desc: 'Answer a few questions about your business, set your prices and hours, and go live. No developer needed.',
  },
  {
    icon: '📱',
    title: 'QR Code for Walk-Ins',
    desc: 'Print your QR code, stick it on your counter. Walk-in customers scan and chat — no app download needed.',
  },
];

// HowItWorks panels
function HowPanel({ visual }: { visual: string }) {
  if (visual === 'form') {
    return (
      <div className="space-y-3">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Business Setup Form</p>
        {['Business Name', 'Business Type', 'Services & Prices', 'Opening Hours'].map((f) => (
          <div key={f} className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-slate-600">{f}</div>
            <div className="h-9 w-full rounded-lg border border-slate-200 bg-slate-100" />
          </div>
        ))}
        <div className="mt-4 rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white">Save &amp; Continue →</div>
      </div>
    );
  }
  if (visual === 'training') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
        <p className="text-sm font-bold text-slate-800">Training your AI agent…</p>
        <div className="w-full space-y-2.5">
          {[{ l: 'Ingesting business data', d: true }, { l: 'Configuring responses', d: true }, { l: 'Language support setup', d: false }].map(({ l, d }) => (
            <div key={l} className="flex items-center gap-2.5 text-xs text-slate-600">
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${d ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {d ? <Check className="h-2.5 w-2.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
              </div>
              {l}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (visual === 'deploy') {
    return (
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Your Installation Code</p>
        <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs leading-6 text-slate-300">
          <div className="text-slate-500">{'<!-- Paste before </body> -->'}</div>
          <div className="mt-1 text-emerald-400">{'<script>'}</div>
          <div className="pl-3 text-yellow-300">{'  window.CypAIConfig = {'}</div>
          <div className="pl-6 text-blue-300">{'businessId: "your-id"'}</div>
          <div className="pl-3 text-yellow-300">{'}'}</div>
          <div className="text-emerald-400">{'</script>'}</div>
          <div className="mt-1 text-emerald-400">{'<script src="cypai.vercel.app/widget.js"></script>'}</div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
          <Check className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">AI is live on your website</span>
        </div>
      </div>
    );
  }
  if (visual === 'chat') {
    return (
      <div className="space-y-2">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Live Conversation</p>
        {[
          { r: 'user', t: 'Do you have cars for this weekend?' },
          { r: 'ai', t: 'Yes! 🚗 Economy from $25/day, SUV from $55/day. What dates?' },
          { r: 'user', t: 'June 10–15, SUV please' },
          { r: 'ai', t: 'Perfect! Could I get your name and phone number? 📞' },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${m.r === 'user' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'}`}>{m.t}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Dashboard Overview</p>
      <div className="grid grid-cols-2 gap-2">
        {[{ l: 'Conversations', v: '247' }, { l: 'Leads Captured', v: '38' }, { l: 'This Month', v: '61' }, { l: 'Response Rate', v: '100%' }].map((s) => (
          <div key={s.l} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">{s.l}</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Live Demo Modal
type DemoMsg = { role: 'user' | 'assistant'; content: string };

function LiveDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<DemoMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! 👋 I'm CypAI, demo mode for DriveEasy Car Rentals. Ask me anything about rentals, prices, or availability!" }]);
    }
  }, [open, messages.length]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const userMsg: DemoMsg = { role: 'user', content: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })), businessId: 'demo', sessionId, systemPrompt: DEMO_SYSTEM_PROMPT }),
      });
      const data = await res.json() as { message?: string };
      setMessages((p) => [...p, { role: 'assistant', content: data.message || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: 'Demo temporarily unavailable. Try again!' }]);
    } finally { setSending(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Live Demo</p>
            <h2 className="text-lg font-bold text-slate-900">DriveEasy Car Rentals AI</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        <div className="h-80 space-y-3 overflow-y-auto bg-slate-50 p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm border border-slate-100 bg-white text-slate-700 shadow-sm'}`}>{m.content}</div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5">
            {DEMO_SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => void send(s)} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">{s}</button>
            ))}
          </div>
        )}
        <div className="border-t border-slate-100 p-4">
          <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
            <button type="submit" disabled={!input.trim() || sending} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main Page
export default function Home() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const hasTrackedPricingView = useRef(false);

  const dictionary = getDictionary(locale);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) setLocale(stored as Locale);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('[data-observe]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).dataset.observe;
          if (id) {
            setVisibleSections((p) => new Set(p).add(id));
            if (id === 'pricing' && !hasTrackedPricingView.current) {
              hasTrackedPricingView.current = true;
              Analytics.pricingViewed();
            }
          }
        }
      });
    }, { threshold: 0.1 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function vis(id: string) {
    return visibleSections.has(id) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0';
  }

  return (
    <>
      <LiveDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* NAVBAR */}
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-200 ${scrolled ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md' : 'border-b border-slate-100 bg-white'}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 lg:px-6">
          <a href="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900">🤖 CypAI</a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#pricing" className="transition hover:text-slate-900">Pricing</a>
            <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
            <a href="/blog" className="transition hover:text-slate-900">Blog</a>
            <a href="/demo" className="transition hover:text-slate-900">Demo</a>
            <a href="/dashboard" className="font-semibold text-blue-600 transition hover:text-blue-700">Dashboard</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={() => Analytics.whatsappClicked('landing')} aria-label="Chat on WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full text-[#25D366] transition hover:bg-green-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.56 0 .27 5.3.27 11.79c0 2.08.54 4.12 1.57 5.92L0 24l6.48-1.7a11.78 11.78 0 0 0 5.57 1.42h.01c6.5 0 11.79-5.3 11.79-11.79 0-3.14-1.22-6.09-3.33-8.45Zm-8.46 18.27h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-3.84 1.01 1.02-3.74-.24-.38a9.8 9.8 0 0 1-1.52-5.27c0-5.42 4.41-9.83 9.84-9.83 2.62 0 5.08 1.02 6.94 2.89a9.77 9.77 0 0 1 2.89 6.95c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.37c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.93 1.18-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.06 2.9 1.21 3.1.15.2 2.08 3.18 5.05 4.46.71.31 1.27.5 1.7.64.71.22 1.35.19 1.86.12.57-.08 1.78-.73 2.03-1.43.25-.69.25-1.29.17-1.42-.08-.12-.27-.2-.57-.35Z" /></svg>
            </a>
            <a href="/login" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">Login</a>
            <a href="/signup?plan=pro" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Start Free Trial</a>
          </div>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 md:hidden" onClick={() => setMobileMenuOpen((v) => !v)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {mobileMenuOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 md:hidden">
            <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              {[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'FAQ', href: '#faq' }, { label: 'Blog', href: '/blog' }, { label: 'Demo', href: '/demo' }, { label: 'Dashboard', href: '/dashboard' }].map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition hover:bg-slate-50">{label}</a>
              ))}
              <div className="mt-3 flex gap-2">
                <a href="/login" className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Login</a>
                <a href="/signup?plan=pro" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700">Start Free Trial</a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* HERO */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
          </div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium mb-6">
                  🇬🇾 Built for Northern Cyprus Businesses
                </div>
                <h1 className="text-5xl font-bold leading-tight mb-6">
                  Your AI Agent That{' '}
                  <span className="text-blue-400">Never Misses a Customer</span>
                </h1>
                <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                  24/7 AI assistant for car rentals, barbershops, hotels, and restaurants. Handles WhatsApp + website chat automatically — in English, Turkish, Arabic, and Russian.
                </p>
                <div className="flex flex-wrap gap-3 mb-8 text-sm text-slate-400">
                  <span className="flex items-center gap-1">✓ Setup in 15 minutes</span>
                  <span className="flex items-center gap-1">✓ No technical skills needed</span>
                  <span className="flex items-center gap-1">✓ 7-day free trial</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/signup?plan=pro" onClick={() => Analytics.heroCtaClicked('pro')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 text-center">
                    Start Free Trial →
                  </a>
                  <a href="/demo" className="border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold px-8 py-4 rounded-xl text-lg transition-all text-center">
                    See Live Demo
                  </a>
                </div>
                <p className="text-slate-500 text-sm mt-4">
                  No credit card required for trial · Cancel anytime · PayPal secure payment
                </p>
              </div>

              {/* Right: Live chat demo preview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="bg-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
                    <div>
                      <p className="text-white font-semibold text-sm">Kyrenia Car Rentals AI</p>
                      <p className="text-blue-200 text-xs">🟢 Online 24/7</p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 min-h-[280px]">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">🤖</div>
                      <div className="bg-slate-700 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-white max-w-[80%]">
                        Merhaba! 👋 Hi! How can I help you today? I can help with car rentals, prices, and availability.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none px-3 py-2 text-sm text-white max-w-[80%]">
                        How much for a SUV for 3 days?
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">🤖</div>
                      <div className="bg-slate-700 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-white max-w-[80%]">
                        Our SUV is $55/day — so 3 days would be <strong>$165 total</strong>. 🚙 Shall I take your name and number to confirm the booking?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-none px-3 py-2 text-sm text-white max-w-[80%]">
                        Yes! I&apos;m Ahmed, +90 533 xxx xxxx
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">🤖</div>
                      <div className="bg-green-700 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-white max-w-[80%]">
                        ✅ Perfect Ahmed! Lead captured. The owner will confirm your booking within 1 hour. Thank you!
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-700 px-4 py-3 flex gap-2">
                    <a href="/demo" className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm cursor-pointer hover:bg-slate-600 transition-colors text-center">
                      💬 Try the live demo yourself →
                    </a>
                  </div>
                </div>
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-green-400 text-lg">📩</span>
                  <div>
                    <p className="text-green-400 text-sm font-medium">Lead captured automatically</p>
                    <p className="text-slate-400 text-xs">Ahmed&apos;s contact saved to your dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social proof bar */}
            <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-slate-400 text-sm">Always online</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-slate-400 text-sm">Languages spoken</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15min</p>
                <p className="text-slate-400 text-sm">Setup time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">$0</p>
                <p className="text-slate-400 text-sm">To start (7-day trial)</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="overflow-hidden border-y border-slate-200 bg-slate-50 py-8">
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Trusted by local businesses across Northern Cyprus
          </p>
          <div className="flex">
            {[0, 1].map((i) => (
              <div key={i} className="flex shrink-0 animate-[marquee_22s_linear_infinite] items-center gap-5 pr-5" {...(i === 1 ? { 'aria-hidden': true as const } : {})}>
                {TRUST_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{item}</div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" data-observe="how" className={`bg-white py-16 transition-all duration-700 md:py-24 ${vis('how')}`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">How it works</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">An end-to-end solution for your business</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-1.5">
                {HOW_STEPS.map((step, idx) => {
                  const active = activeStep === idx;
                  return (
                    <button key={step.num} type="button" onClick={() => setActiveStep(idx)} className={`group flex items-start gap-4 rounded-xl p-4 text-left transition-all ${active ? 'border border-blue-200 bg-blue-50' : 'border border-transparent hover:bg-slate-50'}`}>
                      <span className={`shrink-0 text-sm font-black tabular-nums ${active ? 'text-blue-600' : 'text-slate-300'}`}>{step.num}</span>
                      <div>
                        <p className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</p>
                        {active && <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.body}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
                <div className="mb-5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Step {HOW_STEPS[activeStep].num}</span>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">{HOW_STEPS[activeStep].title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{HOW_STEPS[activeStep].body}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <HowPanel visual={HOW_STEPS[activeStep].visual} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" data-observe="features" className={`bg-slate-50 py-16 transition-all duration-700 md:py-24 ${vis('features')}`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Features</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Everything your business needs</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section data-observe="integrations" className={`bg-white py-14 transition-all duration-700 ${vis('integrations')}`}>
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Integrations</p>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">Works with your tools</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {INTEGRATIONS.map(({ label, emoji }) => (
                <div key={label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">
                  <span>{emoji}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" data-observe="pricing" className={`bg-slate-50 py-16 transition-all duration-700 md:py-24 ${vis('pricing')}`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <PricingGrid dictionary={dictionary} />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section data-observe="testimonials" className={`bg-white py-16 transition-all duration-700 md:py-20 ${vis('testimonials')}`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Testimonials</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Businesses growing with CypAI</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl">
                      {t.avatar}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.business} · {t.location}</p>
                    </div>
                  </div>
                  <span className="inline-flex self-start items-center bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    {t.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" data-observe="faq" className={`bg-slate-50 py-16 transition-all duration-700 md:py-20 ${vis('faq')}`}>
          <div className="mx-auto max-w-3xl px-4 lg:px-6">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">FAQ</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {FAQ_ITEMS.map((item) => {
                const open = openFaqId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      data-testid="faq-question"
                      onClick={() => setOpenFaqId(open ? null : item.id)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-semibold text-gray-900">{item.q}</span>
                      <span className={`shrink-0 text-xl font-light text-slate-400 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {open && (
                      <div data-testid="faq-answer" data-state="open" className="text-gray-600 text-sm leading-relaxed pb-5">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TRUST / CTA */}
        <section className="bg-blue-600 py-16 px-4 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to never miss a customer again?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join local Cyprus businesses already using AI to capture leads while they sleep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/signup?plan=pro"
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-all"
              >
                Start Free 7-Day Trial
              </a>
              <a
                href="https://wa.me/905338425559?text=Hi%2C%20I%20want%20to%20learn%20more%20about%20CypAI"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => Analytics.whatsappClicked('landing')}
                className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all"
              >
                💬 Chat With Us First
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <span>✓ No credit card required</span>
              <span>✓ Setup in 15 minutes</span>
              <span>✓ Cancel anytime</span>
              <span>✓ PayPal secure payment</span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🤖</span>
                  <span className="text-white font-bold text-xl">CypAI</span>
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  AI agents for local businesses in Cyprus. 24/7 customer support in English, Turkish, Arabic, and Russian — on WhatsApp and your website.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <span>📍</span>
                  <span>Made for Northern Cyprus 🇨🇾</span>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    ✉️ {CONTACT_EMAIL}
                  </a>
                  <a href="https://wa.me/905338425559" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    💬 WhatsApp: {WA_NUMBER}
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/demo" className="hover:text-white transition-colors">Live Demo</a></li>
                  <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="/login" className="hover:text-white transition-colors">Client Login</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
              <p>© 2026 CypAI. All rights reserved.</p>
              <p className="text-slate-500">
                Serving businesses across Northern Cyprus — Kyrenia · Nicosia · Famagusta · Güzelyurt
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
