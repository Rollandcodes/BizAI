"use client";
import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Business, Conversation, BookingRecord } from "@/lib/supabase";

export interface DashboardStats {
  totalConversations: number;
  leadsCaptured:      number;
  monthlyConversations: number;
  monthlyMessages:    number;
}

export interface DashboardData {
  business:       Business | null;
  agencyAccess:   boolean;
  stats:          DashboardStats | null;
  conversations:  Conversation[];
  leads:          Conversation[];
  whatsappEvents: unknown[];
}

export const STORAGE_KEY = "cypai-dashboard-email";

export function useDashboard() {
  const [data, setData]         = useState<DashboardData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [businessId, setBusinessId] = useState("");

  const load = useCallback(async (params: { email?: string; businessId?: string }) => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (params.email)      query.set("email",      params.email);
      if (params.businessId) query.set("businessId", params.businessId);

      const res = await fetch(`/api/business?${query}`);
      const json = await res.json() as DashboardData & { error?: string };

      if (!res.ok || !json.business) {
        setError(json.error ?? "No account found. Sign up first.");
        setData(null);
        setBusinessId("");
        return false;
      }

      setData(json);
      setBusinessId(json.business.id);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
      setData(null);
      setBusinessId("");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (businessId) return load({ businessId });
    const email = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) ?? "" : "";
    if (email) return load({ email });
    return false;
  }, [businessId, load]);

  const updateLead = useCallback(async (leadId: string, nextContacted: boolean) => {
    setData(prev => {
      if (!prev) return prev;
      const patch = (arr: Conversation[]) =>
        arr.map(c => c.id === leadId ? { ...c, lead_contacted: nextContacted } : c);
      return { ...prev, conversations: patch(prev.conversations), leads: patch(prev.leads) };
    });
    try {
      await supabase
        .from("conversations")
        .update({ lead_contacted: nextContacted })
        .eq("id", leadId);
    } catch {
      // Revert optimistic update on failure
      await refresh();
    }
  }, [refresh]);

  return { data, loading, error, businessId, load, refresh, updateLead };
}
