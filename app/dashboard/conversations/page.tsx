"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Business, Conversation } from "@/lib/supabase";
import ConversationsTab from "@/components/dashboard/ConversationsTab";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export const metadata = {
  title: "Conversations | Dashboard",
};

export default function ConversationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

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

      // Fetch conversations
      const { data: convData } = await supabase
        .from("conversations")
        .select("*")
        .eq("business_id", businessData.id)
        .order("created_at", { ascending: false });

      setConversations((convData as Conversation[]) ?? []);
      setLoading(false);
    }

    void fetchData();
  }, [router]);

  async function handleLeadContacted(leadId: string, contacted: boolean) {
    if (!business) return;

    await supabase
      .from("conversations")
      .update({ lead_contacted: contacted })
      .eq("id", leadId);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === leadId ? { ...c, lead_contacted: contacted } : c
      )
    );
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
    <ConversationsTab
      conversations={conversations}
      business={{ id: business.id }}
      onLeadContacted={handleLeadContacted}
    />
  );
}
