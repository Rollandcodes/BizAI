'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  MessageSquare, 
  BrainCircuit, 
  Radio, 
  Zap, 
  Settings,
  ChevronRight
} from 'lucide-react'

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Conversations', icon: MessageSquare, href: '/conversations' },
  { name: 'Intelligence', icon: BrainCircuit, href: '/agent' },
  { name: 'Channels', icon: Radio, href: '/channels' },
  { name: 'Neural Connect', icon: Zap, href: '/integrations' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 glass border-r border-white/5 flex flex-col h-full bg-[#050510]/60 backdrop-blur-2xl relative z-50">
      {/* Brand */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-electric-lime rounded-lg glow-lime flex items-center justify-center">
            <div className="w-2 h-2 bg-space-black rounded-full animate-ping" />
          </div>
          <span className="font-display text-xl font-bold tracking-tighter text-white">CypAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-electric-lime/10 text-electric-lime' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 rounded-full bg-electric-lime glow-lime" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Agent Health Bridge */}
      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Agent Status</span>
            <span className="flex h-2 w-2 rounded-full bg-electric-lime glow-lime" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-white/60">
              <span>Neural Accuracy</span>
              <span className="text-electric-lime">98.4%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-electric-lime h-full w-[98.4%]" />
            </div>
          </div>
          <p className="text-[10px] text-white/30 italic">Lefke DC v1.02.4</p>
        </div>
      </div>
    </aside>
  )
}
