"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Conversation } from "@/lib/supabase";
import { useBusiness } from "@/contexts/BusinessContext";
import ConversationsTab from "@/components/dashboard/ConversationsTab";
import { ConversationsEmpty } from "@/components/dashboard/EmptyState";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

export default function ConversationsPage() {
  const router = useRouter();
  const { business, loading: contextLoading, isAuthenticated } = useBusiness();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!contextLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [contextLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchConversations() {
      if (!business) {
        setLoading(false);
        return;
      }

      const { data: convData } = await supabase
        .from("conversations")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      setConversations((convData as Conversation[]) ?? []);
      setLoading(false);
    }

    if (business) {
      void fetchConversations();
    }
  }, [business]);

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

  if (contextLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <ChatSkeleton />
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

  // Show empty state if no conversations
  if (conversations.length === 0) {
    return <ConversationsEmpty />;
  }

  return (
    <ConversationsTab
      conversations={conversations}
      business={{ id: business.id }}
      onLeadContacted={handleLeadContacted}
    />
  );
}
