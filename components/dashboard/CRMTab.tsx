'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Search, X, MessageSquare, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ContactStatus = 'new' | 'contacted' | 'interested' | 'converted' | 'lost';

type Contact = {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  lead_source: string | null;
  contact_status: ContactStatus | null;
  contact_notes: string | null;
  contacted_at: string | null;
  converted_at: string | null;
  messages: Array<{ role: 'user' | 'assistant'; content: string }> | null;
};

const STATUS_CONFIG: Record<
  ContactStatus,
  { label: string; badge: string }
> = {
  new: { label: 'New', badge: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', badge: 'bg-yellow-100 text-yellow-700' },
  interested: { label: 'Interested', badge: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted', badge: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', badge: 'bg-slate-100 text-slate-500' },
};

function escapeCsv(v: string) {
  return `"${v.replace(/"/g, '""')}"`;
}

function formatDate(v?: string | null) {
  if (!v) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(v));
}

function StatusBadge({ status }: { status: ContactStatus | null }) {
  const cfg = STATUS_CONFIG[status ?? 'new'];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
}

export default function CRMTab({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelNotes, setPanelNotes] = useState('');
  const [panelStatus, setPanelStatus] = useState<ContactStatus>('new');
  const [savingPanel, setSavingPanel] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [addingSaving, setAddingSaving] = useState(false);

  useEffect(() => {
    void fetchContacts();
  }, [businessId]);

  async function fetchContacts() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('conversations')
        .select(
          'id, created_at, customer_name, customer_phone, customer_email, lead_source, contact_status, contact_notes, contacted_at, converted_at, messages'
        )
        .eq('business_id', businessId)
        .eq('lead_captured', true)
        .order('created_at', { ascending: false });
      setContacts((data as Contact[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let list = contacts;
    if (filterStatus !== 'all') {
      list = list.filter((c) => (c.contact_status ?? 'new') === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.customer_name?.toLowerCase().includes(q) ||
          c.customer_phone?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contacts, filterStatus, search]);

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const stats = {
    total: contacts.length,
    newThisWeek: contacts.filter(
      (c) => new Date(c.created_at).getTime() > weekAgo
    ).length,
    contacted: contacts.filter(
      (c) => (c.contact_status ?? 'new') === 'contacted'
    ).length,
    converted: contacts.filter(
      (c) => (c.contact_status ?? 'new') === 'converted'
    ).length,
  };

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  function openPanel(contact: Contact) {
    setSelectedId(contact.id);
    setPanelNotes(contact.contact_notes ?? '');
    setPanelStatus((contact.contact_status ?? 'new') as ContactStatus);
  }

  async function savePanelChanges() {
    if (!selectedId) return;
    setSavingPanel(true);
    try {
      await supabase
        .from('conversations')
        .update({
          contact_status: panelStatus,
          contact_notes: panelNotes,
          contacted_at:
            panelStatus === 'contacted'
              ? new Date().toISOString()
              : undefined,
          converted_at:
            panelStatus === 'converted'
              ? new Date().toISOString()
              : undefined,
        })
        .eq('id', selectedId);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, contact_status: panelStatus, contact_notes: panelNotes }
            : c
        )
      );
    } finally {
      setSavingPanel(false);
    }
  }

  async function addManualContact() {
    if (!newContact.name.trim()) return;
    setAddingSaving(true);
    try {
      const { data } = await supabase
        .from('conversations')
        .insert({
          business_id: businessId,
          customer_name: newContact.name,
          customer_phone: newContact.phone || null,
          customer_email: newContact.email || null,
          lead_captured: true,
          contact_status: 'new',
          messages: [],
        })
        .select()
        .single();
      if (data) setContacts((prev) => [data as Contact, ...prev]);
      setNewContact({ name: '', phone: '', email: '' });
      setShowAdd(false);
    } finally {
      setAddingSaving(false);
    }
  }

  function exportCsv() {
    const rows = filtered.map((c) => [
      c.customer_name ?? 'Unknown',
      c.customer_phone ?? '',
      STATUS_CONFIG[c.contact_status ?? 'new'].label,
      formatDate(c.created_at),
      c.lead_source ?? 'Widget',
    ]);
    const csv = [
      ['Name', 'Phone', 'Status', 'Date', 'Source'].map(escapeCsv).join(','),
      ...rows.map((r) => r.map((v) => escapeCsv(String(v))).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cypai-crm.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Contacts', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'New This Week', value: stats.newThisWeek, color: 'bg-purple-50 text-purple-700' },
          { label: 'Contacted', value: stats.contacted, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Converted', value: stats.converted, color: 'bg-green-50 text-green-700' },
        ].map((s) => (
          <div key={s.label} className={`rounded-3xl p-5 ${s.color}`}>
            <p className="text-sm font-medium opacity-80">{s.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
        <select
          aria-label="Filter contacts by status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ContactStatus | 'all')}
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            {search || filterStatus !== 'all'
              ? 'No contacts match your filters.'
              : 'No leads captured yet. Your AI will add contacts automatically.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Added</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="cursor-pointer bg-white hover:bg-slate-50"
                    onClick={() => openPanel(c)}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {c.customer_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.customer_phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.lead_source || 'Widget'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.contact_status ?? 'new'} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {c.customer_phone && (
                          <a
                            href={`https://wa.me/${c.customer_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20"
                            title="WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            WhatsApp
                          </a>
                        )}
                        {c.customer_phone && (
                          <a
                            href={`tel:${c.customer_phone}`}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                            title="Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-in Contact Panel */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSelectedId(null)}
          />
          <div className="flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                {selectedContact.customer_name || 'Unknown'}
              </h2>
              <button
                type="button"
                aria-label="Close panel"
                onClick={() => setSelectedId(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 px-6 py-5">
              {/* Info */}
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Phone</span>
                  <span className="text-slate-800">{selectedContact.customer_phone || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span className="text-slate-800">{selectedContact.customer_email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Source</span>
                  <span className="text-slate-800">{selectedContact.lead_source || 'Widget'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Added</span>
                  <span className="text-slate-800">{formatDate(selectedContact.created_at)}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="crm-contact-status" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  id="crm-contact-status"
                  value={panelStatus}
                  onChange={(e) => setPanelStatus(e.target.value as ContactStatus)}
                  className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                >
                  {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={panelNotes}
                  onChange={(e) => setPanelNotes(e.target.value)}
                  placeholder="Add notes about this contact…"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                {selectedContact.customer_phone && (
                  <>
                    <a
                      href={`https://wa.me/${selectedContact.customer_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${selectedContact.customer_phone}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  </>
                )}
                {selectedContact.customer_email && (
                  <a
                    href={`mailto:${selectedContact.customer_email}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    ✉️ Email
                  </a>
                )}
              </div>

              {/* Conversation transcript */}
              {(selectedContact.messages?.length ?? 0) > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">
                    Conversation Transcript
                  </h3>
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-4">
                    {selectedContact.messages!.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                            m.role === 'user'
                              ? 'rounded-br-sm bg-blue-600 text-white'
                              : 'rounded-bl-sm bg-white text-slate-700 shadow-sm'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                disabled={savingPanel}
                onClick={() => void savePanelChanges()}
                className="w-full rounded-2xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {savingPanel ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowAdd(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-extrabold text-slate-900">Add Contact</h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Full name *"
                value={newContact.name}
                onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={newContact.email}
                onChange={(e) => setNewContact((p) => ({ ...p, email: e.target.value }))}
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              disabled={!newContact.name.trim() || addingSaving}
              onClick={() => void addManualContact()}
              className="mt-4 w-full rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {addingSaving ? 'Saving…' : 'Add Contact'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
