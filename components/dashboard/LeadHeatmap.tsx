'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, Search } from 'lucide-react'

const MOCK_LEADS = [
  { name: 'Ahmet T.', location: 'Lefke', score: 92, heat: 'hot', time: '2m ago' },
  { name: 'Sarah J.', location: 'Girne', score: 45, heat: 'warm', time: '15m ago' },
  { name: 'Omar K.', location: 'Mağusa', score: 18, heat: 'cold', time: '1h ago' },
  { name: 'Elena R.', location: 'Lefkoşa', score: 88, heat: 'hot', time: '3h ago' },
]

export default function LeadHeatmap() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold">Lead <span className="text-electric-lime">Heat-Sync</span></h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-electric-lime animate-pulse" />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', val: '1,284', icon: Users, trend: '+12%' },
          { label: 'Avg Score', val: '74/100', icon: Zap, trend: '+5%' },
          { label: 'Conversion', val: '18.2%', icon: TrendingUp, trend: '+2%' },
          { label: 'Hot Leads', val: '42', icon: Search, trend: '+8' },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-white/40 group-hover:text-electric-lime transition-colors" />
              <span className="text-[10px] text-electric-lime font-mono">{stat.trend}</span>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-white">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="glass overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Recent Activity Stream</span>
          <button className="text-[10px] text-electric-lime hover:underline font-mono uppercase tracking-widest">View All</button>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_LEADS.map((lead, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  lead.heat === 'hot' ? 'bg-electric-lime glow-lime' : 
                  lead.heat === 'warm' ? 'bg-[#4af7ff]' : 'bg-white/20'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-electric-lime transition-colors">{lead.name}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-tighter">{lead.location} • {lead.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-white">{lead.score}</p>
                <p className="text-[8px] text-white/20 uppercase font-mono tracking-widest">Neural Score</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
