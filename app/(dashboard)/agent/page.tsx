'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cpu, 
  Upload, 
  Link as LinkIcon, 
  FileText, 
  Zap, 
  Sparkles,
  Save,
  Trash2,
  BrainCircuit,
  MessageCircle,
  Settings2,
  Send
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function AgentTrainingPage() {
  const [activeTab, setActiveTab] = useState('knowledge')

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tightest">Neural Agent Calibration</h1>
          <p className="text-white/40 text-sm">Tune your AI brain and training data in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white/60 border-white/5">Discard Draft</Button>
          <Button variant="primary" className="h-10 px-6 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(184,255,71,0.2)]">
            <Save className="w-4 h-4 mr-2" /> Deploy Changes
          </Button>
        </div>
      </div>

      <div className="flex gap-2 p-1 glass border-white/5 rounded-full w-fit">
        {[
          { id: 'knowledge', label: 'Knowledge Base', icon: BrainCircuit },
          { id: 'personality', label: 'Personality', icon: Sparkles },
          { id: 'config', label: 'Settings', icon: Settings2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all',
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(184,255,71,0.3)]' 
                : 'text-white/40 hover:text-white'
            )}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'knowledge' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <Card className="border-primary/20 bg-primary/[0.02] border-dashed">
                <CardContent className="p-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl glass-lime flex items-center justify-center border-primary/20 mb-6">
                    <Upload className="text-primary w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2">Feed your Neural Network</h3>
                  <p className="text-sm text-white/50 max-w-sm mb-8">
                    Drag and drop your company documents (PDF, DOCX, CSV) or sync your website URL.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="primary" className="h-12 px-8">Upload Files</Button>
                    <Button variant="glass" className="h-12 px-8">Sync URL</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] px-2">Current Sources</h4>
                {[
                  { name: 'Hotel_Terms_2026.pdf', size: '2.4 MB', type: 'PDF' },
                  { name: 'https://cityofdreams.com/faq', size: 'Live Sync', type: 'URL' },
                  { name: 'Product_Catalog_V2.csv', size: '1.2 MB', type: 'CSV' },
                ].map((source, i) => (
                  <Card key={i} className="p-4 border-white/5 bg-white/[0.01] flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg glass border-white/10 flex items-center justify-center text-white/40">
                        {source.type === 'URL' ? <LinkIcon size={18} /> : <FileText size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{source.name}</p>
                        <p className="text-[10px] text-white/30 uppercase font-bold">{source.size} • Last synced 2h ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'personality' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <Card className="border-white/5 bg-white/[0.01]">
                <CardHeader><CardTitle>AI Persona Settings</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <Input label="Agent Name" placeholder="e.g. Concierge AI" defaultValue="CypAI Concierge" />
                  <div className="space-y-2">
                    <label htmlFor="system-instructions" className="text-sm font-medium text-white/70 ml-1">System Instructions</label>
                    <textarea 
                      id="system-instructions"
                      aria-label="System Instructions"
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none font-medium leading-relaxed"
                      defaultValue="You are the lead concierge for Limassol Suites. You are helpful, professional, and speak English, Arabic, and Turkish fluently. Focus on conversion and booking support."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="temperature" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Temperature (Creativity)</label>
                      <input id="temperature" type="range" aria-label="Temperature (Creativity)" className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="tone" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tone (Professional vs Casual)</label>
                      <input id="tone" type="range" aria-label="Tone (Professional vs Casual)" className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Real-time Preview Sidebar */}
        <div className="space-y-6">
          <Card className="p-0 border-white/5 bg-white/[0.02] overflow-hidden sticky top-24">
            <div className="p-4 glass border-b border-white/5">
              <h4 className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <MessageCircle size={14} className="text-primary" /> Live Test
              </h4>
            </div>
            <div className="h-[400px] flex flex-col p-4 bg-repeat bg-center opacity-30 invert" style={{ backgroundImage: "url('/noise.png')" }}>
              <div className="mt-auto space-y-3">
                <div className="bg-primary/20 border border-primary/30 p-3 rounded-2xl rounded-tl-none text-[11px] text-white">
                  Calibration complete. I am ready to handle your hotel inquiries.
                </div>
              </div>
            </div>
            <div className="p-3 glass border-t border-white/5 flex gap-2">
              <input 
                placeholder="Talk to your agent..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs outline-none"
              />
              <Button size="icon" variant="primary" className="w-8 h-8 rounded-full"><Send size={12} /></Button>
            </div>
          </Card>
          
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
            <div className="animate-pulse w-2 h-2 rounded-full bg-primary" />
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Neural Cluster Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

