'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart2,
  Check,
  Clock,
  Globe,
  Menu,
  MessageCircle,
  Plus,
  Send,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';

import { PricingGrid } from '@/components/ui/pricing-grid';
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from '@/lib/i18n';

// Constants
const WA_LINK =
  'https://wa.me/905338425559?text=Hi%2C%20I%27m%20interested%20in%20BizAI';
const WA_NUMBER = '+90 533 842 5559';
const CONTACT_EMAIL = 'bizaicyprus123@gmail.com';

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
  { id: 'q1', q: 'Do I need technical knowledge?', a: 'No technical knowledge needed. We handle setup within 24 hours. You just paste one line of code — we send exact instructions.' },
  { id: 'q2', q: 'Which languages does the AI support?', a: 'BizAI speaks English, Turkish, Arabic, and Russian fluently. Perfect for Northern Cyprus businesses serving tourists and international students.' },
  { id: 'q3', q: 'Can it connect to my WhatsApp?', a: 'Yes! WhatsApp is available on Pro and Business plans. Setup takes under 10 minutes with our guidance.' },
  { id: 'q4', q: 'How long does setup take?', a: 'Most businesses are live within 24 hours. You fill in your details (15 min), we train the AI, you add one line of code and go live.' },
  { id: 'q5', q: 'How is customer data protected?', a: 'All data is encrypted and stored securely. We never sell your customer information. Export or delete anytime from your dashboard.' },
  { id: 'q6', q: 'Can I change what the AI says?', a: 'Yes, from your dashboard update instructions, FAQs, prices, and personality anytime. Changes go live in minutes.' },
  { id: 'q7', q: "What if the AI doesn't know the answer?", a: "It politely says someone will follow up, saves the conversation, and you respond personally. It never makes up wrong information." },
  { id: 'q8', q: 'Can I cancel anytime?', a: 'Yes. No contracts, no fees. Cancel from your dashboard with one click. Access continues until your billing period ends.' },
];

const TESTIMONIALS = [
  { quote: 'We used to miss bookings every night. Now BizAI handles everything while we sleep.', name: 'Mehmet K.', role: 'Car Rental Owner, Kyrenia', initials: 'MK', color: 'bg-blue-500' },
  { quote: 'International students love that it speaks their language. Bookings doubled.', name: 'Sarah A.', role: 'Accommodation Manager, Nicosia', initials: 'SA', color: 'bg-violet-500' },
  { quote: 'Setup was done in one day. Worth every dollar.', name: 'Ali R.', role: 'Barbershop Owner, Famagusta', initials: 'AR', color: 'bg-emerald-500' },
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
          <div className="pl-3 text-yellow-300">{'  window.BizAIConfig = {'}</div>
          <div className="pl-6 text-blue-300">{'businessId: "your-id"'}</div>
          <div className="pl-3 text-yellow-300">{'}'}</div>
          <div className="text-emerald-400">{'</script>'}</div>
          <div className="mt-1 text-emerald-400">{'<script src="bizai.vercel.app/widget.js"></script>'}</div>
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
      setMessages([{ role: 'assistant', content: "Hi! 👋 I'm BizAI, demo mode for DriveEasy Car Rentals. Ask me anything about rentals, prices, or availability!" }]);
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
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-slate-100">
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
            <button type="submit" disabled={!input.trim() || sending} className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50">
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
  const [openFaqId, setOpenFaqId] = useState<string | null>('q1');
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const router = useRouter();

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
          if (id) setVisibleSections((p) => new Set(p).add(id));
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
          <a href="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900">🤖 BizAI</a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#pricing" className="transition hover:text-slate-900">Pricing</a>
            <a href="#how-it-works" className="transition hover:text-slate-900">How It Works</a>
            <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
            <a href="/dashboard" className="font-semibold text-blue-600 transition hover:text-blue-700">Dashboard</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a href={WA_LINK} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full text-[#25D366] transition hover:bg-green-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.56 0 .27 5.3.27 11.79c0 2.08.54 4.12 1.57 5.92L0 24l6.48-1.7a11.78 11.78 0 0 0 5.57 1.42h.01c6.5 0 11.79-5.3 11.79-11.79 0-3.14-1.22-6.09-3.33-8.45Zm-8.46 18.27h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-3.84 1.01 1.02-3.74-.24-.38a9.8 9.8 0 0 1-1.52-5.27c0-5.42 4.41-9.83 9.84-9.83 2.62 0 5.08 1.02 6.94 2.89a9.77 9.77 0 0 1 2.89 6.95c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.37c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.93 1.18-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.06 2.9 1.21 3.1.15.2 2.08 3.18 5.05 4.46.71.31 1.27.5 1.7.64.71.22 1.35.19 1.86.12.57-.08 1.78-.73 2.03-1.43.25-.69.25-1.29.17-1.42-.08-.12-.27-.2-.57-.35Z" /></svg>
            </a>
            <a href="/dashboard" className="text-sm font-semibold text-slate-700 transition hover:text-slate-900">Login</a>
            <a href="/signup?plan=pro" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Start Free Trial</a>
          </div>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 md:hidden" onClick={() => setMobileMenuOpen((v) => !v)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {mobileMenuOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 md:hidden">
            <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              {[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'How It Works', href: '#how-it-works' }, { label: 'FAQ', href: '#faq' }, { label: 'Dashboard', href: '/dashboard' }].map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 transition hover:bg-slate-50">{label}</a>
              ))}
              <div className="mt-3 flex gap-2">
                <a href="/dashboard" className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Login</a>
                <a href="/signup?plan=pro" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700">Start Free Trial</a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* HERO */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  🤖 AI-Powered · Built for Cyprus
                </div>
                <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-[3.5rem]">
                  AI Agents for Local Businesses in Cyprus
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-slate-500">
                  Deploy a 24/7 AI assistant that answers customers, captures leads, and books appointments — on your website and WhatsApp. Live in 24 hours.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => router.push('/signup?plan=pro')} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-blue-700">
                    Start Free Trial →
                  </button>
                  <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                    See Live Demo
                  </button>
                </div>
                <p className="mt-4 text-xs font-medium text-slate-500">
                  ✓ No credit card required &nbsp;·&nbsp; ✓ Setup in 24 hours &nbsp;·&nbsp; ✓ Cancel anytime
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" aria-hidden="true" />
                <div className="absolute -top-3 right-2 z-10 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg md:-top-4 md:right-0">
                  <span className="text-lg">🎉</span>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-slate-900">New lead captured!</p>
                    <p className="text-xs text-slate-500">Ahmed · +905XX XXX XXXX</p>
                  </div>
                </div>
                <div className="relative z-[1] w-[17rem] overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-white shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900 px-4 py-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <p className="text-xs font-semibold text-white">BizAI — DriveEasy Car Rentals</p>
                  </div>
                  <div className="space-y-2 bg-slate-50 px-3 py-3">
                    {[
                      { r: 'user', t: 'Do you have SUVs available this weekend?' },
                      { r: 'ai', t: 'Yes! 🚗 We have 3 SUVs from $55/day. What are your dates?' },
                      { r: 'user', t: 'Great, how do I book?' },
                      { r: 'ai', t: 'I can help with that! What are your dates? 📅' },
                    ].map((msg, i) => (
                      <div key={i} className={`flex ${msg.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${msg.r === 'user' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-white text-slate-700 shadow-sm'}`}>{msg.t}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5">
                    <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-400">Type a message...</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600"><Send className="h-3 w-3 text-white" /></div>
                  </div>
                </div>
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
              <div key={i} className="flex shrink-0 animate-[marquee_22s_linear_infinite] items-center gap-5 pr-5" aria-hidden={i === 1}>
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
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Build the perfect AI agent for your business</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {/* Large: Lead Capture */}
              <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md xl:row-span-2">
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600"><Users className="h-6 w-6" /></div>
                <h3 className="text-lg font-bold text-slate-900">Lead Capture That Works</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">AI collects customer name and phone number automatically during every conversation. Never lose a lead again.</p>
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase text-slate-400">
                    <span>Name</span><span>Phone</span><span>Date</span>
                  </div>
                  {[['Ahmed M.', '+905XX XXX', 'Today'], ['Natalia K.', '+905XX XXX', 'Yesterday'], ['Özgür T.', '+905XX XXX', '2 days ago']].map(([n, p, d]) => (
                    <div key={n} className="grid grid-cols-3 border-t border-slate-100 px-3 py-2.5 text-xs text-slate-700">
                      <span className="font-semibold">{n}</span><span className="text-slate-500">{p}</span><span className="text-slate-500">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Large: WhatsApp */}
              <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-green-50 p-3 text-[#25D366]"><MessageCircle className="h-6 w-6" /></div>
                <h3 className="text-lg font-bold text-slate-900">WhatsApp Integration</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Your AI replies to WhatsApp messages automatically. Businesses in Cyprus live on WhatsApp.</p>
                <div className="mt-5 space-y-2 rounded-xl bg-[#e5ddd5] p-3">
                  {[{ r: 'user', t: '🙋 Do you have rooms available?' }, { r: 'ai', t: '✅ Yes! From $45/night. What dates?' }, { r: 'user', t: 'June 15–20' }].map((m, i) => (
                    <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.r === 'user' ? 'bg-[#dcf8c6] text-slate-800' : 'bg-white text-slate-800 shadow-sm'}`}>{m.t}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Small: Multilingual */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-violet-50 p-3 text-violet-600"><Globe className="h-6 w-6" /></div>
                <h3 className="text-base font-bold text-slate-900">Multilingual</h3>
                <p className="mt-1 text-sm text-slate-600">English, Turkish, Arabic, and Russian — perfect for Northern Cyprus.</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['🇬🇧 EN', '🇹🇷 TR', '🇸🇦 AR', '🇷🇺 RU'].map((l) => (
                    <span key={l} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{l}</span>
                  ))}
                </div>
              </div>
              {/* Small: 24/7 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-500"><Clock className="h-6 w-6" /></div>
                <h3 className="text-base font-bold text-slate-900">24/7 Availability</h3>
                <p className="mt-1 text-sm text-slate-600">Never misses a customer, even at 3am. Your AI works while you sleep.</p>
              </div>
              {/* Small: Analytics */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-cyan-50 p-3 text-cyan-600"><BarChart2 className="h-6 w-6" /></div>
                <h3 className="text-base font-bold text-slate-900">Analytics Dashboard</h3>
                <p className="mt-1 text-sm text-slate-600">See all conversations, leads, and performance metrics in one clean view.</p>
              </div>
              {/* Small: Easy Setup */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600"><Zap className="h-6 w-6" /></div>
                <h3 className="text-base font-bold text-slate-900">Easy Setup</h3>
                <p className="mt-1 text-sm text-slate-600">Live in 24 hours. No technical skills required — we do the setup for you.</p>
              </div>
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
            <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-center text-sm font-semibold text-amber-900 shadow-sm">
              ⚡ Free setup included this month (worth $99) — limited spots available
            </div>
            <PricingGrid dictionary={dictionary} />
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {['🔒 Secure PayPal Payments', '↩️ 7-Day Money Back Guarantee', '📞 Local Cyprus Support'].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-600 shadow-sm">{item}</div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section data-observe="testimonials" className={`bg-white py-16 transition-all duration-700 md:py-20 ${vis('testimonials')}`}>
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">Testimonials</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Businesses growing with BizAI</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}>{t.initials}</div>
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
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
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => {
                const open = openFaqId === item.id;
                return (
                  <div key={item.id} className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${open ? 'border-blue-200 bg-white' : 'border-slate-200 bg-white'}`}>
                    <button type="button" data-testid="faq-question" onClick={() => setOpenFaqId(open ? null : item.id)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                      <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                      <div className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : 'rotate-0'}`}>
                        <Plus className={`h-4 w-4 ${open ? 'text-blue-600' : 'text-slate-400'}`} />
                      </div>
                    </button>
                    {open && (
                      <div data-testid="faq-answer" data-state="open" className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section data-observe="cta" className={`bg-[#0f172a] py-20 transition-all duration-700 ${vis('cta')}`}>
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">Ready to never miss a customer again?</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">Join businesses across Cyprus already using BizAI to capture more leads.</p>
            <a href="#pricing" className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-extrabold text-slate-900 shadow-xl transition hover:bg-slate-100">
              Start Building Free →
            </a>
            <p className="mt-6 text-sm text-slate-500">
              Questions?{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-300 transition hover:text-white">Email {CONTACT_EMAIL}</a>
              {' '}or{' '}
              <a href={WA_LINK} target="_blank" rel="noreferrer" className="text-slate-300 transition hover:text-white">WhatsApp {WA_NUMBER}</a>
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="footer" className="border-t border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="grid gap-10 md:grid-cols-4">
              <div>
                <p className="text-xl font-extrabold text-slate-900">🤖 BizAI</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">AI assistants for local businesses.</p>
                <p className="mt-3 text-xs font-semibold text-slate-400">Made in Cyprus 🇨🇾</p>
              </div>
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Product</p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li><a href="#features" className="transition hover:text-slate-900">Features</a></li>
                  <li><a href="#pricing" className="transition hover:text-slate-900">Pricing</a></li>
                  <li><button type="button" onClick={() => setDemoOpen(true)} className="transition hover:text-slate-900">Demo</button></li>
                  <li><a href="/dashboard" className="transition hover:text-slate-900">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Support</p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li><a href="#faq" className="transition hover:text-slate-900">FAQ</a></li>
                  <li><a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-slate-900">Contact</a></li>
                  <li><a href="/privacy" className="transition hover:text-slate-900">Privacy Policy</a></li>
                  <li><a href="/terms" className="transition hover:text-slate-900">Terms</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Contact</p>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-2 transition hover:text-slate-900"><span>📧</span><span className="break-all">{CONTACT_EMAIL}</span></a></li>
                  <li><a href={WA_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-slate-900"><span>💬</span>{WA_NUMBER}</a></li>
                  <li className="flex items-center gap-2"><span>📍</span>Nicosia, Northern Cyprus</li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">© 2025 BizAI · All rights reserved</div>
          </div>
        </footer>
      </main>
    </>
  );
}
