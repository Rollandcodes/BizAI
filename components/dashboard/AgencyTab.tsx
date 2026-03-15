'use client';

import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ClientRecord = {
  id: string;
  business_name: string;
  business_type: string | null;
  owner_email: string;
  plan: string;
  created_at: string;
  // runtime-joined stats
  todayChats?: number;
  weekLeads?: number;
};

const PLAN_BADGE: Record<string, string> = {
  trial: 'bg-slate-100 text-slate-600',
  starter: 'bg-green-100 text-green-700',
  basic: 'bg-green-100 text-green-700',
  pro: 'bg-blue-100 text-blue-700',
  business: 'bg-purple-100 text-purple-700',
};

const PLAN_PRICE: Record<string, number> = {
  trial: 0,
  basic: 29,
  starter: 29,
  pro: 79,
  business: 149,
};

const BUSINESS_TYPES = [
  { value: 'car_rental', label: 'Car Rental' },
  { value: 'barbershop', label: 'Barbershop' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'gym', label: 'Gym' },
  { value: 'other', label: 'Other' },
];

function formatDate(v: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(v));
}

export default function AgencyTab({ ownerEmail }: { ownerEmail: string }) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingClient, setViewingClient] = useState<ClientRecord | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    business_name: '',
    owner_email: '',
    business_type: 'other',
    plan: 'trial',
    whatsapp: '',
  });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    void fetchClients();
  }, [ownerEmail]);

  async function fetchClients() {
    setLoading(true);
    try {
      const normalizedOwnerEmail = ownerEmail.trim().toLowerCase();

      if (!normalizedOwnerEmail) {
        setClients([]);
        return;
      }

      const { data } = await supabase
        .from('businesses')
        .select('id, business_name, business_type, owner_email, plan, created_at')
        .eq('owner_email', normalizedOwnerEmail)
        .order('created_at', { ascending: false });
      const raw = (data as ClientRecord[]) ?? [];

      // Enrich with light stats
      const enriched = await Promise.all(
        raw.map(async (c) => {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

          const [{ count: todayChats }, { count: weekLeads }] = await Promise.all([
            supabase
              .from('conversations')
              .select('id', { count: 'exact', head: true })
              .eq('business_id', c.id)
              .gte('created_at', todayStart.toISOString()),
            supabase
              .from('conversations')
              .select('id', { count: 'exact', head: true })
              .eq('business_id', c.id)
              .eq('lead_captured', true)
              .gte('created_at', weekStart),
          ]);
          return { ...c, todayChats: todayChats ?? 0, weekLeads: weekLeads ?? 0 };
        })
      );
      setClients(enriched);
    } finally {
      setLoading(false);
    }
  }

  async function addClient() {
    setAddError('');
    if (!addForm.business_name.trim() || !addForm.owner_email.trim()) {
      setAddError('Business name and owner email are required.');
      return;
    }
    setAddSaving(true);
    try {
      const { error } = await supabase.from('businesses').insert({
        business_name: addForm.business_name,
        owner_email: addForm.owner_email.toLowerCase().trim(),
        business_type: addForm.business_type,
        plan: addForm.plan,
        whatsapp: addForm.whatsapp || null,
      });
      if (error) throw error;
      setAddForm({ business_name: '', owner_email: '', business_type: 'other', plan: 'trial', whatsapp: '' });
      setShowAdd(false);
      void fetchClients();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setAddSaving(false);
    }
  }

  const totalRevenue = clients.reduce((sum, c) => sum + (PLAN_PRICE[c.plan] ?? 0), 0);
  const activeClients = clients.filter((c) => c.plan !== 'trial').length;
  const totalLeads = clients.reduce((sum, c) => sum + (c.weekLeads ?? 0), 0);
  const bestClient = [...clients].sort((a, b) => (b.weekLeads ?? 0) - (a.weekLeads ?? 0))[0];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Clients</h2>
          <p className="mt-1 text-sm text-slate-500">
            Agency view — manage all businesses from one place.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {/* Agency stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Clients', value: clients.length },
          { label: 'Active (Paid)', value: activeClients },
          { label: 'Leads This Week', value: totalLeads },
          { label: 'Total MRR', value: `$${totalRevenue}` },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {bestClient && (
        <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm text-green-800">
          🏆 Best performing this week: <strong>{bestClient.business_name}</strong> with {bestClient.weekLeads} lead{bestClient.weekLeads !== 1 ? 's' : ''}
        </div>
      )}

      {/* Client grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
          No clients yet. Click &ldquo;Add Client&rdquo; to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-900">{c.business_name}</p>
                  <p className="text-xs text-slate-500">{c.business_type ?? 'Other'}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_BADGE[c.plan] ?? PLAN_BADGE.trial}`}>
                  {c.plan.charAt(0).toUpperCase() + c.plan.slice(1)}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-blue-50 p-2 text-center">
                  <p className="text-xl font-extrabold text-blue-700">{c.todayChats ?? 0}</p>
                  <p className="text-blue-500">Chats today</p>
                </div>
                <div className="rounded-xl bg-green-50 p-2 text-center">
                  <p className="text-xl font-extrabold text-green-700">{c.weekLeads ?? 0}</p>
                  <p className="text-green-500">Leads this week</p>
                </div>
              </div>

              <p className="mt-3 truncate text-xs text-slate-400">{c.owner_email}</p>
              <p className="text-xs text-slate-400">Since {formatDate(c.created_at)}</p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewingClient(c)}
                  className="flex-1 rounded-2xl border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  View Dashboard
                </button>
                <a
                  href={`/dashboard?email=${encodeURIComponent(c.owner_email)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Open ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View-as banner modal */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setViewingClient(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Agency Mode</p>
            <h3 className="mt-2 text-xl font-extrabold text-slate-900">
              Viewing as: {viewingClient.business_name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{viewingClient.owner_email}</p>
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              ⚠️ You are about to view this client's dashboard. Changes made will affect their account.
            </div>
            <a
              href={`/dashboard?email=${encodeURIComponent(viewingClient.owner_email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Open Client Dashboard →
            </a>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowAdd(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900">Add New Client</h3>
            {addError && (
              <div className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{addError}</div>
            )}
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Business name *"
                value={addForm.business_name}
                onChange={(e) => setAddForm((p) => ({ ...p, business_name: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Owner email *"
                value={addForm.owner_email}
                onChange={(e) => setAddForm((p) => ({ ...p, owner_email: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={addForm.whatsapp}
                onChange={(e) => setAddForm((p) => ({ ...p, whatsapp: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <select
                aria-label="Business type"
                value={addForm.business_type}
                onChange={(e) => setAddForm((p) => ({ ...p, business_type: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select
                aria-label="Plan"
                value={addForm.plan}
                onChange={(e) => setAddForm((p) => ({ ...p, plan: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              >
                {['trial', 'starter', 'pro', 'business'].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={!addForm.business_name.trim() || !addForm.owner_email.trim() || addSaving}
              onClick={() => void addClient()}
              className="mt-4 w-full rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {addSaving ? 'Creating…' : 'Create Client Account'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
