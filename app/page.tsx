'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, MessageCircle, Send, ShieldCheck, User, Zap } from 'lucide-react';
import { HeroV2 } from '@/components/ui/hero-v2';
import { PricingGrid } from '@/components/ui/pricing-grid';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDictionary,
  isLocale,
  type Locale,
} from '@/lib/i18n';

const trustLogos = ['DriveEasy Rentals', 'Nicosia Barber Co.', 'Sunset Restaurant', 'Kyrenia Clinic'];

const featureCards = [
  {
    title: 'Lead Capture That Works',
    description: 'Automatically collects names and phone numbers from real customer conversations.',
    Icon: MessageCircle,
  },
  {
    title: 'Built for Local Teams',
    description: 'Handles common requests in English, Turkish, Arabic, and Russian.',
    Icon: Building2,
  },
  {
    title: 'Fast and Reliable',
    description: 'Instant responses with realistic flows for bookings, pricing, and follow-ups.',
    Icon: Zap,
  },
  {
    title: 'Safe by Default',
    description: 'Secure data handling with clear controls and audit-friendly customer records.',
    Icon: ShieldCheck,
  },
];

const DEMO_SYSTEM_PROMPT =
  'You are a friendly AI assistant for DriveEasy Car Rentals in Northern Cyprus. You help customers with: vehicle availability (Economy $25/day, Compact $35/day, SUV $55/day, Van $75/day), booking process, requirements (valid license, passport, credit card deposit), pickup locations (Nicosia, Kyrenia, Famagusta, Airport). Always try to collect customer name and phone number for bookings. Keep responses short and friendly. Use emojis occasionally.';

const demoSuggestions = [
  'Do you have SUVs available?',
  'What documents do I need?',
  'How much does it cost?',
];

const faqItems = [
  {
    id: 'q1',
    question: 'Do I need technical knowledge?',
    answer:
      "No technical knowledge needed at all. Once you sign up, we handle the entire setup for you within 24 hours. To add the widget to your website, you just paste one line of code — we'll send you exact instructions. If you use WordPress or Wix, it's even easier with our plugin.",
  },
  {
    id: 'q2',
    question: 'Which languages does the AI support?',
    answer:
      'BizAI speaks English, Turkish, Arabic, and Russian fluently. This makes it perfect for businesses in Northern Cyprus that serve international tourists and students. You can also set a default language for your specific business.',
  },
  {
    id: 'q3',
    question: 'Can it connect to my WhatsApp?',
    answer:
      'Yes! WhatsApp integration is available on Pro and Business plans. Your AI will automatically read and reply to WhatsApp messages from customers 24/7. Setup takes less than 10 minutes and we guide you through every step.',
  },
  {
    id: 'q4',
    question: 'How long does setup take?',
    answer:
      "Most businesses are fully live within 24 hours of signing up. Here's how it works: you fill in your business details (15 minutes), we train and configure your AI (up to 24 hours), then you add one line of code to your website and go live immediately.",
  },
  {
    id: 'q5',
    question: 'How is customer data protected?',
    answer:
      'All customer data is encrypted and stored securely in our cloud database. We never sell or share your customer information with third parties. You own all your data and can export or delete it anytime from your dashboard.',
  },
  {
    id: 'q6',
    question: 'Can I change what the AI says?',
    answer:
      "Absolutely. From your dashboard you can update your AI's instructions, add custom FAQs, change its personality, and update your prices and services anytime. Changes go live within minutes.",
  },
  {
    id: 'q7',
    question: "What if the AI doesn't know the answer?",
    answer:
      "If a customer asks something your AI hasn't been trained on, it politely tells them it will have someone follow up shortly — and saves the conversation so you can respond personally. It never makes up wrong information.",
  },
  {
    id: 'q8',
    question: 'Can I cancel anytime?',
    answer:
      'Yes, completely. No contracts, no cancellation fees. Cancel from your dashboard with one click. You keep access until the end of your billing period.',
  },
];

export default function Home() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [openFaqId, setOpenFaqId] = useState<string | null>('q1');

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) {
      setLocale(stored);
    }
  }, []);

  function handleLanguageChange(next: Locale) {
    setLocale(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="text-lg font-extrabold text-slate-900">BizAI</div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#features" className="hover:text-slate-900">{dictionary.navFeatures}</a>
            <a href="#pricing" className="hover:text-slate-900">{dictionary.navPricing}</a>
            <a href="#faq" className="hover:text-slate-900">{dictionary.navFaq}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.navContact}</a>
          </nav>
          <LanguageSwitcher value={locale} onChange={handleLanguageChange} />
        </div>
      </header>

      <HeroV2 dictionary={dictionary} />

      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 lg:px-6">
          {trustLogos.map((logo) => (
            <span key={logo} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">
              {logo}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="bg-[var(--color-neutral)] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Everything your team needs to respond faster</h2>
            <p className="mt-2 text-slate-600">
              Purpose-built for Cyprus businesses that want more bookings and fewer missed messages.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.map(({ title, description, Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-[#0F6B66]/10 p-2 text-[#0F6B66]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LiveDemo />

      <PricingGrid dictionary={dictionary} />

      <section id="faq" className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{dictionary.faqTitle}</h2>
          <p className="mt-2 text-slate-600">
            Everything you need to know about setup, languages, WhatsApp integration, and billing.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqId === item.id;

            return (
              <div key={item.id} className={idx === faqItems.length - 1 ? '' : 'border-b border-slate-200'}>
                <button
                  type="button"
                  onClick={() => setOpenFaqId((prev) => (prev === item.id ? null : item.id))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                >
                  <span className="text-base font-bold text-slate-900">{item.question}</span>
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={`faq-panel-${item.id}`}
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-[#64748b]">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer id="footer" className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 lg:px-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">BizAI</h3>
            <p className="mt-1 text-sm text-slate-600">{dictionary.footerTagline}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{dictionary.footerMadeIn}</p>
          </div>
          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p>
              Email:{' '}
              <a href="mailto:support@bizai.cy" className="font-medium hover:text-slate-900 hover:underline">
                support@bizai.cy
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href="https://wa.me/90548XXXXXXX" target="_blank" rel="noreferrer" className="font-medium hover:text-slate-900 hover:underline">
                +90 548 XXX XXXX
              </a>
            </p>
            <p className="sm:col-span-2">Location: Nicosia, Northern Cyprus 🇨🇾</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700">
            <a href="mailto:support@bizai.cy" className="hover:text-slate-900">{dictionary.footerContact}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.footerPrivacy}</a>
            <a href="#footer" className="hover:text-slate-900">{dictionary.footerTerms}</a>
            <a href="https://wa.me/90548XXXXXXX" target="_blank" rel="noreferrer" className="hover:text-slate-900">{dictionary.footerDemo}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function LiveDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi 👋 I am your DriveEasy assistant. Ask me about SUVs, pricing, documents, or pickup locations.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, endRef]);

  async function sendMessage(rawMessage: string) {
    const userMessage = rawMessage.trim();
    if (!userMessage || sending) {
      return;
    }

    const nextHistory = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(nextHistory);
    setInput('');
    setTyping(true);
    setSending(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: 'DriveEasy Car Rentals',
          businessType: 'car_rental',
          systemPrompt: DEMO_SYSTEM_PROMPT,
          userMessage,
          conversationHistory: nextHistory.map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      });

      const data = await response.json();
      const reply = response.ok
        ? (data.reply as string)
        : 'Sorry, demo is temporarily unavailable. Please try again in a moment.';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I had trouble reaching the AI service just now. Please try again, and I can help with SUVs, pricing, and booking requirements.',
        },
      ]);
    } finally {
      setTyping(false);
      setSending(false);
    }
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <p className="mb-4 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          🔴 Live Demo — Type anything, this is real AI
        </p>

        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-3 text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <p className="text-sm font-semibold">BizAI Demo — DriveEasy Car Rentals</p>
          </div>

          <div className="h-[360px] space-y-3 overflow-y-auto bg-white p-4">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'assistant' ? 'flex items-start gap-2' : ''}`}>
                  {msg.role === 'assistant' ? (
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                      🤖
                    </span>
                  ) : null}
                  <p
                    className={`rounded-2xl px-3 py-2 text-sm leading-6 ${
                      msg.role === 'user'
                        ? 'rounded-br-sm bg-blue-600 text-white'
                        : 'rounded-bl-sm bg-slate-100 text-slate-700'
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {typing ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">🤖</span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {demoSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={sending}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask about cars, pricing, pickup points..."
                className="h-10 flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={sending || !input.trim()}
                className="inline-flex h-10 items-center gap-1 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}