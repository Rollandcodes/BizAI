'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ChatMessage = { role: 'user' | 'assistant'; content: string; timestamp?: string }
type Niche = 'medical_tourism' | 'real_estate_residency'

const NICHES: { id: Niche; label: string; icon: string; welcome: string; businessName: string }[] = [
  { id: 'medical_tourism', label: 'Medical Tourism', icon: '🏥', welcome: 'Welcome to our clinic. I can help with IVF, dental, aesthetics, and consultation triage.', businessName: 'CypAI Demo - Medical Tourism' },
  { id: 'real_estate_residency', label: 'Real Estate & Residency', icon: '🏢', welcome: 'Welcome to our property desk. I can help with investor qualification and residency-led leads.', businessName: 'CypAI Demo - Real Estate & Residency' },
]

const STARTER_QUESTIONS = ['What treatment do you offer?', 'What is your budget range?', 'Can I book a consultation?', 'Do you speak German?']

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default function DemoPage() {
  const [niche, setNiche] = useState<Niche>('medical_tourism')
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: NICHES[0].welcome, timestamp: getTimestamp() }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const currentNiche = NICHES.find((item) => item.id === niche)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function changeNiche(next: Niche) {
    setNiche(next)
    const selected = NICHES.find((item) => item.id === next)
    setMessages([{ role: 'assistant', content: selected?.welcome || 'How can I help you?', timestamp: getTimestamp() }])
    setInput('')
  }

  async function sendMessage(raw: string) {
    const message = raw.trim()
    if (!message || loading) return

    const updated = [...messages, { role: 'user', content: message, timestamp: getTimestamp() } as ChatMessage]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, businessId: 'demo', niche }),
      })
      const data = (await res.json()) as { message?: string }
      setMessages([...updated, { role: 'assistant', content: data.message || 'How else can I help you?', timestamp: getTimestamp() }])
    } catch {
      setMessages(updated)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold text-white">CypAI</Link>
          <Link href="/" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">Back to Home</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">Live Demo</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">See exactly what your customers experience</h1>
          <p className="mt-3 text-zinc-400">Watch CypAI handle medical and residency enquiries in real-time</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-1 border-b border-zinc-800">
          {NICHES.map((item) => (
            <button
              key={item.id}
              onClick={() => changeNiche(item.id)}
              className={`px-4 py-3 text-sm font-medium transition ${niche === item.id ? 'border-b-2 border-[#e8a020] text-[#e8a020]' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">{currentNiche?.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-white">{currentNiche?.businessName}</p>
              <p className="flex items-center gap-1 text-xs text-white/80"><span className="h-2 w-2 rounded-full bg-green-400" />Online</p>
            </div>
          </div>

          <div className="h-[420px] space-y-3 overflow-y-auto bg-[#efeae2] p-4">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'rounded-br-sm rounded-bl-lg rounded-tr-lg bg-[#25D366] text-white' : 'rounded-bl-sm rounded-br-lg rounded-tl-lg bg-white text-gray-900'}`}>
                  <p>{msg.content}</p>
                  {msg.timestamp ? <p className={`mt-1 text-[10px] ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.timestamp}</p> : null}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((question) => (
                <button key={question} onClick={() => sendMessage(question)} disabled={loading} className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-900 disabled:opacity-50">{question}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#e8a020]" />
              <button type="submit" disabled={loading || !input.trim()} className="rounded-lg bg-[#e8a020] px-4 py-2 text-sm font-semibold text-[#1a1a2e] hover:bg-[#d4920a] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Sending...' : 'Send'}</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}