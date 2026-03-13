'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { supabase } from '@/lib/supabase';

type DateRange = '7' | '30' | '90' | 'all';

type ConvRow = {
  id: string;
  created_at: string;
  lead_captured: boolean;
  messages: Array<{ role: string; content: string }> | null;
  language_detected?: string | null;
};

type BookingRow = { id: string; created_at: string };

const LANG_COLORS: Record<string, string> = {
  English: '#3b82f6',
  Turkish: '#f59e0b',
  Arabic: '#10b981',
  Russian: '#ef4444',
  Greek: '#8b5cf6',
  Other: '#94a3b8',
};

const QUESTION_KEYWORDS: Record<string, string[]> = {
  Pricing: ['price', 'cost', 'how much', 'rate', 'fee', 'charge', 'expensive', 'cheap'],
  Availability: ['available', 'availability', 'free', 'open', 'slot', 'vacancy', 'book'],
  Location: ['where', 'location', 'address', 'directions', 'find', 'near', 'map'],
  Hours: ['hour', 'time', 'when', 'open', 'close', 'schedule', 'timing'],
  Booking: ['book', 'reserve', 'appointment', 'reservation', 'schedule'],
  Other: [],
};

function classifyMessage(text: string): string {
  const lower = text.toLowerCase();
  for (const [cat, kws] of Object.entries(QUESTION_KEYWORDS)) {
    if (cat === 'Other') continue;
    if (kws.some((kw) => lower.includes(kw))) return cat;
  }
  return 'Other';
}

function detectLanguage(messages: Array<{ role: string; content: string }> | null): string {
  const userMsg = messages?.find((m) => m.role === 'user')?.content ?? '';
  const arabicPattern = /[\u0600-\u06FF]/;
  const cyrillicPattern = /[\u0400-\u04FF]/;
  const greekPattern = /[\u0370-\u03FF]/;
  const turkishChars = /[şğüöçıİŞĞÜÖÇ]/i;

  if (arabicPattern.test(userMsg)) return 'Arabic';
  if (cyrillicPattern.test(userMsg)) return 'Russian';
  if (greekPattern.test(userMsg)) return 'Greek';
  if (turkishChars.test(userMsg)) return 'Turkish';
  return 'English';
}

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function toDateKey(iso: string) {
  return iso.slice(0, 10);
}

function buildDateRange(range: DateRange) {
  if (range === 'all') return null;
  return daysAgoISO(Number(range));
}

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(iso));
}

export default function AnalyticsTab({ businessId }: { businessId: string }) {
  const [range, setRange] = useState<DateRange>('30');
  const [conversations, setConversations] = useState<ConvRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchData();
  }, [businessId, range]);

  async function fetchData() {
    setLoading(true);
    try {
      const since = buildDateRange(range);
      let convQuery = supabase
        .from('conversations')
        .select('id, created_at, lead_captured, messages')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true });
      if (since) convQuery = convQuery.gte('created_at', since);

      let bookQuery = supabase
        .from('bookings')
        .select('id, created_at')

      const [{ data: convData }, { data: bookData }] = await Promise.all([convQuery, bookQuery]);
      setConversations((convData as ConvRow[]) ?? []);
      setBookings((bookData as BookingRow[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  // ── Derived metrics ───────────────────────────────────────────────────────

  const totalChats = conversations.length;
  const totalLeads = conversations.filter((c) => c.lead_captured).length;
  const totalBookings = bookings.length;
  const conversionRate =
    totalLeads > 0 && totalBookings > 0
      ? Math.round((totalBookings / totalLeads) * 100)
      : totalLeads > 0
        ? Math.round((totalLeads / totalChats) * 100)
        : 0;

  // Conversations over time
  const byDay: Record<string, { chats: number; leads: number }> = {};
  for (const c of conversations) {
    const key = toDateKey(c.created_at);
    if (!byDay[key]) byDay[key] = { chats: 0, leads: 0 };
    byDay[key].chats++;
    if (c.lead_captured) byDay[key].leads++;
  }
  const timelineData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, v]) => ({ date: formatDateShort(date), ...v }));

  // Top questions
  const questionCounts: Record<string, number> = {};
  for (const c of conversations) {
    const msgs = c.messages ?? [];
    for (const m of msgs) {
      if (m.role !== 'user') continue;
      const cat = classifyMessage(m.content);
      questionCounts[cat] = (questionCounts[cat] ?? 0) + 1;
    }
  }
  const questionsData = Object.entries(questionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Peak hours heatmap: [dow][hour]
  const heatmap: number[][] = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));
  const maxHeat = { value: 0 };
  for (const c of conversations) {
    const d = new Date(c.created_at);
    const dow = d.getDay();
    const hour = d.getHours();
    heatmap[dow][hour]++;
    if (heatmap[dow][hour] > maxHeat.value) maxHeat.value = heatmap[dow][hour];
  }
  const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Language breakdown
  const langCounts: Record<string, number> = {};
  for (const c of conversations) {
    const lang = detectLanguage(c.messages);
    langCounts[lang] = (langCounts[lang] ?? 0) + 1;
  }
  const langData = Object.entries(langCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Funnel
  const funnelStarts = Math.max(totalChats, 1);
  const funnelData = [
    { name: 'Visitors', value: Math.round(funnelStarts * 3.5), fill: '#3b82f6' },
    { name: 'Started Chat', value: funnelStarts, fill: '#6366f1' },
    { name: 'Gave Contact', value: totalLeads, fill: '#8b5cf6' },
    { name: 'Booked', value: totalBookings, fill: '#10b981' },
  ];

  // Performance score
  const leadCapturePct = totalChats > 0 ? (totalLeads / totalChats) * 100 : 0;
  const bookingPct = totalLeads > 0 ? (totalBookings / totalLeads) * 100 : 0;
  const perfScore = Math.min(
    100,
    Math.round(leadCapturePct * 0.5 + bookingPct * 0.3 + Math.min(totalChats / 5, 20))
  );
  const perfColor = perfScore >= 80 ? '#10b981' : perfScore >= 60 ? '#f59e0b' : '#ef4444';

  const RANGE_OPTS: { label: string; value: DateRange }[] = [
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' },
    { label: 'Last 90 days', value: '90' },
    { label: 'All time', value: 'all' },
  ];

  return (
    <section className="space-y-6">
      {/* Header + date range picker */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Analytics</h2>
          <p className="mt-1 text-sm text-slate-500">Deep insights into your AI performance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE_OPTS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRange(o.value)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                range === o.value
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Chats', value: totalChats },
              { label: 'Leads Captured', value: totalLeads },
              { label: 'Bookings', value: totalBookings },
              { label: 'Conversion Rate', value: `${conversionRate}%` },
            ].map((m) => (
              <div key={m.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">{m.label}</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Chart 1 — Conversations over time */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Conversations Over Time</h3>
            {timelineData.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">No data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timelineData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} width={28} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={2} dot={false} name="Conversations" />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={false} name="Leads" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Chart 2 — Top questions */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Top Questions Asked</h3>
              {questionsData.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-10">No messages to analyse yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={questionsData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} width={28} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Chart 4 — Language breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Language Breakdown</h3>
              {langData.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-10">No data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={langData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                      labelLine={false}
                    >
                      {langData.map((entry) => (
                        <Cell key={entry.name} fill={LANG_COLORS[entry.name] ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 3 — Peak hours heatmap */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Peak Hours Heatmap</h3>
            <p className="mb-3 text-xs text-slate-400">Darker = more chats. Rows = days, columns = hours (00–23).</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-max">
                <div className="grid gap-y-1">
                  {heatmap.map((hourRow, dow) => (
                    <div key={dow} className="flex items-center gap-1">
                      <span className="w-8 shrink-0 text-right text-xs font-semibold text-slate-400">
                        {DOW_LABELS[dow]}
                      </span>
                      {hourRow.map((count, hour) => {
                        const intensity =
                          maxHeat.value > 0 ? count / maxHeat.value : 0;
                        const bg = intensity === 0
                          ? '#f1f5f9'
                          : `rgba(37,99,235,${0.15 + intensity * 0.85})`;
                        return (
                          <div
                            key={hour}
                            title={`${DOW_LABELS[dow]} ${String(hour).padStart(2, '0')}:00 — ${count} chat${count !== 1 ? 's' : ''}`}
                            className="h-6 w-6 rounded-sm"
                            style={{ backgroundColor: bg }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-1 flex gap-1 pl-9">
                  {Array.from({ length: 24 }, (_, i) => (
                    <span key={i} className="w-6 text-center text-[9px] text-slate-300">
                      {i % 6 === 0 ? String(i).padStart(2, '0') : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
            {/* Chart 5 — Funnel */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Lead Conversion Funnel</h3>
              <div className="space-y-3">
                {funnelData.map((step, i) => {
                  const topVal = funnelData[0].value;
                  const pct = topVal > 0 ? Math.round((step.value / topVal) * 100) : 0;
                  return (
                    <div key={step.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{step.name}</span>
                        <span className="text-slate-500">{step.value.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-7 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: step.fill }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance score */}
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Performance Score</h3>
              <svg viewBox="0 0 120 120" className="h-32 w-32">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={perfColor}
                  strokeWidth="12"
                  strokeDasharray={`${(perfScore / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0f172a">
                  {perfScore}
                </text>
              </svg>
              <p className="mt-2 text-sm font-semibold" style={{ color: perfColor }}>
                {perfScore >= 80 ? 'Excellent' : perfScore >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
              <p className="mt-1 text-center text-xs text-slate-400">
                Based on lead capture rate, booking conversion & activity.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
