'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────
type DemoMsg = { role: 'user' | 'assistant'; content: string };

type DemoConfig = {
  id: string;
  label: string;
  emoji: string;
  businessName: string;
  businessType: string;
  systemPrompt: string;
  welcomeMessage: string;
  suggestions: string[];
  color: string;
};

// ── Demo configurations ───────────────────────────────────────────────────────
const DEMOS: DemoConfig[] = [
  {
    id: 'car-rental',
    label: 'Car Rental',
    emoji: '🚗',
    businessName: 'DriveEasy Car Rentals',
    businessType: 'car_rental',
    systemPrompt:
      'You are a friendly AI assistant for DriveEasy Car Rentals in Northern Cyprus. Help customers with: vehicle availability (Economy $25/day, Compact $35/day, SUV $55/day, Van $75/day), booking process, requirements (valid license, passport, credit card deposit), pickup locations (Nicosia, Kyrenia, Famagusta, Airport). Always try to collect customer name and phone number for bookings. Keep responses short and friendly. Use emojis occasionally.',
    welcomeMessage:
      "Hi! 👋 Welcome to DriveEasy Car Rentals. I can help with availability, prices, and bookings. What would you like to know?",
    suggestions: [
      'What cars do you have?',
      'How much for an SUV?',
      'What documents do I need?',
      'Do you do airport pickup?',
    ],
    color: '#2563eb',
  },
  {
    id: 'barbershop',
    label: 'Barbershop',
    emoji: '💈',
    businessName: 'StyleCut Barbershop',
    businessType: 'barbershop',
    systemPrompt:
      'You are a friendly AI assistant for StyleCut Barbershop in Northern Cyprus. Help customers with: services and prices (Haircut $15, Beard Trim $10, Full Package $22, Kids Cut $10), opening hours (Mon–Sat 9am–8pm, Sun 10am–5pm), appointment booking, and walk-in availability. Always be warm and welcoming. Keep responses short. Use emojis occasionally.',
    welcomeMessage:
      "Hey there! ✂️ Welcome to StyleCut Barbershop. Ask me about our services, prices, or to book an appointment!",
    suggestions: [
      'How much is a haircut?',
      'Can I book for Saturday?',
      'What time do you open?',
      'Do you do beard trims?',
    ],
    color: '#7c3aed',
  },
  {
    id: 'accommodation',
    label: 'Accommodation',
    emoji: '🏠',
    businessName: 'CozyStay Student Accommodation',
    businessType: 'accommodation',
    systemPrompt:
      'You are a helpful AI assistant for CozyStay Student Accommodation near EMU University in Northern Cyprus. Help with: room types (Single $250/month, Double $180/month per person, Studio $350/month), what\'s included (WiFi, utilities, fully furnished), proximity to EMU (5 min walk), availability, and how to book a viewing. Collect student name and contact info for viewings. Keep responses friendly and concise. Use emojis occasionally.',
    welcomeMessage:
      "Hi! 🏠 Looking for student accommodation near EMU? I can help with rooms, prices, and availability. What would you like to know?",
    suggestions: [
      'Do you have rooms available?',
      'How far from EMU university?',
      "What's included?",
      "What's the monthly price?",
    ],
    color: '#059669',
  },
];

// ── Chat component ─────────────────────────────────────────────────────────
function DemoChat({ config }: { config: DemoConfig }) {
  const [messages, setMessages] = useState<DemoMsg[]>([
    { role: 'assistant', content: config.welcomeMessage },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const userMsg: DemoMsg = { role: 'user', content: text.trim() };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: config.businessName,
          businessType: config.businessType,
          systemPrompt: config.systemPrompt,
          userMessage: text.trim(),
          conversationHistory: history,
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((p) => [
        ...p,
        { role: 'assistant', content: data.reply ?? 'Sorry, something went wrong.' },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: 'assistant', content: 'Demo temporarily unavailable. Please try again!' },
      ]);
    } finally {
      setSending(false);
    }
  }

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md" style={{ height: 480 }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: config.color }}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
          {config.emoji}
        </span>
        <div>
          <p className="text-sm font-bold text-white">{config.businessName}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
            AI Assistant · Online now
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'rounded-br-sm text-white'
                  : 'rounded-bl-sm border border-slate-100 bg-white text-slate-700 shadow-sm'
              }`}
              style={m.role === 'user' ? { background: config.color } : {}}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-2.5">
          {config.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
        className="flex gap-2 border-t border-slate-100 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition disabled:opacity-40"
          style={{ background: config.color }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5.25L12 18.75" /><path d="M18.75 12L12 5.25L5.25 12" />
          </svg>
        </button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const [activeId, setActiveId] = useState('car-rental');
  const activeDemo = DEMOS.find((d) => d.id === activeId) ?? DEMOS[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-slate-900">🤖 BizAI</Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-14 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Live Demo · No Signup Required</p>
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Try BizAI Live</h1>
        <p className="mt-4 text-lg text-slate-500">
          Chat with our AI assistant configured for different local businesses.<br />
          This is powered by real AI — just like yours would be.
        </p>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex justify-center gap-3">
          {DEMOS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeId === d.id
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="mx-auto mt-6 max-w-xl px-4 pb-6">
        <DemoChat key={activeId} config={activeDemo} />
      </div>

      {/* Footer note + CTA */}
      <div className="mx-auto max-w-xl px-4 pb-16 text-center">
        <p className="text-sm text-slate-400">
          This is a live demo powered by real AI. Your BizAI will be trained specifically on{' '}
          <span className="font-semibold text-slate-600">YOUR</span> business.
        </p>
        <Link
          href="/#pricing"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Get Your Own AI Assistant →
        </Link>
      </div>
    </div>
  );
}
