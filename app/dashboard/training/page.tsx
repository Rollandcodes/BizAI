"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Save, RefreshCw, BookOpen, MessageSquare, Calendar, Settings, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/supabase";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export const metadata = {
  title: "AI Training | Dashboard",
};

export default function TrainingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (!email) {
        router.push("/login");
        return;
      }

      // Get business by email
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("email", email)
        .single();

      if (!businessData) {
        setLoading(false);
        return;
      }

      setBusiness(businessData as Business);
      setSystemPrompt(businessData.system_prompt || getDefaultPrompt(businessData.business_type));
      setLoading(false);
    }

    void fetchData();
  }, [router]);

  function getDefaultPrompt(businessType?: string | null) {
    const defaultPrompts: Record<string, string> = {
      car_rental: "You are a helpful car rental assistant. Help customers find the right vehicle, check availability, and process bookings.",
      barbershop: "You are a friendly barbershop receptionist. Help customers book appointments, check available slots, and answer questions about services.",
      restaurant: "You are a welcoming restaurant host. Help customers with reservations, menu questions, and special requests.",
      clinic: "You are a professional medical clinic receptionist. Handle appointment bookings, answer health-related questions, and provide office information.",
      hotel: "You are a helpful hotel concierge. Assist with bookings, room information, and local recommendations.",
      default: "You are a helpful AI assistant for this business. Answer customer questions professionally and help them with their needs."
    };
    
    if (!businessType) return defaultPrompts.default;
    return defaultPrompts[businessType] || defaultPrompts.default;
  }

  async function handleSave() {
    if (!business) return;

    setSaving(true);
    const { error } = await supabase
      .from("businesses")
      .update({ system_prompt: systemPrompt })
      .eq("id", business.id);

    setSaving(false);
    
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e8a020] border-t-transparent" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <p className="text-slate-500">No business found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Training</h1>
        <p className="text-slate-500">Configure how your AI assistant responds to customers</p>
      </div>

      {/* System Prompt */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Persona & Instructions</h2>
              <p className="text-sm text-slate-500">Define how your AI assistant behaves</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#e8a020] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d09010] disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700">
            System Prompt
          </label>
          <p className="mt-1 text-xs text-slate-500">
            This instruction defines your AI's personality, knowledge, and behavior
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#e8a020] focus:outline-none focus:ring-2 focus:ring-[#e8a020]/10"
            placeholder="You are a helpful AI assistant..."
          />
        </div>
      </div>

      {/* Training Tips */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Training Tips</h2>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">Be Specific</p>
              <p className="text-xs text-slate-500">Define exact services, pricing, and processes</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">Include Business Hours</p>
              <p className="text-xs text-slate-500">Add your schedule so AI can check availability</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <Settings className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-900">Add Common Questions</p>
              <p className="text-xs text-slate-500">Include FAQs in Settings for better responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Supported Languages</h2>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["English", "Turkish", "Arabic", "Russian", "Greek", "German"].map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {lang}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700">
            The AI automatically detects and responds in the customer's language
          </p>
        </div>
      </div>
    </div>
  );
}
