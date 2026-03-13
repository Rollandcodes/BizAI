'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type DemoMsg = { role: 'user' | 'assistant'; content: string };

type NicheConfig = {
  id: string;
  name: string;
  icon: string;
  label: string;
  color: string;
  welcome: string;
  suggestions: string[];
};

const NICHES: Record<string, NicheConfig> = {
  car_rental: {
    id: 'car_rental',
    name: 'DriveEasy Car Rentals',
    icon: '🚗',
    label: 'Car Rental',
    color: 'blue',
    welcome: 'Hi! 👋 Welcome to DriveEasy Car Rentals. I can help with availability, prices, and bookings. What would you like to know?',
    suggestions: [
      'What cars do you have?',
      'How much for 3 days?',
      'Do you deliver to the airport?',
      'I need a car this weekend',
    ],
  },
  barbershop: {
    id: 'barbershop',
    name: 'Studio One Barbershop',
    icon: '💈',
    label: 'Barbershop',
    color: 'purple',
    welcome: 'Hey! 👋 Welcome to Studio One Barbershop. I can help you book an appointment or answer questions about our services.',
    suggestions: [
      'What are your opening hours?',
      'How much is a haircut?',
      'Can I book for tomorrow?',
      'Do you do beard trims?',
    ],
  },
  student_accommodation: {
    id: 'student_accommodation',
    name: 'CampusHome Accommodation',
    icon: '🏠',
    label: 'Accommodation',
    color: 'green',
    welcome: 'Hi there! 👋 Welcome to CampusHome. I can help you find the perfect room near your university in Northern Cyprus.',
    suggestions: [
      'How much is a single room?',
      'Are you near EMU?',
      'Is WiFi included?',
      'When can I move in?',
    ],
  },
};

const COLOR_STYLES: Record<string, { bubble: string; accent: string; ring: string }> = {
  blue: {
    bubble: 'bg-blue-600',
    accent: 'bg-blue-600',
    ring: 'focus:border-blue-400 focus:ring-blue-400/10',
  },
  purple: {
    bubble: 'bg-violet-600',
    accent: 'bg-violet-600',
    ring: 'focus:border-violet-400 focus:ring-violet-400/10',
  },
  green: {
    bubble: 'bg-emerald-600',
    accent: 'bg-emerald-600',
    ring: 'focus:border-emerald-400 focus:ring-emerald-400/10',
  },
};

function DemoChat() {
  const [activeNiche, setActiveNiche] = useState<keyof typeof NICHES>('car_rental');
  const [messages, setMessages] = useState<DemoMsg[]>([
    { role: 'assistant', content: NICHES.car_rental.welcome },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConfig = NICHES[activeNiche];
  const colorStyles = COLOR_STYLES[activeConfig.color];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function switchNiche(nicheId: string) {
    const nextNiche = nicheId as keyof typeof NICHES;
    setActiveNiche(nextNiche);
    setMessages([{ role: 'assistant', content: NICHES[nextNiche].welcome }]);
    setError('');
    setInput('');
  }

  async function sendMessage(userMessage: string) {
    if (!userMessage.trim() || isLoading) return;

    const newMessages: DemoMsg[] = [
      ...messages,
      { role: 'user', content: userMessage.trim() },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          businessType: activeNiche,
          businessId: null,
          sessionId: `demo-${Date.now()}`,
          businessName: NICHES[activeNiche].name,
          isDemo: true,
        }),
      });

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { message?: string };

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.message || 'I can help you with that!',
        },
      ]);
    } catch (err) {
      console.error('Demo chat error:', err);
      const message = err instanceof Error ? err.message : 'Sorry, something went wrong';
      setError(message);
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md" style={{ height: 480 }}>
      <div className={`flex items-center gap-3 px-5 py-4 ${colorStyles.accent}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
          {activeConfig.icon}
        </span>
        <div>
          <p className="text-sm font-bold text-white">{activeConfig.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-300" />
            AI Assistant · Online now
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {error && (
          <div className="my-2 flex justify-center">
            <div className="max-w-[80%] rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600">
              ⚠️ {error === 'Failed to fetch'
                ? 'Connection error — check your internet'
                : error.includes('API')
                  ? 'AI service temporarily unavailable'
                  : error}
              <button
                type="button"
                onClick={() => setError('')}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={m.role === 'user'
                ? `max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white ${colorStyles.bubble}`
                : 'max-w-[80%] rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm'}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 items-end">
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs text-white ${colorStyles.accent}`}>
              🤖
            </div>
            <div className="rounded-2xl rounded-bl-none border border-gray-200 bg-white px-4 py-3">
              <div className="flex h-4 items-center gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showSuggestions && (
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-2.5">
          {activeConfig.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void sendMessage(s)}
              disabled={isLoading}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="flex gap-2 border-t border-slate-100 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage(input);
            }
          }}
          placeholder="Type a message..."
          disabled={isLoading}
          className={`flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${colorStyles.ring} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition disabled:opacity-40 ${colorStyles.accent}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5.25L12 18.75" /><path d="M18.75 12L12 5.25L5.25 12" />
          </svg>
        </button>
      </form>

      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <div className="flex justify-center gap-3">
          {Object.values(NICHES).map((niche) => (
            <button
              key={niche.id}
              type="button"
              onClick={() => switchNiche(niche.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeNiche === niche.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {niche.icon} {niche.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-slate-900">🤖 CypAI</Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 pb-6 pt-14 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">Live Demo · No Signup Required</p>
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Try CypAI Live</h1>
        <p className="mt-4 text-lg text-slate-500">
          Chat with our AI assistant configured for different local businesses.<br />
          This is powered by real AI — just like yours would be.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-xl px-4 pb-6">
        <DemoChat />
      </div>

      <div className="mx-auto max-w-xl px-4 pb-16 text-center">
        <p className="text-sm text-slate-400">
          This is a live demo powered by real AI. Your CypAI will be trained specifically on{' '}
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
