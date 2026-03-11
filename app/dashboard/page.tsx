'use client';

// ╔══════════════════════════════════════════════════════════╗
// ║  BizAI — Business Dashboard                              ║
// ╚══════════════════════════════════════════════════════════╝

import { useEffect, useMemo, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  Bot, CheckCircle2, Copy, CreditCard, Download,
  LayoutDashboard, Loader2, LogOut, MessageCircle,
  Settings2, Users,
} from 'lucide-react';
import Link from 'next/link';

import ChatWidget from '@/components/ChatWidget';
import { PLANS } from '@/lib/plans';

// ── Types ─────────────────────────────────────────────────────────────────────
type Business = {
  id: string;
  owner_email: string;
  business_name: string;
  business_type?: string;
  system_prompt?: string;
  widget_color: string;
  plan: string;
  plan_expires_at?: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  messages?: Array<{ role: string; content: string }>;
};

type DashboardPayload = {
  business: Business | null;
  stats: { monthlyConversations: number; leadsCaptured: number } | null;
  leads: LeadRow[];
};

const tabs = ['overview', 'conversations', 'leads', 'settings', 'upgrade'] as const;
type TabKey = (typeof tabs)[number];

const tabMeta: Record<TabKey, { label: string; Icon: React.ElementType }> = {
  overview:      { label: 'Overview',      Icon: LayoutDashboard },
  conversations: { label: 'Conversations', Icon: MessageCircle },
  leads:         { label: 'Leads',         Icon: Users },
  settings:      { label: 'Settings',      Icon: Settings2 },
  upgrade:       { label: 'Subscription',  Icon: CreditCard },
};

// ── CSV export helper ─────────────────────────────────────────────────────────
function exportLeadsCSV(leads: LeadRow[]) {
  const rows = leads.map(l => [
    l.customer_name || 'Unknown',
    l.customer_phone || '',
    new Date(l.created_at).toLocaleDateString(),
    (l.messages?.[0]?.content || '').replace(/,/g, ' '),
  ].join(','));
  const csv = ['Name,Phone,Date,First Message', ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'bizai-leads.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [input, setInput] = useState('');
  const [err, setErr] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = input.trim().toLowerCase();
    if (!v) { setErr('Enter your business email to continue.'); return; }
    window.localStorage.setItem('bizai-dashboard-email', v);
    onLogin(v);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">BizAI</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h1 className="mb-1 text-xl font-bold text-white">Welcome back</h1>
          <p className="mb-6 text-sm text-slate-400">Enter your business email to access your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Business Email</label>
              <input id="login-email" type="email" value={input} onChange={e => setInput(e.target.value)} placeholder="owner@business.com" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]">
              Open Dashboard
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-slate-500">
            {"Don't have an account? "}
            <Link href="/#pricing" className="text-blue-400 hover:underline">Get started</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [email,                setEmail]                = useState('');
  const [activeTab,            setActiveTab]            = useState<TabKey>('overview');
  const [loading,              setLoading]              = useState(false);
  const [error,                setError]                = useState('');
  const [copySuccess,          setCopySuccess]          = useState(false);
  const [selectedPlan,         setSelectedPlan]         = useState<string>('pro');
  const [paymentError,         setPaymentError]         = useState('');
  const [paymentSuccess,       setPaymentSuccess]       = useState('');
  const [dashboardData,        setDashboardData]        = useState<DashboardPayload>({ business: null, stats: null, leads: [] });
  const [settingsForm,         setSettingsForm]         = useState({ businessName: '', widgetColor: '#2563eb', customInstructions: '' });
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [contactedLeads,       setContactedLeads]       = useState<Set<string>>(new Set());
  const [{ isPending }] = usePayPalScriptReducer();

  const business    = dashboardData.business;
  const currentPlan = business?.plan || 'trial';

  const embedCode = useMemo(() => {
    if (!business) return '';
    return `<script>\n  window.BizAIConfig = { businessId: "${business.id}", primaryColor: "${business.widget_color || '#2563eb'}" };\n</script>\n<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/widget.js" defer></script>`;
  }, [business]);

  useEffect(() => {
    const stored = window.localStorage.getItem('bizai-dashboard-email') || '';
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (!email) return;
    void loadDashboard(email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (!business) return;
    setSettingsForm({
      businessName:       business.business_name,
      widgetColor:        business.widget_color || '#2563eb',
      customInstructions: business.system_prompt || '',
    });
    setSelectedPlan(currentPlan === 'trial' ? 'pro' : currentPlan);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business, currentPlan]);

  // ── API helpers ─────────────────────────────────────────────────────────────
  async function loadDashboard(nextEmail: string) {
    setLoading(true); setError('');
    try {
      const res  = await fetch(`/api/business?email=${encodeURIComponent(nextEmail)}`);
      const data = await res.json() as { business?: Business; stats?: DashboardPayload['stats']; leads?: LeadRow[]; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to load dashboard');
      setDashboardData({ business: data.business ?? null, stats: data.stats ?? null, leads: data.leads ?? [] });
    } catch (loadErr) {
      setError(loadErr instanceof Error ? loadErr.message : 'Failed to load dashboard');
      setDashboardData({ business: null, stats: null, leads: [] });
    } finally {
      setLoading(false);
    }
  }

  function handleLookup(nextEmail: string) {
    window.localStorage.setItem('bizai-dashboard-email', nextEmail);
    setEmail(nextEmail);
  }

  async function handleCopyEmbed() {
    if (!embedCode) return;
    await navigator.clipboard.writeText(embedCode);
    setCopySuccess(true);
    window.setTimeout(() => setCopySuccess(false), 1500);
  }

  async function handleSaveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;
    setError('');
    try {
      const res  = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id, businessName: settingsForm.businessName, widgetColor: settingsForm.widgetColor, customInstructions: settingsForm.customInstructions }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      await loadDashboard(email);
    } catch (saveErr) {
      setError(saveErr instanceof Error ? saveErr.message : 'Failed to save settings');
    }
  }

  const createOrder = async () => {
    if (!business) throw new Error('Business not loaded');
    const res  = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan, businessEmail: business.owner_email }),
    });
    const data = await res.json() as { orderID?: string; error?: string };
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data.orderID!;
  };

  const handleApprove = async (data: { orderID: string }) => {
    if (!business) return;
    const res    = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID, planId: selectedPlan, businessEmail: business.owner_email }),
    });
    const result = await res.json() as { message?: string; error?: string };
    if (!res.ok) throw new Error(result.error || 'Failed to capture order');
    setPaymentSuccess(result.message || 'Plan upgraded successfully.');
    setPaymentError('');
    await loadDashboard(email);
  };

  // ── Login gate ──────────────────────────────────────────────────────────────
  if (!email) return <LoginScreen onLogin={handleLookup} />;

  // ── Sidebar + main layout ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0f172a] text-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <Bot className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight">BizAI</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {tabs.map(tab => {
            const { label, Icon } = tabMeta[tab];
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 pb-2 text-xs text-slate-500">{email}</p>
          <button
            onClick={() => { window.localStorage.removeItem('bizai-dashboard-email'); setEmail(''); setDashboardData({ business: null, stats: null, leads: [] }); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600"><Bot className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold">BizAI</span>
          </div>
          <div className="flex gap-1">
            {tabs.map(tab => {
              const { Icon } = tabMeta[tab];
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          )}

          {!loading && !business && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">No business found</h2>
                <p className="mt-2 text-sm text-slate-500">We{"couldn't"} find a BizAI account for <strong>{email}</strong>.</p>
                <a href="mailto:support@bizai.example.com" className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Contact Support</a>
              </div>
            </div>
          )}

          {!loading && business && (
            <>
              {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              {/* ── OVERVIEW ───────────────────────────────────────────────── */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Good morning, {business.business_name} 👋</h1>
                    <p className="mt-1 text-sm text-slate-500">{"Here's what's happening with your AI assistant."}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: 'Total Conversations', value: String(dashboardData.stats?.monthlyConversations ?? 0), Icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
                      { label: 'Leads Captured',      value: String(dashboardData.stats?.leadsCaptured ?? 0),        Icon: Users,         color: 'bg-indigo-100 text-indigo-600' },
                      { label: 'Response Rate',        value: '100%',                                                Icon: CheckCircle2,  color: 'bg-green-100 text-green-600' },
                      { label: 'Current Plan',         value: currentPlan,                                           Icon: CreditCard,    color: 'bg-amber-100 text-amber-600' },
                    ].map(({ label, value, Icon, color }) => (
                      <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">{label}</p>
                          <p className="mt-0.5 text-xl font-bold capitalize text-slate-900">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-base font-bold text-slate-900">Recent Conversations</h2>
                      {dashboardData.leads.length === 0 ? (
                        <p className="text-sm text-slate-400">No conversations yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {dashboardData.leads.slice(0, 5).map(lead => (
                            <li key={lead.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                                {(lead.customer_name || '?')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">{lead.customer_name || 'Unknown visitor'}</p>
                                <p className="truncate text-xs text-slate-500">{lead.messages?.[0]?.content || 'No message'}</p>
                              </div>
                              <span className="shrink-0 text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-base font-bold text-slate-900">Install Widget</h2>
                        <button onClick={handleCopyEmbed} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                          {copySuccess ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                        </button>
                      </div>
                      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-200"><code>{embedCode}</code></pre>
                      <p className="mt-3 text-xs text-slate-500">Paste before the closing &lt;/body&gt; tag on your site.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CONVERSATIONS ───────────────────────────────────────────── */}
              {activeTab === 'conversations' && (
                <div className="flex h-[calc(100vh-6rem)] gap-4 overflow-hidden">
                  <div className="w-72 shrink-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-4 py-4">
                      <h2 className="text-sm font-bold text-slate-900">All Conversations</h2>
                      <p className="mt-0.5 text-xs text-slate-500">{dashboardData.leads.length} total</p>
                    </div>
                    {dashboardData.leads.length === 0 ? (
                      <p className="p-6 text-sm text-slate-400">No conversations yet.</p>
                    ) : (
                      <ul>
                        {dashboardData.leads.map(lead => (
                          <li key={lead.id}>
                            <button
                              onClick={() => setSelectedConversation(lead.id)}
                              className={`w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-0 hover:bg-slate-50 ${selectedConversation === lead.id ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex justify-between gap-2">
                                <span className="truncate text-sm font-semibold text-slate-800">{lead.customer_name || 'Unknown visitor'}</span>
                                <span className="shrink-0 text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{lead.messages?.[0]?.content || 'No message'}</p>
                              {lead.customer_phone && <span className="mt-1.5 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">Lead</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {!selectedConversation ? (
                      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                        Select a conversation to view messages
                      </div>
                    ) : (() => {
                      const conv = dashboardData.leads.find(l => l.id === selectedConversation);
                      if (!conv) return null;
                      return (
                        <>
                          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                              {(conv.customer_name || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{conv.customer_name || 'Unknown visitor'}</p>
                              <p className="text-xs text-slate-500">{conv.customer_phone || 'Phone not captured'}</p>
                            </div>
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50 p-5">
                            {(conv.messages || []).map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-tr-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'rounded-tl-sm bg-white text-slate-700 shadow-sm'}`}>
                                  {msg.content}
                                </div>
                              </div>
                            ))}
                            {(!conv.messages || conv.messages.length === 0) && (
                              <p className="text-center text-xs text-slate-400">No messages stored for this conversation.</p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* ── LEADS ───────────────────────────────────────────────────── */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-900">Leads</h1>
                      <p className="mt-1 text-sm text-slate-500">{dashboardData.leads.length} captured</p>
                    </div>
                    <button
                      onClick={() => exportLeadsCSV(dashboardData.leads)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3.5">Name</th>
                          <th className="px-5 py-3.5">Phone</th>
                          <th className="px-5 py-3.5">Date</th>
                          <th className="px-5 py-3.5">First Message</th>
                          <th className="px-5 py-3.5 text-center">Contacted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dashboardData.leads.length === 0 ? (
                          <tr><td colSpan={5} className="py-10 text-center text-slate-400">No leads captured yet.</td></tr>
                        ) : dashboardData.leads.map(lead => (
                          <tr key={lead.id} className={`transition hover:bg-slate-50 ${contactedLeads.has(lead.id) ? 'opacity-50' : ''}`}>
                            <td className="px-5 py-4 font-semibold text-slate-900">{lead.customer_name || 'Unknown'}</td>
                            <td className="px-5 py-4 text-slate-600">{lead.customer_phone || '—'}</td>
                            <td className="px-5 py-4 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                            <td className="max-w-xs truncate px-5 py-4 text-slate-600">{lead.messages?.[0]?.content || '—'}</td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={contactedLeads.has(lead.id)}
                                onChange={e => {
                                  setContactedLeads(prev => {
                                    const next = new Set(prev);
                                    e.target.checked ? next.add(lead.id) : next.delete(lead.id);
                                    return next;
                                  });
                                }}
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                                aria-label={`Mark ${lead.customer_name || 'lead'} as contacted`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── SETTINGS ────────────────────────────────────────────────── */}
              {activeTab === 'settings' && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <form onSubmit={handleSaveSettings} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
                      <p className="mt-1 text-sm text-slate-500">Customize your widget and AI behaviour.</p>
                    </div>

                    <div>
                      <label htmlFor="settings-business-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Business Name</label>
                      <input id="settings-business-name" value={settingsForm.businessName}
                        onChange={e => setSettingsForm(p => ({ ...p, businessName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>

                    <div>
                      <label htmlFor="settings-widget-color" className="mb-1.5 block text-sm font-semibold text-slate-700">Widget Colour</label>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                        <input id="settings-widget-color" type="color" value={settingsForm.widgetColor}
                          onChange={e => setSettingsForm(p => ({ ...p, widgetColor: e.target.value }))}
                          className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
                        <span className="text-sm text-slate-600">{settingsForm.widgetColor}</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="settings-custom-instructions" className="mb-1.5 block text-sm font-semibold text-slate-700">Custom AI Instructions</label>
                      <textarea id="settings-custom-instructions" rows={6} value={settingsForm.customInstructions}
                        onChange={e => setSettingsForm(p => ({ ...p, customInstructions: e.target.value }))}
                        placeholder="Tone, special offers, business rules, lead qualification notes..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>

                    <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90">
                      Save Settings
                    </button>
                  </form>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-1 text-base font-bold text-slate-900">Live Preview</h2>
                    <p className="mb-4 text-xs text-slate-500">Reflects your current colour and name as you type.</p>
                    <div className="h-[500px] overflow-hidden rounded-xl border border-slate-200">
                      <ChatWidget
                        businessId={business.id}
                        businessName={settingsForm.businessName || business.business_name}
                        primaryColor={settingsForm.widgetColor}
                        welcomeMessage={`Hi, this is ${settingsForm.businessName || business.business_name}. How can I help you today?`}
                        embedded
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── UPGRADE ─────────────────────────────────────────────────── */}
              {activeTab === 'upgrade' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Subscription</h1>
                    <p className="mt-1 text-sm text-slate-500">
                      {"You're on the "}<span className="font-bold capitalize text-slate-900">{currentPlan}</span>{" plan."}
                    </p>
                  </div>

                  {dashboardData.stats && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Messages this month</span>
                        <span>{dashboardData.stats.monthlyConversations} / {currentPlan === 'basic' ? '500' : 'Unlimited'}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
                          style={{ width: currentPlan === 'basic' ? `${Math.min(100, (dashboardData.stats.monthlyConversations / 500) * 100)}%` : '15%' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-3">
                    {Object.values(PLANS).map(plan => {
                      const isCurrent  = plan.id === currentPlan;
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div key={plan.id} className={`flex flex-col rounded-2xl border p-6 transition-all ${isCurrent ? 'border-blue-300 bg-blue-50' : isSelected ? 'border-slate-900 bg-white shadow-md' : 'border-slate-200 bg-white shadow-sm'}`}>
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                            {isCurrent && <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">Current</span>}
                          </div>
                          <p className="mb-4 text-2xl font-black text-slate-900">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></p>
                          <ul className="mb-5 flex-1 space-y-2">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />{f}
                              </li>
                            ))}
                          </ul>
                          {!isCurrent && (
                            <button
                              onClick={() => { setSelectedPlan(plan.id); setPaymentSuccess(''); setPaymentError(''); }}
                              className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${isSelected ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                            >
                              {isSelected ? 'Selected' : 'Select plan'}
                            </button>
                          )}
                          {isSelected && !isCurrent && !isPending && (
                            <div className="mt-3">
                              <PayPalButtons
                                createOrder={createOrder}
                                onApprove={handleApprove}
                                onError={() => setPaymentError('Payment failed. Please try again.')}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {paymentError   && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{paymentError}</div>}
                  {paymentSuccess && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{paymentSuccess}</div>}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
