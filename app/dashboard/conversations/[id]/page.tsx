"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Phone, Mail, Calendar, ArrowLeft, MoreVertical, Download, UserPlus, Check, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/contexts/BusinessContext";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";
import { formatDateTime, parseMessages } from "@/lib/utils";

type Conversation = {
  id: string;
  business_id: string;
  session_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  messages: unknown[];
  lead_captured: boolean;
  lead_contacted: boolean;
  contact_status: string | null;
  channel: string | null;
  created_at: string;
  updated_at: string | null;
};

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-amber-100 text-amber-700" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
  { value: "interested", label: "Interested", color: "bg-purple-100 text-purple-700" },
  { value: "not_interested", label: "Not Interested", color: "bg-gray-100 text-gray-700" },
  { value: "converted", label: "Converted", color: "bg-green-100 text-green-700" },
];

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { business, loading: contextLoading, isAuthenticated } = useBusiness();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!contextLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [contextLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchConversation() {
      if (!business || !resolvedParams.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", resolvedParams.id)
        .eq("business_id", business.id)
        .single();

      if (error) {
        console.error("Error fetching conversation:", error);
        setLoading(false);
        return;
      }

      setConversation(data as Conversation);
      setLoading(false);
    }

    if (business) {
      void fetchConversation();
    }
  }, [business, resolvedParams.id]);

  async function updateStatus(newStatus: string) {
    if (!conversation) return;

    const { error } = await supabase
      .from("conversations")
      .update({ contact_status: newStatus })
      .eq("id", conversation.id);

    if (!error) {
      setConversation({ ...conversation, contact_status: newStatus });
    }
    setShowStatusDropdown(false);
  }

  async function markAsRead() {
    if (!conversation) return;

    await supabase
      .from("conversations")
      .update({ lead_contacted: true })
      .eq("id", conversation.id);

    setConversation({ ...conversation, lead_contacted: true });
  }

  async function exportConversation() {
    if (!conversation) return;

    const messages = parseMessages(conversation.messages);
    const exportData = {
      customerName: conversation.customer_name,
      customerPhone: conversation.customer_phone,
      customerEmail: conversation.customer_email,
      channel: conversation.channel,
      status: conversation.contact_status,
      createdAt: conversation.created_at,
      messages: messages,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${conversation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowActionsDropdown(false);
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

  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-slate-500">Conversation not found.</p>
        <button
          onClick={() => router.push("/dashboard/conversations")}
          className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-white hover:bg-[#2a2a4e]"
        >
          Back to Conversations
        </button>
      </div>
    );
  }

  const messages = parseMessages(conversation.messages) as Message[];
  const currentStatus = STATUS_OPTIONS.find(s => s.value === conversation.contact_status) || STATUS_OPTIONS[0];
  const isRecent = (Date.now() - new Date(conversation.created_at).getTime()) < 12 * 60 * 60 * 1000;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/conversations")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1a1a2e]">
              {conversation.customer_name || "Anonymous Visitor"}
            </h1>
            {isRecent && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                Recent
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Started {formatDateTime(conversation.created_at)}
          </p>
        </div>

        {/* Status dropdown */}
        <div className="relative">
        <button
          aria-label="Change status"
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${currentStatus.color}`}
        >
            <span className="text-sm font-medium">{currentStatus.label}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 top-12 z-10 w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className={`h-2 w-2 rounded-full ${status.color.split(" ")[0]}`} />
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            aria-label="More actions"
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
          {showActionsDropdown && (
            <div className="absolute right-0 top-12 z-10 w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => {
                  // Add to CRM logic
                  setShowActionsDropdown(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                <UserPlus className="h-4 w-4" />
                Add to CRM
              </button>
              <button
                onClick={exportConversation}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customer info card */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-500">Customer Information</h3>
        <div className="flex flex-wrap gap-6">
          {conversation.customer_phone && (
            <a
              href={`tel:${conversation.customer_phone}`}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-amber-600"
            >
              <Phone className="h-4 w-4" />
              {conversation.customer_phone}
            </a>
          )}
          {conversation.customer_email && (
            <a
              href={`mailto:${conversation.customer_email}`}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-amber-600"
            >
              <Mail className="h-4 w-4" />
              {conversation.customer_email}
            </a>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MessageCircle className="h-4 w-4" />
            {conversation.channel === "whatsapp" ? "WhatsApp" : "Website Widget"}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4" />
            {formatDateTime(conversation.created_at)}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h3 className="font-semibold text-gray-700">Conversation</h3>
        </div>
        <div className="max-h-[500px] space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gray-100 text-gray-900 rounded-tl-none"
                      : "bg-[#1a1a2e] text-white rounded-tr-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`mt-1 text-xs ${msg.role === "user" ? "text-gray-500" : "text-gray-400"}`}>
                    {msg.timestamp ? formatDateTime(msg.timestamp) : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mark as contacted button for leads */}
      {conversation.lead_captured && !conversation.lead_contacted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={markAsRead}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            <Check className="h-4 w-4" />
            Mark as Contacted
          </button>
        </div>
      )}
    </div>
  );
}
