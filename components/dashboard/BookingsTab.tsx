'use client';

import { useEffect, useState } from 'react';
import { Calendar, Check, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

type Booking = {
  id: string;
  business_id: string;
  session_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  service_type: string | null;
  booking_date: string | null;
  booking_time: string | null;
  special_requests: string | null;
  status: BookingStatus;
  confirmed_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  created_at: string;
};

type CalendarDayInfo = {
  date: string; // YYYY-MM-DD
  counts: { pending: number; confirmed: number; cancelled: number };
};

function formatDate(v?: string | null) {
  if (!v) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(v));
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toYMD(d: Date) {
  return d.toISOString().slice(0, 10);
}

const STATUS_CLASSES: Record<BookingStatus, string> = {
  pending: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingsTab({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [auditLogs, setAuditLogs] = useState<Record<string, Array<{ action: string; details: unknown; timestamp: string }>>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    customer_name: '',
    customer_phone: '',
    service_type: '',
    booking_date: '',
    booking_time: '',
    notes: '',
  });
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    void fetchBookingHistory();
  }, [businessId]);

  async function fetchBookingHistory() {
    setLoading(true);
    try {
      const res = await fetch(`/api/booking-history?businessId=${businessId}`);
      if (!res.ok) throw new Error('Failed to load booking history');
      const { bookings: fetchedBookings, auditLogs: fetchedLogs } = await res.json();
      setBookings(fetchedBookings ?? []);
      const grouped: Record<string, Array<{ action: string; details: unknown; timestamp: string }>> = {};
      for (const log of fetchedLogs ?? []) {
        if (!grouped[log.booking_id]) grouped[log.booking_id] = [];
        grouped[log.booking_id].push(log);
      }
      setAuditLogs(grouped);
    } finally {
      setLoading(false);
    }
  }

  async function confirmBooking(b: Booking) {
    setUpdating((s: Set<string>) => new Set(s).add(b.id));
    try {
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', b.id);
      setBookings((prev: Booking[]) =>
        prev.map((x: Booking) => (x.id === b.id ? { ...x, status: 'confirmed' as const } : x))
      );
      const name = b.customer_name;
      const date = b.booking_date ?? '';
      const service = b.service_type ?? 'your booking';
      const msg = `Hi ${name}! Your booking at ${businessName} is confirmed for ${date}. See you then! 🎉`;
      void service;
      const phone = (b.customer_phone ?? '').replace(/\D/g, '');
      if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } finally {
      setUpdating((s: Set<string>) => { const n = new Set(s); n.delete(b.id); return n; });
    }
  }

  async function cancelBooking(b: Booking) {
    setUpdating((s: Set<string>) => new Set(s).add(b.id));
    try {
      await supabase
        .from('bookings')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', b.id);
      setBookings((prev: Booking[]) =>
        prev.map((x: Booking) => (x.id === b.id ? { ...x, status: 'cancelled' as const } : x))
      );
      const name = b.customer_name;
      const date = b.booking_date ?? '';
      const msg = `Hi ${name}, unfortunately we can't accommodate your booking for ${date}. Please contact us to find another time.`;
      const phone = (b.customer_phone ?? '').replace(/\D/g, '');
      if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } finally {
      setUpdating((s: Set<string>) => { const n = new Set(s); n.delete(b.id); return n; });
    }
  }

  async function addManualBooking() {
    if (!addForm.customer_name.trim()) return;
    setAddSaving(true);
    try {
      const { data } = await supabase
        .from('bookings')
        .insert({
          business_id: businessId,
          customer_name: addForm.customer_name,
          customer_phone: addForm.customer_phone || null,
          service_type: addForm.service_type || null,
          booking_date: addForm.booking_date || null,
          booking_time: addForm.booking_time || null,
          notes: addForm.notes || null,
          status: 'pending',
        })
        .select()
        .single();
      if (data) setBookings((prev: Booking[]) => [data as Booking, ...prev]);
      setAddForm({ customer_name: '', customer_phone: '', service_type: '', booking_date: '', booking_time: '', notes: '' });
      setShowAdd(false);
    } finally {
      setAddSaving(false);
    }
  }

  // Build calendar day map
  const dayMap: Record<string, CalendarDayInfo> = {};
  for (const b of bookings) {
    if (!b.booking_date) continue;
    const key = b.booking_date.slice(0, 10);
    if (!dayMap[key]) dayMap[key] = { date: key, counts: { pending: 0, confirmed: 0, cancelled: 0 } };
    dayMap[key].counts[b.status as BookingStatus]++;
  }

  const { year, month } = calMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();

  const calDays: Array<string | null> = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i: number) =>
      `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    ),
  ];

  const dayBookings = selectedDay
    ? bookings.filter((b: Booking) => b.booking_date?.startsWith(selectedDay))
    : bookings.filter((b: Booking) => b.status === 'pending');

  const pendingCount = bookings.filter((b: Booking) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b: Booking) => b.status === 'confirmed').length;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function prevMonth() {
    setCalMonth((p: { year: number; month: number }) => {
      if (p.month === 0) return { year: p.year - 1, month: 11 };
      return { year: p.year, month: p.month - 1 };
    });
    setSelectedDay(null);
  }

  function nextMonth() {
    setCalMonth((p: { year: number; month: number }) => {
      if (p.month === 11) return { year: p.year + 1, month: 0 };
      return { year: p.year, month: p.month + 1 };
    });
    setSelectedDay(null);
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount} pending · {confirmedCount} confirmed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {view === 'calendar' ? '📋 List View' : '📅 Calendar View'}
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Booking
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {view === 'calendar' ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
              {/* Calendar */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <button type="button" onClick={prevMonth} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">&#8249;</button>
                  <h3 className="font-bold text-slate-900">{monthNames[month]} {year}</h3>
                  <button type="button" onClick={nextMonth} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">&#8250;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calDays.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    const info = dayMap[day];
                    const isSelected = selectedDay === day;
                    const isToday = day === toYMD(new Date());
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-medium transition ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : isToday
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {day.slice(8)}
                        {info && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                            {info.counts.pending > 0 && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                            {info.counts.confirmed > 0 && <span className="h-1.5 w-1.5 rounded-full bg-green-400" />}
                            {info.counts.cancelled > 0 && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" />Pending</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400" />Confirmed</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />Cancelled</span>
                </div>
              </div>

              {/* Day bookings */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-700">
                  {selectedDay ? `Bookings on ${formatDate(selectedDay)}` : 'Pending Bookings'}
                </h3>
                {dayBookings.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                    <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    {selectedDay ? 'No bookings on this day.' : 'No pending bookings.'}
                  </div>
                ) : (
                  dayBookings.map((b) => (
                    <div key={b.id}>
                      <BookingCard booking={b} onConfirm={confirmBooking} onCancel={cancelBooking} updating={updating.has(b.id)} />
                      {auditLogs[b.id]?.length ? (
                        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                          <div className="font-semibold text-slate-500 mb-1">Audit Log:</div>
                          <ul className="space-y-1">
                            {auditLogs[b.id].map((log, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="font-bold text-blue-700">{log.action}</span>
                                <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                                <span className="text-slate-600">{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* List view */
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {bookings.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-500">
                  <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                  No bookings yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Customer</th>
                        <th className="px-4 py-3 font-semibold">Service</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Time</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                        <th className="px-4 py-3 font-semibold">Audit Log</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b.id} className="bg-white">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-900">{b.customer_name}</p>
                            <p className="text-xs text-slate-500">{b.customer_phone || '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{b.service_type || '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(b.booking_date)}</td>
                          <td className="px-4 py-3 text-slate-600">{b.booking_time || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[b.status]}`}>
                              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {b.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  disabled={updating.has(b.id)}
                                  onClick={() => void confirmBooking(b)}
                                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50"
                                >
                                  <Check className="inline h-3 w-3 mr-0.5" />Confirm
                                </button>
                                <button
                                  type="button"
                                  disabled={updating.has(b.id)}
                                  onClick={() => void cancelBooking(b)}
                                  className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200 disabled:opacity-50"
                                >
                                  <X className="inline h-3 w-3 mr-0.5" />Decline
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {auditLogs[b.id]?.length ? (
                              <ul className="space-y-1">
                                {auditLogs[b.id].map((log, idx) => (
                                  <li key={idx} className="flex gap-2">
                                    <span className="font-bold text-blue-700">{log.action}</span>
                                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                                    <span className="text-slate-600">{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Booking Modal */}
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
            <h3 className="text-lg font-extrabold text-slate-900">Add Manual Booking</h3>
            <div className="mt-4 space-y-3">
              <input type="text" placeholder="Customer name *" value={addForm.customer_name} onChange={(e) => setAddForm((p) => ({ ...p, customer_name: e.target.value }))} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Phone number" value={addForm.customer_phone} onChange={(e) => setAddForm((p) => ({ ...p, customer_phone: e.target.value }))} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              <input type="text" placeholder="Service / item" value={addForm.service_type} onChange={(e) => setAddForm((p) => ({ ...p, service_type: e.target.value }))} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" aria-label="Booking date" value={addForm.booking_date} onChange={(e) => setAddForm((p) => ({ ...p, booking_date: e.target.value }))} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
                <input type="time" aria-label="Booking time" value={addForm.booking_time} onChange={(e) => setAddForm((p) => ({ ...p, booking_time: e.target.value }))} className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500" />
              </div>
              <textarea rows={2} placeholder="Notes" value={addForm.notes} onChange={(e) => setAddForm((p) => ({ ...p, notes: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
            </div>
            <button
              type="button"
              disabled={!addForm.customer_name.trim() || addSaving}
              onClick={() => void addManualBooking()}
              className="mt-4 w-full rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {addSaving ? 'Saving…' : 'Save Booking'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function BookingCard({
  booking: b,
  onConfirm,
  onCancel,
  updating,
}: {
  booking: Booking;
  onConfirm: (b: Booking) => Promise<void>;
  onCancel: (b: Booking) => Promise<void>;
  updating: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-bold text-slate-900">{b.customer_name}</p>
          <p className="text-xs text-slate-500">{b.customer_phone || '—'}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[b.status]}`}>
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div><span className="font-semibold text-slate-400">Service</span><br />{b.service_type || '—'}</div>
        <div><span className="font-semibold text-slate-400">Date</span><br />{b.booking_date || '—'}</div>
        <div><span className="font-semibold text-slate-400">Time</span><br />{b.booking_time || '—'}</div>
        {b.special_requests && (
          <div className="col-span-2"><span className="font-semibold text-slate-400">Requests</span><br />{b.special_requests}</div>
        )}
      </div>
      {b.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => void onConfirm(b)}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-green-600 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" /> Confirm
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => void onCancel(b)}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" /> Decline
          </button>
        </div>
      )}
    </div>
  );
}
