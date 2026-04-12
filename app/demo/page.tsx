'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

type Niche = 'car_rental' | 'barbershop' | 'hotel' | 'restaurant' | 'clinic' | 'student_housing'

const NICHES: { id: Niche; label: string; icon: string; welcome: string; businessName: string }[] = [
  {
    id: 'car_rental',
    label: 'Car Rentals',
    icon: '🚗',
    welcome: 'Welcome to our car rental desk. I can help with prices, availability, and booking details.',
    businessName: 'CypAI Demo - Car Rentals',
  },
  {
    id: 'barbershop',
    label: 'Barbershops',
    icon: '✂️',
    welcome: 'Welcome to our barbershop. Ask about services, opening times, and booking slots.',
    businessName: 'CypAI Demo - Barbershop',
  },
  {
    id: 'hotel',
    label: 'Hotels',
    icon: '🏨',
    welcome: 'Welcome to our hotel. I can help with room options, rates, and reservations.',
    businessName: 'CypAI Demo - Hotel',
  },
  {
    id: 'restaurant',
    label: 'Restaurants',
    icon: '🍽️',
    welcome: 'Welcome to our restaurant. Ask about menu options, opening hours, and reservations.',
    businessName: 'CypAI Demo - Restaurant',
  },
  {
    id: 'clinic',
    label: 'Clinics',
    icon: '🏥',
    welcome: 'Welcome to our clinic. I can help with appointment booking, services, and opening hours.',
    businessName: 'CypAI Demo - Clinic',
  },
  {
    id: 'student_housing',
    label: 'Student Housing',
    icon: '🏠',
    welcome: 'Welcome to our student housing. Ask about availability, pricing, and applications.',
    businessName: 'CypAI Demo - Student Housing',
  },
]

const STARTER_QUESTIONS = [
  'What are your prices?',
  'Are you open now?',
  'I want to make a booking',
  'Do you speak Arabic?',
]

function getTimestamp(): string {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function DemoPage() {
  const [niche, setNiche] = useState<Niche>('car_rental')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: NICHES[0].welcome, timestamp: getTimestamp() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [degradedMode, setDegradedMode] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const currentNiche = NICHES.find((item) => item.id === niche)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function changeNiche(next: Niche) {
    setNiche(next)
    const selected = NICHES.find((item) => item.id === next)
    setMessages([{ 
      role: 'assistant', 
      content: selected?.welcome || 'How can I help you?',
      timestamp: getTimestamp(),
    }])
    setInput('')
    setError('')
    setDegradedMode(false)
  }

  async function sendMessage(raw: string) {
    const message = raw.trim()
    if (!message || loading) return

    const previousMessages = [...messages]
    const timestamp = getTimestamp()
    const updated = [...previousMessages, { role: 'user', content: message, timestamp } as ChatMessage]

    setMessages(updated)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, businessId: 'demo', niche }),
      })

      if (!res.ok) {
        throw new Error('CHAT_API_ERROR')
      }

      const data = (await res.json()) as { message?: string; degraded?: boolean }
      setDegradedMode(Boolean(data.degraded))
      
      const responseTimestamp = getTimestamp()
      setMessages([
        ...updated,
        { role: 'assistant', content: data.message || 'How else can I help you?', timestamp: responseTimestamp },
      ])
    } catch {
      setDegradedMode(false)
      setMessages(previousMessages)
      setError('Sorry, the AI is temporarily unavailable. WhatsApp us directly: +90 533 842 5559')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-white">🤖 CypAI</Link>
          <Link href="/" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">
            Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6">
        {/* Intro Section */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">Live Demo</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            See exactly what your customers experience
          </h1>
          <p className="mt-3 text-zinc-400">
            Watch CypAI handle enquiries in real-time
          </p>
        </div>

        {/* Industry Selector Tabs */}
        <div className="mb-6 flex flex-wrap justify-center gap-1 border-b border-zinc-800">
          {NICHES.map((item) => (
            <button
              key={item.id}
              onClick={() => changeNiche(item.id)}
              className={`px-4 py-3 text-sm font-medium transition ${
                niche === item.id
                  ? 'border-b-2 border-[#e8a020] text-[#e8a020]'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* WhatsApp-style Chat Window */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
          {/* WhatsApp Header */}
          <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
              {currentNiche?.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{currentNiche?.businessName}</p>
              <p className="flex items-center gap-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                Online
              </p>
            </div>
          </div>

          {degradedMode ? (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700" data-testid="demo-degraded-badge">
              Fallback mode active: AI provider issue detected.
            </div>
          ) : null}

          {/* Messages Area */}
          <div className="h-[420px] space-y-3 overflow-y-auto bg-[#efeae2] p-4">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-br-sm rounded-bl-lg rounded-tr-lg bg-[#25D366] text-white'
                      : 'rounded-bl-sm rounded-br-lg rounded-tl-lg bg-white text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.timestamp && (
                    <p className={`mt-1 text-[10px] ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-zinc-200 bg-white px-4 py-3">
            {/* Quick Reply Buttons - WhatsApp Style */}
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => void sendMessage(chip)}
                  disabled={loading}
                  className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#e8a020] hover:text-[#e8a020] disabled:opacity-40"
                >
                  {chip}
                </button>
              ))}
            </div>

            {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                void sendMessage(input)
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#e8a020] focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="rounded-full bg-[#25D366] p-2.5 text-white transition hover:bg-[#20bd5a] disabled:opacity-40"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* CTA Below Chat */}
        <div className="mt-10 text-center">
          <p className="mb-4 text-gray-400">
            This is the same AI your customers will talk to. Set up yours in 15 minutes.
          </p>
          <Link
            href="/#pricing"
            className="inline-block rounded-lg bg-[#e8a020] px-8 py-3 text-sm font-semibold text-[#1a1a2e] transition-all hover:-translate-y-0.5 hover:bg-[#d49020] hover:shadow-lg hover:shadow-[#e8a020]/25"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>
    </main>
  )
}

