"use client";
import { useState } from "react";
import { parseMessages, formatDateTime, conversationPreview } from "@/lib/utils";
import type { Conversation } from "@/lib/supabase";

interface Props {
  conversations: Conversation[];
  business: { id: string };
  onLeadContacted: (leadId: string, contacted: boolean) => Promise<void>;
}

export default function ConversationsTab({ conversations, business, onLeadContacted }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "web" | "whatsapp">("all");

  const filtered = conversations.filter(c => {
    if (channelFilter !== "all" && c.channel !== channelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.customer_name?.toLowerCase().includes(q) ||
        c.customer_phone?.includes(q) ||
        conversationPreview(c.messages).toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selected = filtered.find(c => c.id === selectedId) ?? null;
  const messages = selected ? parseMessages(selected.messages) : [];

  return (
    <div className="flex h-[calc(100vh-200px)] overflow-hidden rounded-3xl border border-zinc-800">
      {/* List pane */}
      <div className="flex w-80 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 p-4 space-y-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="h-9 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-blue-500"
          />
          <div className="flex gap-1">
            {(["all", "web", "whatsapp"] as const).map(ch => (
              <button key={ch} type="button"
                onClick={() => setChannelFilter(ch)}
                className={`flex-1 rounded-full py-1 text-xs font-semibold transition ${channelFilter === ch ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:bg-zinc-800"}`}>
                {ch === "all" ? "All" : ch === "web" ? "Widget" : "WhatsApp"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500">No conversations yet.</p>
          ) : filtered.map(c => (
            <button key={c.id} type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full border-b border-zinc-800/50 p-4 text-left transition ${selectedId === c.id ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-zinc-100">{c.customer_name ?? "Anonymous"}</p>
                {c.lead_captured && (
                  <span className="shrink-0 rounded-full bg-emerald-900/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300">LEAD</span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{conversationPreview(c.messages)}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${c.channel === "whatsapp" ? "bg-green-900/40 text-green-300" : "bg-blue-900/40 text-blue-300"}`}>
                  {c.channel ?? "web"}
                </span>
                <span className="text-[10px] text-zinc-600">{formatDateTime(c.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail pane */}
      <div className="flex flex-1 flex-col bg-zinc-950">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-500">Select a conversation</p>
          </div>
        ) : (
          <>
            <div className="border-b border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-zinc-100">{selected.customer_name ?? "Anonymous visitor"}</h2>
                  {selected.customer_phone && (
                    <a href={`tel:${selected.customer_phone}`} className="text-sm text-blue-400 hover:underline">
                      {selected.customer_phone}
                    </a>
                  )}
                  <p className="text-xs text-zinc-500 mt-0.5">{formatDateTime(selected.created_at)}</p>
                </div>
                {selected.lead_captured && !selected.lead_contacted && (
                  <button type="button"
                    onClick={() => onLeadContacted(selected.id, true)}
                    className="rounded-full border border-emerald-700/50 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-900/30">
                    Mark contacted
                  </button>
                )}
                {selected.lead_contacted && (
                  <span className="rounded-full bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    ✓ Contacted
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-100"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
