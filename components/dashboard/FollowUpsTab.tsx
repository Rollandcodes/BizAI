'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Lead = { id: string; customer_name: string | null; customer_phone: string | null };

const TEMPLATES = [
  {
    id: 'new-lead',
    label: 'New Lead Follow-up',
    text: `Hi {name}! 👋 This is {businessName}. You recently asked about our services. I'd love to help you! Are you still interested? Reply here or call us anytime.`,
  },
  {
    id: 'booking-reminder',
    label: 'Booking Reminder',
    text: `Hi {name}! Just a reminder about your {service} booking tomorrow at {time}. See you soon! 🎉 — {businessName}`,
  },
  {
    id: 'special-offer',
    label: 'Special Offer',
    text: `Hi {name}! 🎁 We have a special offer this week just for you. Contact us to find out more! — {businessName}`,
  },
  {
    id: 're-engagement',
    label: 'Re-engagement',
    text: `Hi {name}! It's been a while since we last spoke. We'd love to have you back! Any questions we can help with? — {businessName}`,
  },
];

export default function FollowUpsTab({
  businessId,
  businessName,
  businessType,
}: {
  businessId: string;
  businessName: string;
  businessType?: string | null;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [customMessage, setCustomMessage] = useState(TEMPLATES[0].text);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [generatorPrompt, setGeneratorPrompt] = useState('Win back inactive leads with a warm WhatsApp message.');
  const [generatorTone, setGeneratorTone] = useState<'friendly' | 'professional' | 'urgent'>('friendly');
  const [generatingTemplates, setGeneratingTemplates] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<Array<{ label: string; text: string }>>([]);
  const [generatorError, setGeneratorError] = useState('');

  // Nudge stats (computed from lead data)
  const [notContacted3Days, setNotContacted3Days] = useState(0);
  const [unconfirmedBookings, setUnconfirmedBookings] = useState(0);
  const [interestedNeedFollowup, setInterestedNeedFollowup] = useState(0);

  useEffect(() => {
    void fetchLeads();
    void fetchNudgeStats();
  }, [businessId]);

  useEffect(() => {
    if (!copyFeedback) return;
    const timer = setTimeout(() => setCopyFeedback(''), 1800);
    return () => clearTimeout(timer);
  }, [copyFeedback]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('conversations')
        .select('id, customer_name, customer_phone')
        .eq('business_id', businessId)
        .eq('lead_captured', true)
        .not('customer_phone', 'is', null)
        .order('created_at', { ascending: false });
      setLeads((data as Lead[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNudgeStats() {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const { count: nc } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('lead_captured', true)
        .lte('created_at', threeDaysAgo)
        .in('contact_status', ['new', null]);
      setNotContacted3Days(nc ?? 0);

      const { count: ub } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('status', 'pending');
      setUnconfirmedBookings(ub ?? 0);

      const { count: inf } = await supabase
        .from('conversations')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('contact_status', 'interested');
      setInterestedNeedFollowup(inf ?? 0);
    } catch {
      // non-critical
    }
  }

  function pickTemplate(t: (typeof TEMPLATES)[0]) {
    setSelectedTemplate(t);
    setCustomMessage(t.text.replace(/{businessName}/g, businessName));
  }

  function applyGeneratedTemplate(template: { label: string; text: string }) {
    setSelectedTemplate({ id: `generated-${template.label}`, label: template.label, text: template.text });
    setCustomMessage(template.text.replace(/{businessName}/g, businessName));
  }

  function resolveMessage(name: string) {
    return customMessage
      .replace(/{name}/g, name)
      .replace(/{businessName}/g, businessName);
  }

  function toggleContact(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleAll() {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map((l) => l.id)));
  }

  const selectedLeads = useMemo(
    () => leads.filter((l) => selected.has(l.id) && l.customer_phone),
    [leads, selected]
  );

  function openBroadcast() {
    if (selectedLeads.length === 0) return;
    setSentCount(0);
    setBroadcastOpen(true);
  }

  async function copyMessage(text: string, feedback: string) {
    await navigator.clipboard.writeText(text);
    setCopyFeedback(feedback);
  }

  async function generateTemplates() {
    setGeneratingTemplates(true);
    setGeneratorError('');
    try {
      const res = await fetch('/api/followups/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessType,
          objective: generatorPrompt,
          tone: generatorTone,
        }),
      });
      const data = (await res.json()) as {
        templates?: Array<{ label: string; text: string }>;
        error?: string;
      };
      if (!res.ok || !data.templates?.length) {
        throw new Error(data.error ?? 'Failed to generate templates');
      }
      setGeneratedTemplates(data.templates);
    } catch (err) {
      setGeneratorError(err instanceof Error ? err.message : 'Failed to generate templates');
    } finally {
      setGeneratingTemplates(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Follow-ups</h2>
        <p className="mt-1 text-sm text-slate-500">
          Send WhatsApp follow-ups to your leads using pre-built templates.
        </p>
      </div>

      {/* Nudge tray */}
      <div className="space-y-2">
        {notContacted3Days > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 text-sm">
            <span className="text-amber-800">
              📅 <strong>{notContacted3Days}</strong> leads haven&apos;t been contacted in 3+ days
            </span>
          </div>
        )}
        {unconfirmedBookings > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-blue-50 px-4 py-3 text-sm">
            <span className="text-blue-800">
              📅 <strong>{unconfirmedBookings}</strong> booking{unconfirmedBookings > 1 ? 's' : ''} have no confirmation yet
            </span>
          </div>
        )}
        {interestedNeedFollowup > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-purple-50 px-4 py-3 text-sm">
            <span className="text-purple-800">
              📅 <strong>{interestedNeedFollowup}</strong> leads marked &apos;Interested&apos; need follow-up
            </span>
          </div>
        )}
        {notContacted3Days === 0 && unconfirmedBookings === 0 && interestedNeedFollowup === 0 && (
          <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            ✅ All leads are up to date — no follow-ups needed right now.
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Templates panel */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Message Templates</h3>
          {copyFeedback && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {copyFeedback}
            </div>
          )}
          <div className="space-y-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickTemplate(t)}
                className={`w-full rounded-2xl border p-4 text-left text-sm transition ${
                  selectedTemplate.id === t.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-slate-900">{t.label}</p>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      void copyMessage(t.text.replace(/{businessName}/g, businessName), `${t.label} copied.`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        void copyMessage(t.text.replace(/{businessName}/g, businessName), `${t.label} copied.`);
                      }
                    }}
                    className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-white"
                  >
                    Copy
                  </span>
                </div>
                <p className="mt-1 select-text line-clamp-3 text-slate-500">{t.text.replace(/{businessName}/g, businessName)}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-slate-900">AI Template Generator</h4>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">AI</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Generate fresh WhatsApp follow-up ideas for this business.</p>

            <div className="mt-3 space-y-3">
              <textarea
                rows={3}
                value={generatorPrompt}
                onChange={(e) => setGeneratorPrompt(e.target.value)}
                placeholder="Describe the follow-up you want..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
              <div className="flex gap-2">
                {(['friendly', 'professional', 'urgent'] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setGeneratorTone(tone)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${generatorTone === tone ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void generateTemplates()}
                disabled={generatingTemplates || !generatorPrompt.trim()}
                className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {generatingTemplates ? 'Generating…' : 'Generate AI Templates'}
              </button>
              {generatorError && <p className="text-xs font-semibold text-red-600">{generatorError}</p>}
            </div>

            {generatedTemplates.length > 0 && (
              <div className="mt-4 space-y-2">
                {generatedTemplates.map((template, index) => (
                  <div key={`${template.label}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{template.label}</p>
                        <p className="mt-1 select-text whitespace-pre-wrap text-sm text-slate-600">{template.text}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => applyGeneratedTemplate(template)}
                          className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => void copyMessage(template.text, `${template.label} copied.`)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor="followups-custom-message" className="block text-sm font-semibold text-slate-700">
                Customize Message
              </label>
              <button
                type="button"
                onClick={() => void copyMessage(customMessage, 'Custom message copied.')}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Copy Message
              </button>
            </div>
            <textarea
              id="followups-custom-message"
              rows={5}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
            <p className="mt-1 text-xs text-slate-400">
              Use <code className="rounded bg-slate-100 px-1">{'{name}'}</code> to personalize.
            </p>
          </div>
        </div>

        {/* Contact list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-slate-800">
              Select Contacts ({selected.size} selected)
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleAll}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {selected.size === leads.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                type="button"
                disabled={selectedLeads.length === 0}
                onClick={openBroadcast}
                className="rounded-2xl bg-[#25D366] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                💬 Open All WhatsApp Chats ({selectedLeads.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : leads.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
              No leads with phone numbers yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto">
                {leads.map((l) => (
                  <label
                    key={l.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      onChange={() => toggleContact(l.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {l.customer_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500">{l.customer_phone}</p>
                    </div>
                    {selected.has(l.id) && l.customer_phone && (
                      <a
                        href={`https://wa.me/${l.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(resolveMessage(l.customer_name ?? 'there'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20"
                      >
                        Send
                      </a>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk broadcast modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setBroadcastOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>
            <h3 className="text-lg font-extrabold text-slate-900">
              Send via WhatsApp
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Click each contact to open WhatsApp. Sent: {sentCount}/{selectedLeads.length}
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold">Template:</span> {selectedTemplate.label}
            </div>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {selectedLeads.map((l, idx) => {
                const sent = idx < sentCount;
                const phone = (l.customer_phone ?? '').replace(/\D/g, '');
                const msg = resolveMessage(l.customer_name ?? 'there');
                return (
                  <a
                    key={l.id}
                    href={`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSentCount((n) => Math.max(n, idx + 1))}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      sent
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    <span>{l.customer_name ?? 'Unknown'} · {l.customer_phone}</span>
                    {sent ? '✅ Sent' : <span className="text-[#25D366]">Open WhatsApp →</span>}
                  </a>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setBroadcastOpen(false)}
              className="mt-5 w-full rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
