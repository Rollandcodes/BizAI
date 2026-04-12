import { AlertLogDateRange, AlertLogOutcomeFilter, AlertLogTriggerFilter } from './alerts';

export type AlertLogFilters = {
  trigger: AlertLogTriggerFilter;
  outcome: AlertLogOutcomeFilter;
  dateRange: AlertLogDateRange;
  exportCsv: boolean;
  page: number;
  pageSize: number;
  fromRaw: string | null;
  toRaw: string | null;
};

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function toAlertLogTriggerFilter(value: string | null): AlertLogTriggerFilter {
  if (value === 'automatic' || value === 'manual_test') {
    return value;
  }
  return 'all';
}

export function toAlertLogOutcomeFilter(value: string | null): AlertLogOutcomeFilter {
  if (value === 'success' || value === 'failed') {
    return value;
  }
  return 'all';
}

function normalizeDateStart(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const iso = `${value}T00:00:00.000Z`;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function normalizeDateEnd(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const iso = `${value}T23:59:59.999Z`;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

export function parseAlertLogFilters(searchParams: URLSearchParams): AlertLogFilters {
  const fromRaw = searchParams.get('alertLogFrom');
  const toRaw = searchParams.get('alertLogTo');

  return {
    trigger: toAlertLogTriggerFilter(searchParams.get('alertLogTrigger')),
    outcome: toAlertLogOutcomeFilter(searchParams.get('alertLogOutcome')),
    dateRange: {
      from: normalizeDateStart(fromRaw),
      to: normalizeDateEnd(toRaw),
    },
    exportCsv: searchParams.get('alertLogsExport') === 'csv',
    page: normalizePositiveInt(Number(searchParams.get('alertLogPage') || 1), 1, 1, 5000),
    pageSize: normalizePositiveInt(Number(searchParams.get('alertLogPageSize') || 10), 10, 5, 50),
    fromRaw,
    toRaw,
  };
}

export function buildTrendOverview(trendRows: Array<{ status: string | null; created_at: string | null }>) {
  const trend = {
    windowDays: 7,
    sent: 0,
    failed: 0,
    queued: 0,
    successRate: 0,
  };

  const timelineMap = new Map<string, { day: string; sent: number; failed: number; queued: number; total: number }>();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayKey = date.toISOString().slice(0, 10);
    timelineMap.set(dayKey, {
      day: dayKey,
      sent: 0,
      failed: 0,
      queued: 0,
      total: 0,
    });
  }

  for (const row of trendRows) {
    if (row.status === 'queued') trend.queued += 1;
    if (row.status === 'sent') trend.sent += 1;
    if (row.status === 'failed') trend.failed += 1;

    const dayKey = typeof row.created_at === 'string' ? row.created_at.slice(0, 10) : '';
    const dayEntry = timelineMap.get(dayKey);
    if (!dayEntry) {
      continue;
    }

    if (row.status === 'queued') dayEntry.queued += 1;
    if (row.status === 'sent') dayEntry.sent += 1;
    if (row.status === 'failed') dayEntry.failed += 1;
    dayEntry.total += 1;
  }

  const attempts = trend.sent + trend.failed;
  trend.successRate = attempts > 0 ? Number(((trend.sent / attempts) * 100).toFixed(1)) : 0;
  const failureRate = attempts > 0 ? Number(((trend.failed / attempts) * 100).toFixed(1)) : 0;

  return {
    trend,
    attempts,
    failureRate,
    timeline: Array.from(timelineMap.values()),
  };
}
