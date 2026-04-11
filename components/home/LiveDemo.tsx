'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Send, User, Bot, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const demoMessages = [
  { role: 'user', content: 'Do you have any available rooms for tomorrow in Limassol?' },
  { role: 'bot', content: 'Yes! We have 3 Deluxe Suites available at City of Dreams. Would you like to see the rates in English or Arabic?' },
  { role: 'user', content: 'Arabic please.' },
  { role: 'bot', content: 'بالتأكيد! الأجنحة الفاخرة متوفرة بسعر ١٥٠ يورو لليلة الواحدة. هل ترغب في إتمام الحجز؟' },
  { role: 'user', content: 'Yes, book it.' },
  { role: 'bot', content: 'Perfect! Booking confirmed for City of Dreams, Limassol. I’ve sent the confirmation to your email. 🌴' },
]

export default function LiveDemo() {
  const [messages, setMessages] = useState<typeof demoMessages>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (currentIndex < demoMessages.length) {
      const delay = currentIndex === 0 ? 1000 : 2000
      const timer = setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, demoMessages[currentIndex]])
          setIsTyping(false)
          setCurrentIndex(prev => prev + 1)
        }, 1500)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      // Loop after finish
      const resetTimer = setTimeout(() => {
        setMessages([])
        setCurrentIndex(0)
      }, 5000)
      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex])

  return (
    <section id="demo" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase">
            Live Experience
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight">
            See your agent <br />
            <span className="text-secondary text-glow-blue">in action.</span>
          </h2>
          <p className="text-xl text-white/50 leading-relaxed">
            Watch how our neural network handles complex, multilingual inquiries with instant accuracy. This isn't just a chatbot—it's your best employee.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <p className="text-3xl font-bold font-display text-primary">0.8s</p>
              <p className="text-sm text-white/40">Avg. Response Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold font-display text-secondary">98%</p>
              <p className="text-sm text-white/40">Resolution Rate</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Chat Mockup */}
          <Card className="h-[500px] flex flex-col overflow-hidden border-white/10 shadow-2xl relative z-10">
            <div className="px-6 py-4 glass border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">CypAI Concierge</p>
                  <p className="text-[10px] text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Online & Calibrated
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide bg-white/[0.01]">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-white/10 text-white rounded-tr-none' 
                        : 'bg-primary/10 border border-primary/20 text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-primary/5 border border-primary/10 px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-300" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 glass border-t border-white/5 flex gap-2">
              <div className="flex-1 h-10 bg-white/5 rounded-full border border-white/10 px-4 flex items-center">
                <span className="text-white/20 text-sm italic">Simulated typing...</span>
              </div>
              <Button size="icon" variant="primary" className="rounded-full w-10 h-10">
                <Send size={16} />
              </Button>
            </div>
          </Card>

          {/* Decorative background glow */}
          <div className="absolute -inset-4 bg-primary/20 blur-[60px] rounded-[40px] opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>
    </section>
  )
}
