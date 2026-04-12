'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AGENT_PACKS, NicheType } from '@/lib/agentPacks'

export default function LiveLabDemo() {
  const [activeNiche, setActiveNiche] = useState<NicheType>('Car Rental')
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([])
  const [input, setInput] = useState('')
  const [replying, setReplying] = useState(false)
  const [error, setError] = useState('')
  
  const pack = AGENT_PACKS[activeNiche]

  // Map NicheType to API niche values
  const nicheToApiKey: Record<NicheType, string> = {
    'Real Estate': 'real_estate',
    'Car Rental': 'car_rental',
    'Clinics': 'clinic',
    'Hotels': 'hotel',
    'Apartments': 'student_accommodation',
    'Universities': 'student_accommodation',
    'Small Shops': 'small_shop',
    'Plumbers': 'plumber',
    'Contractors': 'contractor',
    'Startups': 'startup',
  }

  useEffect(() => {
    setMessages([{ role: 'ai', text: pack.welcome_message }])
    setInput('')
    setReplying(false)
    setError('')
    
    // Auto-reply simulation for demo effect with real API
    const timer = setTimeout(async () => {
      if (activeNiche === 'Car Rental') {
        const demoMessage = 'I need a car for tomorrow at Ercan Airport.'
        setMessages(prev => [...prev, { role: 'user', text: demoMessage }])
        
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: demoMessage,
              niche: nicheToApiKey[activeNiche],
              businessId: 'demo',
              businessName: pack.name,
            }),
          })

          if (res.ok) {
            const data = await res.json() as { message?: string }
            setMessages(prev => [...prev, { role: 'ai', text: data.message || 'How can I help you?' }])
          }
        } catch (err) {
          console.error('Demo API error:', err)
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [activeNiche, pack])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || replying) {
      return
    }

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setReplying(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          niche: nicheToApiKey[activeNiche],
          businessId: 'demo',
          businessName: pack.name,
        }),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json() as { message?: string; degraded?: boolean }
      const aiReply = data.message || 'I experienced a temporary issue. How can I help you?'
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }])
    } catch (err) {
      console.error('Chat error:', err)
      setError('AI temporarily unavailable. Please try again.')
      setMessages((prev) => prev.slice(0, -1)) // Remove the user message on error
    } finally {
      setReplying(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20">
      <div className="lg:col-span-5 space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
          Experience the <span className="text-electric-lime text-glow-lime">Intelligence</span>
        </h2>
        <p className="text-lg text-white/80 font-sans">
          Our Live Lab lets you test-drive agents trained specifically for Northern Cyprus market dynamics.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AGENT_PACKS) as NicheType[]).map((niche) => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeNiche === niche 
                ? 'bg-lime-400 text-black shadow-[0_0_16px_rgba(163,230,53,0.35)]' 
                : 'bg-white/10 text-white/85 hover:bg-white/15'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 relative">
        {/* Glow behind the chat */}
        <div className="absolute -inset-4 bg-gradient-to-r from-electric-lime/20 to-cyan-blue/20 blur-3xl opacity-50" />
        
        <div className="relative glass border-white/10 h-[500px] flex flex-col overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-electric-lime flex items-center justify-center text-space-black">
                <span className="font-bold">AI</span>
              </div>
              <div>
                <p className="font-display font-semibold text-white">{pack.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-electric-lime animate-pulse" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Live Simulation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'ai' 
                    ? 'bg-white/15 text-white rounded-tl-none' 
                    : 'bg-lime-400 text-black rounded-tr-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {replying ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Chat Input */}
          <div className="p-6 pt-0">
            <form onSubmit={handleSend} className="bg-white/10 border border-white/15 rounded-full px-2 py-2 text-sm flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type a message to the ${activeNiche} agent...`}
                className="flex-1 bg-transparent text-white placeholder:text-white/50 px-4 outline-none"
              />
              <button
                type="submit"
                aria-label="Send lab demo message"
                disabled={!input.trim() || replying}
                className="rounded-full px-4 py-2 text-xs font-semibold bg-lime-400 text-black hover:bg-lime-300 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
