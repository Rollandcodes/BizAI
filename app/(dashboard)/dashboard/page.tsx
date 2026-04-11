'use client'

import { motion } from 'framer-motion'
import LeadHeatmap from '@/components/dashboard/LeadHeatmap'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Activity, Globe, Send } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-10 relative z-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-display font-bold tracking-tighter">Command <span className="text-electric-lime">Center</span></h1>
            <Badge className="bg-electric-lime/10 text-electric-lime border-none text-[10px] uppercase font-mono py-0 px-2 h-5">v3.0.4</Badge>
          </div>
          <p className="text-white/40 text-sm font-sans flex items-center gap-2">
            <Globe className="w-3 h-3" /> Northern Cyprus Neural Ops • <span className="text-electric-lime">All Systems Nominal</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Agent Power</p>
              <p className="text-sm font-bold text-electric-lime">HIGH</p>
            </div>
            <div className="w-10 h-1 h-[24px] bg-white/5 rounded-full overflow-hidden flex gap-0.5 items-end px-1 pb-1">
              {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                <div key={i} className="flex-1 bg-electric-lime" style={{ height: `${h * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Intelligence Layer */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Real-time Heatmap Section */}
        <div className="lg:col-span-8 space-y-8">
          <LeadHeatmap />
          
          {/* Performance Flow Chart (Glass) */}
          <div className="glass p-8 border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-lg font-display font-bold text-white">Neural Throughput</h4>
                <p className="text-xs text-white/40 italic">24h volume analytics</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric-lime" /> WhatsApp
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-blue" /> Web Widget
                </div>
              </div>
            </div>
            
            <div className="h-40 flex items-end gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => {
                const h = 20 + Math.random() * 80
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-electric-lime/5 to-electric-lime/20 rounded-t-sm group relative"
                  >
                    <div className="absolute inset-0 bg-electric-lime opacity-0 group-hover:opacity-40 transition-opacity" />
                  </motion.div>
                )
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-mono text-white/20 uppercase">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        {/* Action sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass border-white/5 bg-white/[0.02] shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60 font-mono">
                <Sparkles className="w-4 h-4 text-electric-lime" /> Instant Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group">
                <p className="text-xs font-bold text-white group-hover:text-electric-lime transition-colors">Broadcast to Mağusa Leads</p>
                <p className="text-[10px] text-white/40">Reach 128 active prospects on WhatsApp</p>
              </button>
              <button className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group">
                <p className="text-xs font-bold text-white group-hover:text-electric-lime transition-colors">Train on Inventory Update</p>
                <p className="text-[10px] text-white/40">Sync latest property/car lists (PDF/Link)</p>
              </button>
              <button className="w-full py-4 px-6 rounded-2xl bg-electric-lime text-space-black font-bold text-sm flex items-center justify-between glow-lime">
                Deploy Web Widget
                <Send className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          <Card className="glass border-white/5 bg-white/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/60 font-mono">
                <Activity className="w-4 h-4 text-cyan-blue" /> System Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/40">Lefke Node (EUL)</span>
                  <span className="text-electric-lime">Active</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/40">Kyrenia Node</span>
                  <span className="text-electric-lime">Active</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/40">Nicosia Gateway</span>
                  <span className="text-cyan-blue">Optimizing</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-cyan-blue/10 border border-cyan-blue/20">
                <p className="text-[10px] text-cyan-blue font-bold uppercase tracking-widest mb-1">Network Advice</p>
                <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                  Traffic from Girne is peaking. Consider enabling "Aggressive Lead Capture" for the next 2 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
