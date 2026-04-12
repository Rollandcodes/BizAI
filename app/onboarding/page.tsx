"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AGENT_PACKS, NicheType } from "@/lib/agentPacks";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    businessName: "",
    niche: "Real Estate" as NicheType,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Your session expired. Please sign in again.");
      router.replace("/sign-in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to finalize registration");
      }

      // Forces a token refresh and refreshes the `User` object so our metadata updates are pulled
      await user?.reload();
      
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finish onboarding");
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white/60">
        Loading your session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-blue/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-electric-lime/5 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full px-2 py-1">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-electric-lime rounded-xl glow-lime flex items-center justify-center">
              <div className="w-2 h-2 bg-space-black rounded-full" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tighter text-white">CypAI</span>
          </div>
          <h2 className="text-2xl font-display font-medium text-white/90">Almost there!</h2>
          <p className="text-white/40 text-sm mt-2">Initialize your Business Neural Agent</p>
        </div>

        <div className="glass p-1 border-white/10">
          <div className="bg-[#050510]/80 p-8 md:p-12 rounded-[14px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="business-name" className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Business Name</label>
                  <input 
                    id="business-name"
                    type="text" 
                    placeholder="e.g. Girne Estates"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="industry-niche" className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Industry Niche</label>
                  <select 
                    id="industry-niche"
                    aria-label="Industry Niche"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value as NicheType })}
                  >
                    {Object.keys(AGENT_PACKS).map(n => (
                      <option key={n} value={n} className="text-black bg-white">{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-electric-lime/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-electric-lime" />
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-sans mt-0.5">
                  <span className="text-white font-bold">Automatic Pack:</span> Based on your niche, we'll pre-train your agent with localized market intelligence.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center font-mono uppercase tracking-tight">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 text-sm group flex items-center justify-center gap-2"
              >
                {loading ? 'Deploying...' : 'Deploy Analytics'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

