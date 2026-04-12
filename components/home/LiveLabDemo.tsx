'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AGENT_PACKS, NicheType } from '@/lib/agentPacks'

export default function LiveLabDemo() {
  const [activeNiche, setActiveNiche] = useState<NicheType>('Car Rental')
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([])
  const [input, setInput] = useState('')
  const [replying, setReplying] = useState(false)
  
  const pack = AGENT_PACKS[activeNiche]

  const quickReplies: Record<NicheType, string> = {
    'Real Estate': 'Absolutely. I can share 3 matching listings and arrange a viewing this week.',
    'Restaurants': 'Yes. We can book your table now. How many guests and what time do you prefer?',
    'Hotels': 'We have availability for your dates. Would you like a city view or sea view room?',
    'Car Rental': 'Great choice. I can lock a car now and send booking confirmation to your WhatsApp.',
    'Clinics': 'We can schedule an appointment for you. Please share your preferred day and time.',
    'Barbershop': 'Perfect, we have a slot open tomorrow afternoon. Would you like to confirm it?',
    'Student Housing': 'Yes, we have rooms available near campus. I can send photos and pricing now.',
    'Contractors': 'We can schedule a site visit and quote. What service do you need first?',
    'Plumbers': 'Understood. We can dispatch a technician quickly. Please share your location.',
    'Small Shops': 'We can help automate replies and orders. Want to start with WhatsApp integration?',
    'Startups': 'Great fit. We can launch your support agent this week with custom workflows.',
    'Apartments': 'I can share available apartment units and arrange a viewing schedule.',
    'Universities': 'We can support admissions and FAQ automation. Would you like a quick demo flow?',
  }

  useEffect(() => {
    setMessages([{ role: 'ai', text: pack.welcome_message }])
    setInput('')
    setReplying(false)
    
    // Auto-reply simulation for demo effect
    const timer = setTimeout(() => {
      if (activeNiche === 'Car Rental') {
        setMessages(prev => [...prev, 
          { role: 'user', text: 'I need a car for tomorrow at Ercan Airport.' },
          { role: 'ai', text: 'Excellent! I can arrange that. We have a Ford Focus available for €35/day. Would you like to reserve it? I just need your WhatsApp number to send the booking link.' }
        ])
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [activeNiche, pack.welcome_message])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || replying) {
      return
    }

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setReplying(true)

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: quickReplies[activeNiche] }])
      setReplying(false)
    }, 800)
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
