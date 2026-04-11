'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AGENT_PACKS, NicheType } from '@/lib/agentPacks'

export default function LiveLabDemo() {
  const [activeNiche, setActiveNiche] = useState<NicheType>('Car Rental')
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([])
  
  const pack = AGENT_PACKS[activeNiche]

  useEffect(() => {
    setMessages([{ role: 'ai', text: pack.welcome_message }])
    
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20">
      <div className="lg:col-span-5 space-y-6">
        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
          Experience the <span className="text-electric-lime text-glow-lime">Intelligence</span>
        </h2>
        <p className="text-lg text-white/60 font-sans">
          Our Live Lab lets you test-drive agents trained specifically for Northern Cyprus market dynamics.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AGENT_PACKS) as NicheType[]).map((niche) => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeNiche === niche 
                ? 'bg-electric-lime text-space-black glow-lime' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
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
                    ? 'bg-white/10 text-white rounded-tl-none' 
                    : 'bg-electric-lime text-space-black rounded-tr-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Chat Input Placeholder */}
          <div className="p-6 pt-0">
            <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white/30 text-sm flex justify-between items-center italic">
              Try chatting with the {activeNiche} agent...
              <div className="w-5 h-5 rounded-full bg-electric-lime/20 border border-electric-lime/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
