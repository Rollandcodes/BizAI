'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  User, 
  Bot, 
  Sparkles, 
  Send, 
  Headphones,
  Info,
  History,
  AlertTriangle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const mockConversations = [
  { id: 1, user: 'Maria Georgiou', lastMsg: 'I want to book for tomorrow.', time: '2m ago', unread: true, status: 'Active (AI)', language: 'English' },
  { id: 2, user: 'Ahmed Al-Saud', lastMsg: 'هل يتوفر لديكم حجز؟', time: '15m ago', unread: false, status: 'Active (AI)', language: 'Arabic' },
  { id: 3, user: 'Caner Demir', lastMsg: 'When is the check-out time?', time: '1h ago', unread: false, status: 'Resolved', language: 'Turkish' },
]

export default function ConversationsPage() {
  const [selected, setSelected] = useState(1)

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 relative z-10">
      {/* 1. Sidebar: Chat List */}
      <div className="w-80 flex flex-col gap-4 overflow-hidden">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search chats..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
          {mockConversations.map((chat) => (
            <motion.div
              key={chat.id}
              onClick={() => setSelected(chat.id)}
              className={cn(
                'p-4 rounded-xl border border-white/5 cursor-pointer transition-all relative overflow-hidden group',
                selected === chat.id 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'hover:bg-white/5'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <User size={14} />
                  </div>
                  <p className="font-bold text-sm tracking-tight">{chat.user}</p>
                </div>
                <span className="text-[10px] text-white/30 font-bold uppercase">{chat.time}</span>
              </div>
              <p className="text-xs text-white/40 line-clamp-1 italic mb-2">"{chat.lastMsg}"</p>
              <div className="flex justify-between items-center">
                <Badge variant={chat.status.includes('Active') ? 'success' : 'outline'} className="text-[9px] py-0">
                  {chat.status}
                </Badge>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{chat.language}</span>
              </div>
              
              {chat.unread && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(184,255,71,1)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Center: Chat Content */}
      <Card className="flex-1 flex flex-col overflow-hidden border-white/10 bg-white/[0.01]">
        {/* Chat Header */}
        <div className="px-6 py-4 glass border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Sparkles className="text-primary w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-base tracking-tight">Maria Georgiou</p>
              <p className="text-xs text-white/40">Injected Perspective: <span className="text-primary font-bold">Booking Flow</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 border-white/10 text-xs">
              Take Control
            </Button>
            <Button variant="primary" size="sm" className="h-8 text-xs font-bold uppercase tracking-widest">
              Force Resolve
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-repeat bg-center opacity-40" style={{ backgroundImage: "url('/noise.png')" }}>
          <div className="flex justify-start">
            <div className="max-w-[70%] p-4 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20 text-sm leading-relaxed">
              Hello Maria! Welcome to Limassol Suites. I am your AI concierge. How can I assist you today? 🇨🇾
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] p-4 rounded-2xl rounded-tr-none bg-white/5 border border-white/10 text-sm leading-relaxed">
              I want to book for tomorrow. Do you have any availability?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[70%] p-4 rounded-2xl rounded-tl-none bg-primary/10 border border-primary/20 text-sm leading-relaxed">
              Let me check our neural booking system... Yes! We have 2 suites left at our Seafront property. Would you like to proceed with the reservation?
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 glass border-t border-white/5">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Inject command or suggest a response..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-24 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button size="icon" variant="ghost" className="rounded-xl w-10 h-10 border-white/5">
                <Headphones size={18} className="text-white/40" />
              </Button>
              <Button size="icon" variant="primary" className="rounded-xl w-10 h-10 shadow-[0_0_20px_rgba(184,255,71,0.2)]">
                <Send size={18} />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-white/20 mt-3 text-center uppercase tracking-[0.3em] font-bold">
            Controlled by Neural Brain Unit #821
          </p>
        </div>
      </Card>

      {/* 3. Right: Context / Agent Control */}
      <div className="w-80 space-y-6 overflow-y-auto pr-2">
        <Card className="p-6 border-white/5 bg-white/[0.02]">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info size={12} className="text-secondary" /> Customer Intelligence
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Sentiment</span>
              <span className="text-primary font-bold">Positive (High)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Language</span>
              <span className="text-white">English (Native)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Lifetime Value</span>
              <span className="text-secondary font-display font-bold">€1,240</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-white/5 bg-white/[0.02]">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <History size={12} className="text-primary" /> Live Transcription
          </h4>
          <div className="space-y-3 opacity-60">
            <div className="text-[10px] border-l-2 border-primary pl-2 py-1">
              <p className="text-white/40 mb-1">AI Agent - 13:42</p>
              <p className="text-white">Querying Availability [Limassol_Suites_DB]</p>
            </div>
            <div className="text-[10px] border-l-2 border-secondary pl-2 py-1">
              <p className="text-white/40 mb-1">System - 13:42</p>
              <p className="text-white">2 Slots found. Updating UI context.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-500/10 bg-red-500/[0.02] border-dashed">
          <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={12} /> Critical Overrides
          </h4>
          <Button variant="danger" className="w-full text-[10px] h-8 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 mb-2 font-bold uppercase tracking-widest">
            Bann User
          </Button>
          <Button variant="ghost" className="w-full text-[10px] h-8 border-white/5 text-white/40 hover:text-white font-bold uppercase tracking-widest">
            Pause AI Brain
          </Button>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
