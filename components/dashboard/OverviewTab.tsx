"use client";
import { useMemo, useState, useCallback } from "react";
import { Copy, Check, Download, Printer, QrCode } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import QRCode from "react-qr-code";
import StatCard from "./StatCard";
import type { DashboardData, DashboardStats } from "@/hooks/use-dashboard";
import type { Business, Conversation } from "@/lib/supabase";
import { formatDate, conversationPreview, downloadCsv } from "@/lib/utils";
import { planDisplayName, planBadgeClass, PLAN_MESSAGE_LIMITS } from "@/lib/plans";

interface Props {
  business:       Business;
  stats:          DashboardStats | null;
  conversations:  Conversation[];
  leads:          Conversation[];
  onCopyWidget:   () => void;
  widgetCode:     string;
}

function usageBar(used: number, limit: number | null) {
  if (!limit) return { pct: 0, label: `${used.toLocaleString()} messages (unlimited)`, overLimit: false };
  const pct = Math.min(100, (used / limit) * 100);
  return { pct, label: `${used.toLocaleString()} / ${limit.toLocaleString()} messages used`, overLimit: pct >= 100 };
}

export default function OverviewTab({ business, stats, conversations, leads, onCopyWidget, widgetCode }: Props) {
  const [copied, setCopied]     = useState(false);
  const plan = business.plan;
  const planName = planDisplayName(plan);
  const limit = PLAN_MESSAGE_LIMITS[plan];
  const { pct, label, overLimit } = usageBar(stats?.monthlyMessages ?? 0, limit ?? null);

  const handleCopy = () => {
    onCopyWidget();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chatPageUrl = `${typeof window !== "undefined" ? window.location.origin : "https://cypai.app"}/chat/${business.id}`;

  // Activity chart: last 7 days
  const chartData = useMemo(() => {
    const days: Record<string, { label: string; conversations: number; leads: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = { label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), conversations: 0, leads: 0 };
    }
    for (const c of conversations) {
      const key = c.created_at.slice(0, 10);
      if (days[key]) {
        days[key].conversations++;
        if (c.lead_captured) days[key].leads++;
      }
    }
    return Object.values(days);
  }, [conversations]);

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Conversations" value={stats?.totalConversations ?? 0} />
        <StatCard label="Leads Captured"      value={stats?.leadsCaptured ?? 0} />
        <StatCard label="This Month"           value={stats?.monthlyMessages ?? 0} sub="messages" />
        <StatCard label="Current Plan"         value={planName} badgeClassName={planBadgeClass(plan)} />
      </div>

      {/* Usage bar */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-zinc-300">{label}</p>
          {overLimit && (
            <span className="rounded-full bg-red-900/40 px-2 py-0.5 text-xs font-semibold text-red-300">
              Limit reached — upgrade to continue
            </span>
          )}
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800">
          <div
            className={`h-2 rounded-full transition-all ${overLimit ? "bg-red-500" : "bg-blue-500"}`}
            style={{ width: limit ? `${pct}%` : "0%" }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Activity chart */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">7-day activity</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 12 }} labelStyle={{ color: "#e4e4e7" }} />
                <Line type="monotone" dataKey="conversations" stroke="#3b82f6" strokeWidth={2} dot={false} name="Conversations" />
                <Line type="monotone" dataKey="leads"         stroke="#34d399" strokeWidth={2} dot={false} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Recent leads</h2>
            <button
              type="button"
              onClick={() => downloadCsv(
                [["Date","Name","Phone","Message"],
                 ...leads.map(l => [formatDate(l.created_at), l.customer_name ?? "", l.customer_phone ?? "", conversationPreview(l.messages)])],
                "cypai-leads.csv"
              )}
              className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Export CSV
            </button>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-zinc-500">No leads yet. Your AI is ready to capture them.</p>
          ) : (
            <ul className="space-y-2">
              {recentLeads.map(lead => (
                <li key={lead.id} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold text-white">
                    {(lead.customer_name ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-100">{lead.customer_name ?? "Unknown"}</p>
                    <p className="truncate text-xs text-zinc-500">{lead.customer_phone ?? "No phone"}</p>
                  </div>
                  <p className="shrink-0 text-xs text-zinc-500">{formatDate(lead.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Widget code + QR */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">Embed your chat widget</h2>
          <code className="block rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs text-blue-300 break-all">
            {widgetCode}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
          >
            {copied ? <><Check className="h-4 w-4 text-emerald-400" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy code</>}
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">QR code for walk-in customers</h2>
          <div id="cypai-qr" className="flex justify-center rounded-xl bg-white p-4">
            <QRCode value={chatPageUrl} size={160} />
          </div>
          <p className="mt-2 text-center text-xs text-zinc-500">Scan to open chat on mobile</p>
        </div>
      </div>
    </div>
  );
}
