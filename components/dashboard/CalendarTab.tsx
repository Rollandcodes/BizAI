'use client';

import { useEffect, useState } from 'react';
import { Calendar, Plus, Link as LinkIcon, Settings, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type CalendarConnection = {
  id: string;
  business_id: string;
  provider: 'google' | 'outlook' | 'ical';
  calendar_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  is_synced: boolean;
  last_sync: string | null;
  created_at: string;
};

type AvailabilityRule = {
  id: string;
  business_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string; // HH:MM
  end_time: string;
  is_active: boolean;
};

type CalendarPreference = {
  id: string;
  business_id: string;
  auto_sync_enabled: boolean;
  sync_frequency_minutes: number;
  sync_buffer_minutes: number;
  allowed_booking_days_ahead: number;
  min_booking_hours_ahead: number;
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarTab({ businessId }: { businessId: string }) {
  const [activeTab, setActiveTab] = useState<'calendars' | 'connections' | 'availability' | 'preferences'>('calendars');
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRule[]>([]);
  const [preferences, setPreferences] = useState<CalendarPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    void fetchCalendarData();
  }, [businessId]);

  async function fetchCalendarData() {
    setLoading(true);
    try {
      // Fetch connections
      const { data: connData } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('business_id', businessId);
      setConnections(connData || []);

      // Fetch availability rules
      const { data: availData } = await supabase
        .from('availability_rules')
        .select('*')
        .eq('business_id', businessId)
        .order('day_of_week');
      setAvailability(availData || []);

      // Fetch preferences
      const { data: prefData } = await supabase
        .from('calendar_preferences')
        .select('*')
        .eq('business_id', businessId)
        .single();
      setPreferences(prefData || null);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleConnectGoogle = async () => {
    // OAuth flow will happen here
    const redirectUri = `${window.location.origin}/api/calendar/google-callback`;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const scope = 'https://www.googleapis.com/auth/calendar';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await supabase
        .from('calendar_connections')
        .delete()
        .eq('id', connectionId)
        .eq('business_id', businessId);
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch (err) {
      console.error('Error disconnecting calendar:', err);
    }
  };

  const handleToggleSync = async (connectionId: string, isCurrentlySynced: boolean) => {
    try {
      await supabase
        .from('calendar_connections')
        .update({ is_synced: !isCurrentlySynced })
        .eq('id', connectionId)
        .eq('business_id', businessId);
      setConnections((prev) =>
        prev.map((c) => (c.id === connectionId ? { ...c, is_synced: !isCurrentlySynced } : c))
      );
    } catch (err) {
      console.error('Error toggling sync:', err);
    }
  };

  const handleAddAvailability = async () => {
    // Add new availability rule
    const newRule: AvailabilityRule = {
      id: '',
      business_id: businessId,
      day_of_week: 0,
      start_time: '09:00',
      end_time: '17:00',
      is_active: true,
    };

    try {
      const { data } = await supabase
        .from('availability_rules')
        .insert([newRule])
        .select()
        .single();
      if (data) setAvailability((prev) => [...prev, data]);
    } catch (err) {
      console.error('Error adding availability rule:', err);
    }
  };

  const handleUpdateAvailability = async (rule: AvailabilityRule) => {
    try {
      await supabase
        .from('availability_rules')
        .update({
          start_time: rule.start_time,
          end_time: rule.end_time,
          is_active: rule.is_active,
        })
        .eq('id', rule.id)
        .eq('business_id', businessId);
      setAvailability((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
    } catch (err) {
      console.error('Error updating availability rule:', err);
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    try {
      if (preferences.id) {
        await supabase
          .from('calendar_preferences')
          .update(preferences)
          .eq('id', preferences.id)
          .eq('business_id', businessId);
      } else {
        const { data } = await supabase
          .from('calendar_preferences')
          .insert([preferences])
          .select()
          .single();
        if (data) setPreferences(data);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header with Help */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Calendar Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">Sync, manage, and configure your business availability</p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
        >
          <HelpCircle className="h-4 w-4" />
          How it works
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900">📚 Calendar Setup Guide</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>✅ <strong>Connections:</strong> Link your Google Calendar or Outlook to sync bookings automatically</li>
            <li>✅ <strong>Availability:</strong> Set your working hours for each day - customers can only book during these times</li>
            <li>✅ <strong>Preferences:</strong> Control sync frequency, booking advance notice, and buffer times</li>
            <li>✅ <strong>Auto-sync:</strong> Enable to automatically check availability when customers book</li>
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {(['calendars', 'connections', 'availability', 'preferences'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'calendars' && '📅 Calendars'}
              {tab === 'connections' && '🔗 Connections'}
              {tab === 'availability' && '⏰ Availability'}
              {tab === 'preferences' && '⚙️ Preferences'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Calendars Tab */}
          {activeTab === 'calendars' && (
            <div className="space-y-4">
              <button
                onClick={() => handleConnectGoogle()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Connect Calendar
              </button>

              <div className="grid gap-3">
                {connections.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-sm font-medium text-slate-900">No calendars connected</p>
                    <p className="text-xs text-slate-500">Connect your first calendar to enable booking sync</p>
                  </div>
                ) : (
                  connections.map((conn) => (
                    <div key={conn.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900 capitalize">{conn.provider} Calendar</h4>
                          <p className="text-xs text-slate-500">Calendar ID: {conn.calendar_id || 'N/A'}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Last synced: {conn.last_sync ? new Date(conn.last_sync).toLocaleString() : 'Never'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleSync(conn.id, conn.is_synced)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              conn.is_synced
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {conn.is_synced ? '✓ Syncing' : 'Paused'}
                          </button>
                          <button
                            onClick={() => handleDisconnect(conn.id)}
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="grid gap-4">
              {(['google', 'outlook', 'ical'] as const).map((provider) => {
                const connected = connections.some((c) => c.provider === provider);
                return (
                  <div key={provider} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 capitalize">{provider === 'ical' ? 'iCal/CalDAV' : provider}</h4>
                        <p className="text-xs text-slate-500">
                          {provider === 'google' && 'Sync with Google Calendar'}
                          {provider === 'outlook' && 'Sync with Outlook / Office 365'}
                          {provider === 'ical' && 'Connect via iCal feed or CalDAV'}
                        </p>
                      </div>
                      <div>
                        {connected ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">Connected</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => provider === 'google' && handleConnectGoogle()}
                            disabled={provider !== 'google'}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              provider === 'google'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {provider === 'google' ? 'Connect' : 'Coming Soon'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <button
                onClick={handleAddAvailability}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Hours
              </button>

              {availability.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-900">No availability rules</p>
                  <p className="text-xs text-slate-500">Set your working hours to enable customer bookings</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {availability.map((rule) => (
                    <div key={rule.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-center">
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Day</label>
                          <select
                            value={rule.day_of_week}
                            onChange={(e) =>
                              handleUpdateAvailability({ ...rule, day_of_week: parseInt(e.target.value) })
                            }
                            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                          >
                            {DAYS_OF_WEEK.map((day, idx) => (
                              <option key={idx} value={idx}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Start</label>
                          <input
                            type="time"
                            value={rule.start_time}
                            onChange={(e) => handleUpdateAvailability({ ...rule, start_time: e.target.value })}
                            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700">End</label>
                          <input
                            type="time"
                            value={rule.end_time}
                            onChange={(e) => handleUpdateAvailability({ ...rule, end_time: e.target.value })}
                            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700">Status</label>
                          <select
                            value={rule.is_active ? 'active' : 'inactive'}
                            onChange={(e) => handleUpdateAvailability({ ...rule, is_active: e.target.value === 'active' })}
                            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => handleUpdateAvailability(rule)}
                            className="w-full rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && preferences && (
            <div className="max-w-2xl space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.auto_sync_enabled}
                      onChange={(e) => setPreferences({ ...preferences, auto_sync_enabled: e.target.checked })}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm font-semibold text-slate-900">Auto-sync enabled</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500">Automatically sync availability with connected calendars</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Sync frequency (minutes)
                  </label>
                  <input
                    type="number"
                    value={preferences.sync_frequency_minutes}
                    onChange={(e) =>
                      setPreferences({ ...preferences, sync_frequency_minutes: parseInt(e.target.value) })
                    }
                    min={5}
                    max={60}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">How often to check for calendar updates</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Buffer time before/after bookings (minutes)
                  </label>
                  <input
                    type="number"
                    value={preferences.sync_buffer_minutes}
                    onChange={(e) =>
                      setPreferences({ ...preferences, sync_buffer_minutes: parseInt(e.target.value) })
                    }
                    min={0}
                    max={120}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">Block time before/after each booking for travel/setup</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Allow bookings up to X days ahead
                  </label>
                  <input
                    type="number"
                    value={preferences.allowed_booking_days_ahead}
                    onChange={(e) =>
                      setPreferences({ ...preferences, allowed_booking_days_ahead: parseInt(e.target.value) })
                    }
                    min={1}
                    max={90}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Minimum hours ahead to book
                  </label>
                  <input
                    type="number"
                    value={preferences.min_booking_hours_ahead}
                    onChange={(e) =>
                      setPreferences({ ...preferences, min_booking_hours_ahead: parseInt(e.target.value) })
                    }
                    min={0}
                    max={168}
                    step="0.5"
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">Customers must book at least this many hours in advance</p>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
