'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type Niche = 'car_rental' | 'barbershop' | 'hotel' | 'restaurant'

const NICHES: { id: Niche; label: string; icon: string; welcome: string }[] = [
  {
    id: 'car_rental',
    label: 'Car Rental',
    icon: '🚗',
    welcome: 'Welcome to our car rental desk. I can help with prices, availability, and booking details.',
  },
  {
    id: 'barbershop',
    label: 'Barbershop',
    icon: '✂️',
    welcome: 'Welcome to our barbershop. Ask about services, opening times, and booking slots.',
  },
  {
    id: 'hotel',
    label: 'Hotel',
    icon: '🏨',
    welcome: 'Welcome to our hotel. I can help with room options, rates, and reservations.',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: '🍽️',
    welcome: 'Welcome to our restaurant. Ask about menu options, opening hours, and reservations.',
  },
]

const STARTER_QUESTIONS = [
  'What are your prices?',
  'Are you open now?',
  'I want to make a booking',
  'Do you speak Arabic?',
]

export default function DemoPage() {
  const [niche, setNiche] = useState<Niche>('car_rental')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: NICHES[0].welcome },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [degradedMode, setDegradedMode] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function changeNiche(next: Niche) {
    setNiche(next)
    const selected = NICHES.find((item) => item.id === next)
    setMessages([{ role: 'assistant', content: selected?.welcome || 'How can I help you?' }])
    setInput('')
    setError('')
    setDegradedMode(false)
  }

  async function sendMessage(raw: string) {
    const message = raw.trim()
    if (!message || loading) return

    const previousMessages = [...messages]
    const updated = [...previousMessages, { role: 'user', content: message } as ChatMessage]

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
      setMessages([
        ...updated,
        { role: 'assistant', content: data.message || 'How else can I help you?' },
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
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Live Demo</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Try the AI Demo</h1>
          <p className="mt-4 text-zinc-400">Pick a niche and chat with the same API flow used by your production widget.</p>
        </div>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {NICHES.map((item) => (
            <button
              key={item.id}
              onClick={() => changeNiche(item.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                niche === item.id
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
          <div className="border-b border-zinc-800 bg-zinc-900/80 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-200">CypAI Assistant</p>
            <p className="text-xs text-zinc-500">Live demo for {NICHES.find((item) => item.id === niche)?.label}</p>
          </div>

          {degradedMode ? (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700" data-testid="demo-degraded-badge">
              Fallback mode active: AI provider issue detected.
            </div>
          ) : null}

          <div className="h-[420px] space-y-3 overflow-y-auto bg-zinc-950 p-4">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-blue-600 text-white'
                      : 'rounded-bl-sm border border-zinc-800 bg-zinc-900 text-zinc-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-zinc-800 bg-zinc-900 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => void sendMessage(chip)}
                  disabled={loading}
                  className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-blue-500/40 hover:text-blue-300 disabled:opacity-40"
                >
                  {chip}
                </button>
              ))}
            </div>

            {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}

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
                placeholder="Type your question..."
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
