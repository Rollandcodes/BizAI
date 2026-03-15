'use server';

import { google } from 'googleapis';
import { googleCalendarAuth } from '@/lib/integrations/google-calendar';
import { createServerClient } from '@/lib/supabase';

export type CalendarAvailabilityResult = {
  available: boolean;
  conflictingEvents?: any[];
};

export type CalendarEventDetails = {
  title: string;
  start: string;
  end: string;
  customerPhone: string;
  description?: string;
};

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, '');
}

function parseIsoDate(value: string, field: 'start' | 'end'): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${field} datetime. Expected ISO-8601 string.`);
  }
  return parsed;
}

export async function checkCalendarAvailability(
  start: string,
  end: string,
  tenantId: string
): Promise<CalendarAvailabilityResult> {
  try {
    if (!tenantId?.trim()) {
      throw new Error('tenantId is required');
    }

    const startDate = parseIsoDate(start, 'start');
    const endDate = parseIsoDate(end, 'end');

    if (endDate <= startDate) {
      throw new Error('end must be greater than start');
    }

    const auth = await googleCalendarAuth(tenantId);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    const events = (response.data.items ?? []).filter((event) => event.status !== 'cancelled');

    if (events.length === 0) {
      return { available: true };
    }

    return {
      available: false,
      conflictingEvents: events,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown calendar availability error';
    throw new Error(`Failed to check Google Calendar availability: ${message}`);
  }
}

export async function createCalendarEvent(
  eventDetails: CalendarEventDetails,
  tenantId: string
): Promise<string> {
  try {
    if (!tenantId?.trim()) {
      throw new Error('tenantId is required');
    }

    if (!eventDetails.title?.trim()) {
      throw new Error('eventDetails.title is required');
    }

    const startDate = parseIsoDate(eventDetails.start, 'start');
    const endDate = parseIsoDate(eventDetails.end, 'end');
    if (endDate <= startDate) {
      throw new Error('eventDetails.end must be greater than eventDetails.start');
    }

    const customerPhone = normalizePhone(eventDetails.customerPhone);
    if (!customerPhone) {
      throw new Error('eventDetails.customerPhone is required');
    }

    const auth = await googleCalendarAuth(tenantId);
    const calendar = google.calendar({ version: 'v3', auth });

    let googleEventId = '';
    try {
      const insertResult = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: eventDetails.title,
          description: eventDetails.description ?? `Customer phone: ${eventDetails.customerPhone}`,
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() },
        },
      });

      googleEventId = insertResult.data.id ?? '';
      if (!googleEventId) {
        throw new Error('Google Calendar did not return an event id');
      }
    } catch (err) {
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: number }).status)
          : undefined;

      if (status === 403) {
        throw new Error('Google Calendar access denied (403). Reconnect Google Calendar for this tenant.');
      }
      if (status === 404) {
        throw new Error('Google Calendar not found (404). Verify calendar access and configuration.');
      }

      const message = err instanceof Error ? err.message : 'Unknown Google Calendar error';
      throw new Error(message);
    }

    // Persist the Google event id to the most recent matching booking for this tenant.
    // Current schema maps tenant context to bookings.business_id.
    const supabase = createServerClient();
    const { data: booking, error: bookingLookupError } = await supabase
      .from('bookings')
      .select('id, customer_phone')
      .eq('business_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (bookingLookupError) {
      throw new Error(`Failed to lookup booking for calendar sync: ${bookingLookupError.message}`);
    }

    const matched = (booking ?? []).find((row) => normalizePhone(row.customer_phone ?? '') === customerPhone);
    if (!matched?.id) {
      throw new Error('Calendar event created but no matching booking was found to store google_event_id');
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ google_event_id: googleEventId })
      .eq('id', matched.id);

    if (updateError) {
      throw new Error(`Calendar event created but failed to update bookings.google_event_id: ${updateError.message}`);
    }

    return googleEventId;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown calendar event creation error';
    throw new Error(`Failed to create Google Calendar event: ${message}`);
  }
}
