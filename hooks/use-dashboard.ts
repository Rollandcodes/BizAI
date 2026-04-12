"use client";
import { useCallback, useState } from "react";
import type { Business, Conversation } from "@/lib/supabase";

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

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/business", {
        credentials: "include",
      });
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
    return load();
  }, [load]);

  const updateLead = useCallback(async (leadId: string, nextContacted: boolean) => {
    setData(prev => {
      if (!prev) return prev;
      const patch = (arr: Conversation[]) =>
        arr.map(c => c.id === leadId ? { ...c, lead_contacted: nextContacted } : c);
      return { ...prev, conversations: patch(prev.conversations), leads: patch(prev.leads) };
    });
    try {
      const response = await fetch("/api/conversations/" + encodeURIComponent(leadId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          leadContacted: nextContacted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }
    } catch {
      // Revert optimistic update on failure
      await refresh();
    }
  }, [businessId, refresh]);

  return { data, loading, error, businessId, load, refresh, updateLead };
}
