'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bot,
  Building2,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Printer,
  Calendar,
  QrCode,
  Send,
  Settings,
  ShieldAlert,
  Star,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

import QRCode from 'react-qr-code';
import { supabase } from '@/lib/supabase';
import ChatWidget from '@/components/ChatWidget';
import OnboardingWizard from '@/components/OnboardingWizard';
import CRMTab from '@/components/dashboard/CRMTab';
import BookingsTab from '@/components/dashboard/BookingsTab';
import FollowUpsTab from '@/components/dashboard/FollowUpsTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import AgencyTab from '@/components/dashboard/AgencyTab';
import { PLANS } from '@/lib/plans';
import { Analytics } from '@/lib/analytics';

type CustomFaq = {
  question: string;
  answer: string;
};

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ConversationRecord = {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  lead_captured: boolean;
  lead_contacted?: boolean | null;
  messages: ConversationMessage[] | null;
};

type BusinessRecord = {
  id: string;
  owner_email: string;
  business_name: string;
  business_type?: string | null;
  owner_name?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  widget_color?: string | null;
  widget_position?: string | null;
  welcome_message?: string | null;
  business_hours?: Record<string, { open: string; close: string; closed: boolean }> | null;
  languages?: string[] | null;
  pricing_info?: string | null;
  common_questions_text?: string | null;
  additional_info?: string | null;
  onboarding_complete?: boolean | null;
  plan: 'trial' | 'basic' | 'starter' | 'pro' | 'business';
  plan_expires_at?: string | null;
  customInstructions?: string;
  customFaqs?: CustomFaq[];
};

type DashboardStats = {
  totalConversations: number;
  leadsCaptured: number;
  monthlyConversations: number;
  monthlyMessages: number;
};

type DashboardPayload = {
  business: BusinessRecord | null;
  stats: DashboardStats | null;
  conversations: ConversationRecord[];
  leads: ConversationRecord[];
};

type AutomationSummary = {
  total: number;
  queued: number;
  sent: number;
  failed: number;
};

type AutomationRecentRecord = {
  id: string;
  event_type: 'abandoned_signup' | 'abandoned_payment';
  status: 'queued' | 'sent' | 'failed';
  recipient_email: string | null;
  created_at: string;
  processed_at: string | null;
  last_error?: string | null;
  retry_count?: number | null;
};

type AutomationTrend = {
  windowDays: number;
  sent: number;
  failed: number;
  queued: number;
  successRate: number;
};

type AutomationTimelinePoint = {
  day: string;
  sent: number;
  failed: number;
  queued: number;
  total: number;
};

type AutomationRetryPolicy = {
  maxRetries: number;
  retryWindowHours: number;
};

type AutomationPolicyMap = {
  default: AutomationRetryPolicy;
  abandoned_signup: AutomationRetryPolicy;
  abandoned_payment: AutomationRetryPolicy;
};

type AutomationAlertPolicy = {
  failureRateThreshold: number;
  minAttempts: number;
  cooldownMinutes: number;
  alertEmail: string | null;
  hasWebhook: boolean;
  hasSigningSecret: boolean;
  lastAlertAt: string | null;
};

type AutomationAlertState = {
  attempts: number;
  failureRate: number;
  thresholdMet: boolean;
  cooldownActive: boolean;
  lastAlertAt: string | null;
  alertTriggered: boolean;
  reason: string;
};

type AutomationAlertLog = {
  id: string;
  triggered_by: 'automatic' | 'manual_test';
  event_scope: string;
  failure_rate: number;
  attempts: number;
  sent_webhook: boolean;
  sent_email: boolean;
  webhook_provider: string | null;
  signed_webhook: boolean;
  dispatch_error: string | null;
  created_at: string;
};

type AutomationAlertLogMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  trigger: 'all' | 'automatic' | 'manual_test';
  outcome: 'all' | 'success' | 'failed';
};

type AutomationOverviewResponse = {
  summary?: AutomationSummary;
  trend?: AutomationTrend;
  policy?: AutomationRetryPolicy;
  policies?: AutomationPolicyMap;
  alertPolicy?: AutomationAlertPolicy;
  alertState?: AutomationAlertState;
  alertLogs?: AutomationAlertLog[];
  alertLogsMeta?: AutomationAlertLogMeta;
  timeline?: AutomationTimelinePoint[];
  recent?: AutomationRecentRecord[];
  filter?: {
    eventType: 'abandoned_signup' | 'abandoned_payment' | null;
  };
  queue?: string;
  error?: string;
};

type AutomationEventFilter = 'all' | 'abandoned_signup' | 'abandoned_payment';
type AlertLogTriggerFilter = 'all' | 'automatic' | 'manual_test';
type AlertLogOutcomeFilter = 'all' | 'success' | 'failed';

const DEFAULT_AUTOMATION_POLICY: AutomationRetryPolicy = {
  maxRetries: 3,
  retryWindowHours: 72,
};

const DEFAULT_AUTOMATION_POLICIES: AutomationPolicyMap = {
  default: { ...DEFAULT_AUTOMATION_POLICY },
  abandoned_signup: { ...DEFAULT_AUTOMATION_POLICY },
  abandoned_payment: { ...DEFAULT_AUTOMATION_POLICY },
};

const DEFAULT_ALERT_POLICY: AutomationAlertPolicy = {
  failureRateThreshold: 40,
  minAttempts: 5,
  cooldownMinutes: 60,
  alertEmail: null,
  hasWebhook: false,
  hasSigningSecret: false,
  lastAlertAt: null,
};

const DEFAULT_ALERT_LOG_META: AutomationAlertLogMeta = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
  trigger: 'all',
  outcome: 'all',
};

type BookingRecord = {
  id: string;
  business_id: string;
  session_id: string;
  customer_name: string;
  customer_phone: string;
  pickup_date: string;
  return_date: string;
  car_type: string;
  total_days: number;
  status: 'pending' | 'confirmed' | 'declined';
  created_at: string;
};

type TabKey = 'overview' | 'conversations' | 'leads' | 'crm' | 'bookings' | 'followups' | 'analytics' | 'audit' | 'agency' | 'settings' | 'subscription';

type ToastState = {
  message: string;
  tone: 'success' | 'error';
};

type SettingsFormState = {
  businessName: string;
  businessType: string;
  primaryColor: string;
  aiInstructions: string;
  customFaqs: CustomFaq[];
};

const DASHBOARD_STORAGE_KEY = 'cypai-dashboard-email';
const businessTypeOptions = [
  { value: 'car_rental', label: 'Car Rental' },
  { value: 'barbershop', label: 'Barbershop' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'gym', label: 'Gym' },
  { value: 'other', label: 'Other' },
];

type SidebarPlan = 'trial' | 'starter' | 'pro' | 'business';

const tabItems: Array<{ key: TabKey; label: string; Icon: LucideIcon; plans: SidebarPlan[] }> = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard, plans: ['trial', 'starter', 'pro', 'business'] },
  { key: 'conversations', label: 'Conversations', Icon: MessageSquare, plans: ['trial', 'starter', 'pro', 'business'] },
  { key: 'crm', label: 'CRM & Leads', Icon: Users, plans: ['starter', 'pro', 'business'] },
  { key: 'leads', label: 'Leads', Icon: Users, plans: ['trial', 'starter', 'pro', 'business'] },
  { key: 'bookings', label: 'Bookings', Icon: Calendar, plans: ['starter', 'pro', 'business'] },
  { key: 'followups', label: 'Follow-ups', Icon: Send, plans: ['pro', 'business'] },
  { key: 'analytics', label: 'Analytics', Icon: TrendingUp, plans: ['pro', 'business'] },
  { key: 'audit', label: 'Agent Audit', Icon: ShieldCheck, plans: ['business'] },
  { key: 'agency', label: 'Manage Clients', Icon: Building2, plans: ['business'] },
  { key: 'settings', label: 'Settings', Icon: Settings, plans: ['trial', 'starter', 'pro', 'business'] },
  { key: 'subscription', label: 'Subscription', Icon: CreditCard, plans: ['trial', 'starter', 'pro', 'business'] },
];

const messageLimits: Record<BusinessRecord['plan'], number | null> = {
  trial: 100,
  basic: 500,
  starter: 500,
  pro: null,
  business: null,
};

function emptyPayload(): DashboardPayload {
  return {
    business: null,
    stats: null,
    conversations: [],
    leads: [],
  };
}

function getPlanBadgeClasses(plan: BusinessRecord['plan']) {
  const styles: Record<BusinessRecord['plan'], string> = {
    trial: 'bg-zinc-800 text-zinc-300',
    basic: 'bg-green-100 text-green-700',
    starter: 'bg-green-100 text-green-700',
    pro: 'bg-blue-100 text-blue-700',
    business: 'bg-purple-100 text-purple-700',
  };

  return styles[plan] || styles.trial;
}

function getPlanDisplayName(plan: BusinessRecord['plan']) {
  const names: Record<BusinessRecord['plan'], string> = {
    trial: 'Trial',
    basic: 'Starter',
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
  };

  return names[plan] || 'Trial';
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getConversationPreview(conversation: ConversationRecord) {
  const firstUserMessage = conversation.messages?.find((message) => message.role === 'user');
  return firstUserMessage?.content || conversation.messages?.[0]?.content || 'No messages yet';
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function exportLeadsCsv(leads: ConversationRecord[]) {
  const rows = leads.map((lead) => [
    formatDate(lead.created_at),
    lead.customer_name || 'Unknown',
    lead.customer_phone || '',
    getConversationPreview(lead),
  ]);
  const csv = [
    ['Date', 'Customer Name', 'Phone', 'First Message'].map(escapeCsv).join(','),
    ...rows.map((row) => row.map((value) => escapeCsv(String(value))).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cypai-leads.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function exportAutomationCsv(records: AutomationRecentRecord[]) {
  const rows = records.map((record) => [
    formatDate(record.created_at),
    record.event_type,
    record.status,
    record.recipient_email || '',
    String(record.retry_count || 0),
    record.last_error || '',
  ]);
  const csv = [
    ['Date', 'Event Type', 'Status', 'Recipient Email', 'Retries', 'Last Error'].map(escapeCsv).join(','),
    ...rows.map((row) => row.map((value) => escapeCsv(String(value))).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cypai-automation-recent.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function downloadCsvFile(csv: string, fileName: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="mt-4 h-9 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
          <SkeletonBlock className="h-5 w-32" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="mt-6 h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

function AccessGate({
  email,
  onEmailChange,
  onSubmit,
  loading,
  error,
}: {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_40%),#e2e8f0] px-4"
      data-testid="dashboard-access-gate"
    >
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">CypAI Dashboard</p>
            <h1 className="text-2xl font-extrabold text-white">Enter your business email to access dashboard</h1>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="owner@business.com"
            className="h-12 w-full rounded-2xl border border-zinc-700 px-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking account...' : 'Access Dashboard'}
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>No account found. Sign up first or contact <a href="mailto:cypai.app@cypai.app" className="font-semibold text-blue-700 hover:underline">cypai.app@cypai.app</a></p>
            <Link href="/#pricing" className="mt-2 inline-flex font-semibold text-blue-700 hover:underline">
              View pricing
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className={`fixed right-4 top-4 z-[90] rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
        toast.tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {toast.message}
    </div>
  );
}

function UpgradeCheckoutButtons({
  planId,
  email,
  onSuccess,
  onError,
}: {
  planId: 'starter' | 'pro' | 'business';
  email: string;
  onSuccess: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">Loading PayPal checkout...</div>;
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
      forceReRender={[planId, email]}
      createOrder={async () => {
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, businessEmail: email }),
        });
        const data = (await response.json()) as { id?: string; error?: string };

        if (!response.ok || !data.id) {
          const message = data.error || 'Unable to create PayPal order.';
          onError(message);
          throw new Error(message);
        }

        return data.id;
      }}
      onApprove={async (data) => {
        const response = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderID: data.orderID,
            planId,
            businessEmail: email,
          }),
        });
        const result = (await response.json()) as { success?: boolean; error?: string };

        if (!response.ok || !result.success) {
          onError(result.error || 'Payment failed.');
          return;
        }

        await onSuccess();
      }}
      onError={() => {
        onError('Payment failed. Please try again.');
      }}
    />
  );
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lookupEmail, setLookupEmail] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [dashboard, setDashboard] = useState<DashboardPayload>(emptyPayload);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [updatingLeadIds, setUpdatingLeadIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastState | null>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<'starter' | 'pro' | 'business'>('pro');
  const [paymentError, setPaymentError] = useState('');
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>({
    businessName: '',
    businessType: 'other',
    primaryColor: '#2563eb',
    aiInstructions: '',
    customFaqs: [{ question: '', answer: '' }],
  });

  // ── Audit Tab State ──────────────────────────────────────────────────────
  type AuditFlaggedConv = {
    id: string;
    createdAt: string;
    firstMessage: string;
    flagReason: string;
    safetyScore: number | null;
    reviewed: boolean;
  };
  type AuditSummary = {
    weeklyStats: {
      totalConversations: number;
      flaggedCount: number;
      avgSafetyScore: number | null;
      sensitiveDataIncidents: number;
      safetyTrend: 'improving' | 'declining' | 'stable';
    };
    flaggedConversations: AuditFlaggedConv[];
    topIssues: string[];
    complianceStatus: 'good' | 'warning' | 'critical';
  };
  type AuditReport = {
    businessName: string;
    periodStart: string;
    periodEnd: string;
    totalConversations: number;
    flaggedCount: number;
    avgSafetyScore: number | null;
    sensitiveDataIncidents: number;
    topIssues: string[];
    aiSummary: string;
    incidents: Array<{ id: string; date: string; flagReason: string; safetyScore: number | null }>;
  };

  const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditReviewId, setAuditReviewId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<AuditReport | null>(null);
  const [markingReviewed, setMarkingReviewed] = useState<Set<string>>(new Set());

  // ── QR Code state ────────────────────────────────────────────────────────
  const qrRef = useRef<HTMLDivElement>(null);

  // ── Upgrade lock state ─────────────────────────────────────────────────
  const [upgradeLockTab, setUpgradeLockTab] = useState<TabKey | null>(null);
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = useState(false);

  // ── Broadcast state ──────────────────────────────────────────────────────
  type BroadcastLead = { id: string; name: string; phone: string };
  type BroadcastHistoryItem = {
    id: string;
    message: string;
    sent_to_count: number;
    created_at: string;
  };

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastModal, setBroadcastModal] = useState<BroadcastLead[] | null>(null);
  const [broadcastSentCount, setBroadcastSentCount] = useState(0);
  const [broadcastHistory, setBroadcastHistory] = useState<BroadcastHistoryItem[]>([]);
  const [broadcastHistoryLoading, setBroadcastHistoryLoading] = useState(false);

  // ── Bookings Tab State ───────────────────────────────────────────────────
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsInitialized, setBookingsInitialized] = useState(false);
  const [updatingBookingIds, setUpdatingBookingIds] = useState<Set<string>>(new Set());

  // ── Customer Satisfaction State ──────────────────────────────────────────
  const [satisfactionData, setSatisfactionData] = useState<{
    avgRating: number;
    totalRatings: number;
    distribution: number[]; // index 0 = rating 1 stars … index 4 = rating 5 stars
  } | null>(null);
  const [satisfactionLoading, setSatisfactionLoading] = useState(false);
  const [automationSummary, setAutomationSummary] = useState<AutomationSummary | null>(null);
  const [automationTrend, setAutomationTrend] = useState<AutomationTrend | null>(null);
  const [automationPolicies, setAutomationPolicies] = useState<AutomationPolicyMap>(DEFAULT_AUTOMATION_POLICIES);
  const [retryPolicyForms, setRetryPolicyForms] = useState<AutomationPolicyMap>(DEFAULT_AUTOMATION_POLICIES);
  const [alertPolicy, setAlertPolicy] = useState<AutomationAlertPolicy>(DEFAULT_ALERT_POLICY);
  const [alertState, setAlertState] = useState<AutomationAlertState | null>(null);
  const [alertLogs, setAlertLogs] = useState<AutomationAlertLog[]>([]);
  const [alertLogsMeta, setAlertLogsMeta] = useState<AutomationAlertLogMeta>(DEFAULT_ALERT_LOG_META);
  const [alertLogTriggerFilter, setAlertLogTriggerFilter] = useState<AlertLogTriggerFilter>('all');
  const [alertLogOutcomeFilter, setAlertLogOutcomeFilter] = useState<AlertLogOutcomeFilter>('all');
  const [alertLogPage, setAlertLogPage] = useState(1);
  const [alertPolicyForm, setAlertPolicyForm] = useState({
    failureRateThreshold: DEFAULT_ALERT_POLICY.failureRateThreshold,
    minAttempts: DEFAULT_ALERT_POLICY.minAttempts,
    cooldownMinutes: DEFAULT_ALERT_POLICY.cooldownMinutes,
    alertEmail: '',
    webhookUrl: '',
  });
  const [automationTimeline, setAutomationTimeline] = useState<AutomationTimelinePoint[]>([]);
  const [automationRecent, setAutomationRecent] = useState<AutomationRecentRecord[]>([]);
  const [latestAutomationFailure, setLatestAutomationFailure] = useState<string | null>(null);
  const [latestFailedQueueId, setLatestFailedQueueId] = useState<string | null>(null);
  const [automationEventFilter, setAutomationEventFilter] = useState<AutomationEventFilter>('all');
  const [automationLoading, setAutomationLoading] = useState(false);
  const [retryAutomationLoading, setRetryAutomationLoading] = useState(false);
  const [retryBatchAutomationLoading, setRetryBatchAutomationLoading] = useState(false);
  const [retryRowLoadingIds, setRetryRowLoadingIds] = useState<Set<string>>(new Set());
  const [retryPolicySaving, setRetryPolicySaving] = useState(false);
  const [alertPolicySaving, setAlertPolicySaving] = useState(false);
  const [alertTestLoading, setAlertTestLoading] = useState(false);
  const [alertLogsExporting, setAlertLogsExporting] = useState(false);
  const [automationUnavailable, setAutomationUnavailable] = useState<string | null>(null);
  const hasTrackedInitialTab = useRef(false);

  const business = dashboard.business;
  const stats = dashboard.stats;
  const conversations = dashboard.conversations;
  const leads = dashboard.leads;
  const currentConversation = conversations.find((item) => item.id === selectedConversationId) || null;
  const planLimit = business ? messageLimits[business.plan] : null;
  const currentPlanName = business ? getPlanDisplayName(business.plan) : 'Trial';
  const normalizedPlanKey = business?.plan === 'basic' ? 'starter' : business?.plan;
  const currentPlanPrice = business && business.plan !== 'trial' ? PLANS[normalizedPlanKey || 'pro']?.price || '0.00' : '0.00';
  const widgetCode = useMemo(() => {
    if (!business) {
      return '';
    }

    return `<script src="https://cypai.app/widget.js" data-business-id="${business.id}"></script>`;
  }, [business]);

  const automationLiftInsight = useMemo(() => {
    const daysWithAttempts = automationTimeline.filter((point) => point.sent + point.failed > 0);
    const recovered = automationTimeline.reduce((sum, point) => sum + point.sent, 0);
    const lost = automationTimeline.reduce((sum, point) => sum + point.failed, 0);

    const avgDailyRate =
      daysWithAttempts.length > 0
        ? Number(
            (
              daysWithAttempts.reduce((sum, point) => sum + point.sent / (point.sent + point.failed), 0) /
              daysWithAttempts.length
            *
              100
            ).toFixed(1)
          )
        : 0;

    const bestPoint = automationTimeline.reduce<AutomationTimelinePoint | null>((best, point) => {
      if (!best || point.sent > best.sent) {
        return point;
      }
      return best;
    }, null);

    return {
      recovered,
      lost,
      avgDailyRate,
      bestDay: bestPoint?.day || '-',
      bestDayRecovered: bestPoint?.sent || 0,
    };
  }, [automationTimeline]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const queryEmail = searchParams.get('email');
    const storedEmail = window.localStorage.getItem(DASHBOARD_STORAGE_KEY) || '';
    const initialEmail = (queryEmail || storedEmail).trim().toLowerCase();

    if (!initialEmail) {
      return;
    }

    setLookupEmail(initialEmail);
    void handleAccess(initialEmail, { updateUrl: false });
  }, [searchParams]);

  useEffect(() => {
    if (!business) {
      setBookings([]);
      setBookingsInitialized(false);
      setSatisfactionData(null);
      return;
    }

    setSettingsForm({
      businessName: business.business_name || '',
      businessType: business.business_type || 'other',
      primaryColor: business.widget_color || '#2563eb',
      aiInstructions: business.customInstructions || '',
      customFaqs: business.customFaqs && business.customFaqs.length > 0 ? business.customFaqs : [{ question: '', answer: '' }],
    });

    const eligiblePlan = business.plan === 'trial' || business.plan === 'basic' ? 'starter' : business.plan;
    setSelectedUpgradePlan((eligiblePlan as 'starter' | 'pro' | 'business') || 'pro');

    // Eagerly load bookings so the sidebar badge count is ready on all tabs
    if (!bookingsInitialized && !bookingsLoading) {
      void loadBookings(business.id);
    }
    void loadSatisfaction(business.id);
  }, [business]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (!businessId) {
      setAutomationSummary(null);
      setAutomationTrend(null);
      setAutomationPolicies(DEFAULT_AUTOMATION_POLICIES);
      setRetryPolicyForms(DEFAULT_AUTOMATION_POLICIES);
      setAlertPolicy(DEFAULT_ALERT_POLICY);
      setAlertState(null);
      setAlertLogs([]);
      setAlertLogsMeta(DEFAULT_ALERT_LOG_META);
      setAlertLogTriggerFilter('all');
      setAlertLogOutcomeFilter('all');
      setAlertLogPage(1);
      setAlertPolicyForm({
        failureRateThreshold: DEFAULT_ALERT_POLICY.failureRateThreshold,
        minAttempts: DEFAULT_ALERT_POLICY.minAttempts,
        cooldownMinutes: DEFAULT_ALERT_POLICY.cooldownMinutes,
        alertEmail: '',
        webhookUrl: '',
      });
      setAutomationTimeline([]);
      setAutomationRecent([]);
      setLatestAutomationFailure(null);
      setLatestFailedQueueId(null);
      setAutomationUnavailable(null);
      return;
    }

    void loadAutomationOverview();
  }, [businessId, automationEventFilter, alertLogTriggerFilter, alertLogOutcomeFilter, alertLogPage]);

  useEffect(() => {
    if (activeTab === 'audit' && business && !auditSummary && !auditLoading) {
      void loadAuditSummary();
    }
    if (activeTab === 'leads' && business && broadcastHistory.length === 0 && !broadcastHistoryLoading) {
      void loadBroadcastHistory(business.id);
    }
  }, [activeTab, business]);

  useEffect(() => {
    if (!business) return;
    if (!hasTrackedInitialTab.current) {
      hasTrackedInitialTab.current = true;
      return;
    }
    Analytics.dashboardTabViewed(activeTab);
  }, [activeTab, business]);

  async function loadDashboard(params: { email?: string; businessId?: string }, isAuthLookup = false) {
    if (isAuthLookup) {
      setAuthLoading(true);
    } else {
      setLoading(true);
    }

    setAccessError('');

    try {
      const query = new URLSearchParams();
      if (params.email) {
        query.set('email', params.email);
      }
      if (params.businessId) {
        query.set('businessId', params.businessId);
      }

      const response = await fetch(`/api/business?${query.toString()}`);
      const data = (await response.json()) as DashboardPayload & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load dashboard');
      }

      if (!data.business) {
        setDashboard(emptyPayload());
        setBusinessId('');
        setAccessError('No account found. Sign up first.');
        return;
      }

      setDashboard({
        business: data.business,
        stats: data.stats,
        conversations: data.conversations || [],
        leads: data.leads || [],
      });
      if (isAuthLookup) {
        Analytics.dashboardLogin();
      }
      setBusinessId(data.business.id);
      setSelectedConversationId((data.conversations || [])[0]?.id || null);
      setPaymentError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard';
      setDashboard(emptyPayload());
      setBusinessId('');
      setAccessError(message);
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  }

  async function handleAccess(
    forcedEmail?: string,
    options: { updateUrl?: boolean } = { updateUrl: true }
  ) {
    const normalizedEmail = (forcedEmail || lookupEmail).trim().toLowerCase();
    if (!normalizedEmail) {
      setAccessError('No account found. Sign up first.');
      return;
    }

    window.localStorage.setItem(DASHBOARD_STORAGE_KEY, normalizedEmail);
    if (options.updateUrl !== false) {
      router.replace(`/dashboard?email=${encodeURIComponent(normalizedEmail)}`);
    }
    await loadDashboard({ email: normalizedEmail }, true);
  }

  async function refreshDashboard() {
    if (businessId) {
      await loadDashboard({ businessId });
      return;
    }

    if (lookupEmail) {
      await loadDashboard({ email: lookupEmail });
    }
  }

  async function loadAutomationOverview() {
    setAutomationLoading(true);
    setAutomationUnavailable(null);

    try {
      const query = new URLSearchParams();
      if (automationEventFilter !== 'all') {
        query.set('eventType', automationEventFilter);
      }
      if (alertLogTriggerFilter !== 'all') {
        query.set('alertLogTrigger', alertLogTriggerFilter);
      }
      if (alertLogOutcomeFilter !== 'all') {
        query.set('alertLogOutcome', alertLogOutcomeFilter);
      }
      query.set('alertLogPage', String(alertLogPage));
      query.set('alertLogPageSize', '10');
      const querySuffix = query.toString() ? `?${query.toString()}` : '';
      const response = await fetch(`/api/automation${querySuffix}`, { method: 'GET' });
      const data = (await response.json()) as AutomationOverviewResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load automation status');
      }

      if (data.queue === 'missing_table') {
        setAutomationSummary(null);
        setAutomationTrend(null);
        setAutomationPolicies(DEFAULT_AUTOMATION_POLICIES);
        setRetryPolicyForms(DEFAULT_AUTOMATION_POLICIES);
        setAlertPolicy(DEFAULT_ALERT_POLICY);
        setAlertState(null);
        setAlertLogs([]);
        setAlertLogsMeta(DEFAULT_ALERT_LOG_META);
        setAlertPolicyForm({
          failureRateThreshold: DEFAULT_ALERT_POLICY.failureRateThreshold,
          minAttempts: DEFAULT_ALERT_POLICY.minAttempts,
          cooldownMinutes: DEFAULT_ALERT_POLICY.cooldownMinutes,
          alertEmail: '',
          webhookUrl: '',
        });
        setAutomationTimeline([]);
        setAutomationRecent([]);
        setLatestAutomationFailure(null);
        setLatestFailedQueueId(null);
        setAutomationUnavailable('Automation queue is not initialized yet. Run the latest Supabase schema migration.');
        return;
      }

      setAutomationSummary(data.summary || { total: 0, queued: 0, sent: 0, failed: 0 });
      setAutomationTrend(data.trend || { windowDays: 7, sent: 0, failed: 0, queued: 0, successRate: 0 });
      const policies = data.policies || DEFAULT_AUTOMATION_POLICIES;
      setAutomationPolicies(policies);
      setRetryPolicyForms(policies);
      const nextAlertPolicy = data.alertPolicy || DEFAULT_ALERT_POLICY;
      setAlertPolicy(nextAlertPolicy);
      setAlertState(data.alertState || null);
      setAlertLogs(data.alertLogs || []);
      const nextAlertLogsMeta = data.alertLogsMeta || {
        ...DEFAULT_ALERT_LOG_META,
        trigger: alertLogTriggerFilter,
        outcome: alertLogOutcomeFilter,
        page: alertLogPage,
      };
      setAlertLogsMeta(nextAlertLogsMeta);
      if (nextAlertLogsMeta.page !== alertLogPage) {
        setAlertLogPage(nextAlertLogsMeta.page);
      }
      setAlertPolicyForm((prev) => ({
        ...prev,
        failureRateThreshold: nextAlertPolicy.failureRateThreshold,
        minAttempts: nextAlertPolicy.minAttempts,
        cooldownMinutes: nextAlertPolicy.cooldownMinutes,
        alertEmail: nextAlertPolicy.alertEmail || '',
      }));
      setAutomationTimeline(data.timeline || []);
      setAutomationRecent(data.recent || []);

      const latestFailure = (data.recent || []).find((item) => item.status === 'failed' && item.last_error);
      setLatestAutomationFailure(latestFailure?.last_error || null);
      setLatestFailedQueueId(latestFailure?.id || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load automation status';
      setAutomationSummary(null);
      setAutomationTrend(null);
      setAutomationPolicies(DEFAULT_AUTOMATION_POLICIES);
      setRetryPolicyForms(DEFAULT_AUTOMATION_POLICIES);
      setAlertPolicy(DEFAULT_ALERT_POLICY);
      setAlertState(null);
      setAlertLogs([]);
      setAlertLogsMeta(DEFAULT_ALERT_LOG_META);
      setAutomationTimeline([]);
      setAutomationRecent([]);
      setLatestAutomationFailure(null);
      setLatestFailedQueueId(null);
      setAutomationUnavailable(message);
    } finally {
      setAutomationLoading(false);
    }
  }

  async function retryLatestFailedAutomation() {
    if (!latestFailedQueueId) {
      setToast({ message: 'No failed automation event available to retry.', tone: 'error' });
      return;
    }

    setRetryAutomationLoading(true);
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry_failed', queueId: latestFailedQueueId }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; sent?: boolean; reason?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Retry request failed');
      }

      if (data.sent) {
        setToast({ message: 'Retry succeeded and email was sent.', tone: 'success' });
      } else {
        setToast({ message: `Retry attempted but still failed (${data.reason || 'unknown reason'}).`, tone: 'error' });
      }

      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Retry request failed';
      setToast({ message, tone: 'error' });
    } finally {
      setRetryAutomationLoading(false);
    }
  }

  async function retryAutomationById(queueId: string) {
    setRetryRowLoadingIds((prev) => new Set(prev).add(queueId));
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry_failed', queueId }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; sent?: boolean; reason?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Retry request failed');
      }

      if (data.sent) {
        setToast({ message: 'Retry succeeded and email was sent.', tone: 'success' });
      } else {
        setToast({ message: `Retry attempted but still failed (${data.reason || 'unknown reason'}).`, tone: 'error' });
      }

      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Retry request failed';
      setToast({ message, tone: 'error' });
    } finally {
      setRetryRowLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(queueId);
        return next;
      });
    }
  }

  async function retryFailedBatchAutomation() {
    setRetryBatchAutomationLoading(true);
    try {
      const body: { action: 'retry_failed_batch'; limit: number; eventType?: 'abandoned_signup' | 'abandoned_payment' } = {
        action: 'retry_failed_batch',
        limit: 5,
      };
      if (automationEventFilter !== 'all') {
        body.eventType = automationEventFilter;
      }

      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; attempted?: number; sent?: number; failed?: number };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Batch retry failed');
      }

      setToast({
        message: `Batch retry complete: ${data.sent || 0} sent, ${data.failed || 0} failed, ${data.attempted || 0} attempted.`,
        tone: (data.failed || 0) > 0 ? 'error' : 'success',
      });
      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Batch retry failed';
      setToast({ message, tone: 'error' });
    } finally {
      setRetryBatchAutomationLoading(false);
    }
  }

  function handleExportAutomationCsv() {
    if (automationRecent.length === 0) {
      setToast({ message: 'No automation records to export yet.', tone: 'error' });
      return;
    }

    exportAutomationCsv(automationRecent);
    setToast({ message: 'Automation CSV exported.', tone: 'success' });
  }

  async function handleExportAlertLogsCsv() {
    setAlertLogsExporting(true);
    try {
      const query = new URLSearchParams();
      if (alertLogTriggerFilter !== 'all') {
        query.set('alertLogTrigger', alertLogTriggerFilter);
      }
      if (alertLogOutcomeFilter !== 'all') {
        query.set('alertLogOutcome', alertLogOutcomeFilter);
      }
      query.set('alertLogsExport', 'csv');

      const response = await fetch(`/api/automation?${query.toString()}`, { method: 'GET' });
      if (!response.ok) {
        const fallback = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(fallback?.error || 'Failed to export alert logs');
      }

      const csvText = await response.text();
      const fileName = `cypai-alert-logs-${alertLogTriggerFilter}-${alertLogOutcomeFilter}.csv`;
      downloadCsvFile(csvText, fileName);
      setToast({ message: 'Alert log CSV exported.', tone: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export alert logs';
      setToast({ message, tone: 'error' });
    } finally {
      setAlertLogsExporting(false);
    }
  }

  async function saveRetryPolicy(eventType: 'abandoned_signup' | 'abandoned_payment') {
    const form = retryPolicyForms[eventType];
    setRetryPolicySaving(true);
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_retry_policy',
          eventType,
          maxRetries: form.maxRetries,
          retryWindowHours: form.retryWindowHours,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        eventType?: 'abandoned_signup' | 'abandoned_payment' | null;
        policy?: AutomationRetryPolicy;
      };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to save retry policy');
      }

      const updatedPolicy = data.policy || form;
      setAutomationPolicies((prev) => ({
        ...prev,
        [eventType]: updatedPolicy,
      }));
      setRetryPolicyForms((prev) => ({
        ...prev,
        [eventType]: updatedPolicy,
      }));
      setToast({ message: 'Retry policy saved.', tone: 'success' });
      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save retry policy';
      setToast({ message, tone: 'error' });
    } finally {
      setRetryPolicySaving(false);
    }
  }

  async function saveAlertPolicy() {
    setAlertPolicySaving(true);
    try {
      const payload: {
        action: 'set_alert_policy';
        failureRateThreshold: number;
        minAttempts: number;
        cooldownMinutes: number;
        alertEmail: string;
        webhookUrl?: string;
      } = {
        action: 'set_alert_policy',
        failureRateThreshold: Number(alertPolicyForm.failureRateThreshold || DEFAULT_ALERT_POLICY.failureRateThreshold),
        minAttempts: Number(alertPolicyForm.minAttempts || DEFAULT_ALERT_POLICY.minAttempts),
        cooldownMinutes: Number(alertPolicyForm.cooldownMinutes || DEFAULT_ALERT_POLICY.cooldownMinutes),
        alertEmail: alertPolicyForm.alertEmail,
      };

      if (alertPolicyForm.webhookUrl.trim().length > 0) {
        payload.webhookUrl = alertPolicyForm.webhookUrl.trim();
      }

      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; policy?: AutomationAlertPolicy };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to save alert policy');
      }

      const updated = data.policy || DEFAULT_ALERT_POLICY;
      setAlertPolicy(updated);
      setAlertPolicyForm((prev) => ({ ...prev, webhookUrl: '' }));
      setToast({ message: 'Alert policy saved.', tone: 'success' });
      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save alert policy';
      setToast({ message, tone: 'error' });
    } finally {
      setAlertPolicySaving(false);
    }
  }

  async function testAlertHooks() {
    setAlertTestLoading(true);
    try {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_alert', eventType: automationEventFilter === 'all' ? undefined : automationEventFilter }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string; result?: { sentWebhook?: boolean; sentEmail?: boolean; error?: string } };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send test alert');
      }

      const sentWebhook = Boolean(data.result?.sentWebhook);
      const sentEmail = Boolean(data.result?.sentEmail);
      if (sentWebhook || sentEmail) {
        setToast({ message: `Test alert sent (${sentWebhook ? 'webhook ' : ''}${sentEmail ? 'email' : ''}).`.trim(), tone: 'success' });
      } else {
        setToast({ message: `Test alert did not dispatch (${data.result?.error || 'no configured destinations'}).`, tone: 'error' });
      }

      await loadAutomationOverview();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send test alert';
      setToast({ message, tone: 'error' });
    } finally {
      setAlertTestLoading(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(DASHBOARD_STORAGE_KEY);
    setDashboard(emptyPayload());
    setLookupEmail('');
    setBusinessId('');
    router.push('/');
  }

  async function handleCopyWidgetCode() {
    if (!widgetCode) {
      return;
    }

    await navigator.clipboard.writeText(widgetCode);
    setToast({ message: 'Copied to clipboard!', tone: 'success' });
  }

  async function handleDownloadQR() {
    if (!qrRef.current || !business) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(qrRef.current, { backgroundColor: '#ffffff', scale: 3 });
    const link = document.createElement('a');
    link.download = `cypai-qr-${business.business_name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function handlePrintQR() {
    if (!qrRef.current || !business) return;
    const svgEl = qrRef.current.querySelector('svg');
    const svgData = svgEl ? new XMLSerializer().serializeToString(svgEl) : '';
    const win = window.open('', '_blank', 'width=480,height=600');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>QR Code – ${business.business_name}</title><style>
      body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#fff;padding:32px;box-sizing:border-box}
      svg{width:200px;height:200px}
      h2{margin:16px 0 4px;font-size:18px;color:#0f172a}
      p{margin:0;font-size:13px;color:#64748b}
      @media print{button{display:none}}
      button{margin-top:20px;padding:8px 20px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer}
    </style></head><body>
      ${svgData}
      <h2>${business.business_name}</h2>
      <p>Scan to chat with our AI assistant</p>
      <button onclick="window.print()">Print</button>
    </body></html>`);
    win.document.close();
  }

  async function loadBroadcastHistory(businessId: string) {
    setBroadcastHistoryLoading(true);
    try {
      const { data } = await supabase
        .from('broadcasts')
        .select('id, message, sent_to_count, created_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(5);
      setBroadcastHistory((data as BroadcastHistoryItem[]) ?? []);
    } catch {
      // non-critical, just leave history empty
    } finally {
      setBroadcastHistoryLoading(false);
    }
  }

  async function loadBookings(bId: string) {
    setBookingsLoading(true);
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', bId)
        .order('created_at', { ascending: false })
        .limit(50);
      setBookings((data as BookingRecord[]) ?? []);
    } catch {
      // silently fail
    } finally {
      setBookingsLoading(false);
      setBookingsInitialized(true);
    }
  }

  async function loadSatisfaction(bId: string) {
    setSatisfactionLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { data } = await supabase
        .from('conversations')
        .select('customer_rating')
        .eq('business_id', bId)
        .not('customer_rating', 'is', null)
        .gte('created_at', startOfMonth);
      if (!data || data.length === 0) {
        setSatisfactionData(null);
      } else {
        const ratings = (data as { customer_rating: number }[]).map((r) => r.customer_rating);
        const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        const distribution = [1, 2, 3, 4, 5].map((r) => ratings.filter((v) => v === r).length);
        setSatisfactionData({
          avgRating: Math.round(avg * 10) / 10,
          totalRatings: ratings.length,
          distribution,
        });
      }
    } catch {
      // silently fail
    } finally {
      setSatisfactionLoading(false);
    }
  }

  async function handleConfirmBooking(id: string) {
    setUpdatingBookingIds((s) => new Set(s).add(id));
    try {
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'confirmed' as const } : b))
      );
      setToast({ message: 'Booking confirmed! Opening WhatsApp…', tone: 'success' });
    } catch {
      setToast({ message: 'Failed to confirm booking.', tone: 'error' });
    } finally {
      setUpdatingBookingIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  }

  async function handleDeclineBooking(id: string) {
    setUpdatingBookingIds((s) => new Set(s).add(id));
    try {
      await supabase.from('bookings').update({ status: 'declined' }).eq('id', id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'declined' as const } : b))
      );
      setToast({ message: 'Booking declined. Opening WhatsApp…', tone: 'success' });
    } catch {
      setToast({ message: 'Failed to decline booking.', tone: 'error' });
    } finally {
      setUpdatingBookingIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  }

  async function handleBroadcast() {
    if (!business || !broadcastMessage.trim()) return;
    setBroadcastSending(true);
    try {
      const { data } = await supabase
        .from('conversations')
        .select('id, customer_name, customer_phone')
        .eq('business_id', business.id)
        .eq('lead_captured', true)
        .not('customer_phone', 'is', null);

      const eligibleLeads: BroadcastLead[] = ((data ?? []) as Array<{
        id: string;
        customer_name: string | null;
        customer_phone: string | null;
      }>)
        .filter((r) => r.customer_phone)
        .map((r) => ({
          id: r.id,
          name: r.customer_name ?? 'Unknown',
          phone: r.customer_phone!,
        }));

      if (eligibleLeads.length === 0) {
        setToast({ message: 'No leads with phone numbers found.', tone: 'error' });
        return;
      }

      // Save to broadcasts table
      await supabase.from('broadcasts').insert({
        business_id: business.id,
        message: broadcastMessage.trim(),
        sent_to_count: eligibleLeads.length,
      });

      setBroadcastModal(eligibleLeads);
      setBroadcastSentCount(0);
      void loadBroadcastHistory(business.id);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Broadcast failed', tone: 'error' });
    } finally {
      setBroadcastSending(false);
    }
  }

  async function handleLeadContacted(leadId: string, nextValue: boolean) {
    if (!business) {
      return;
    }

    setUpdatingLeadIds((current) => new Set(current).add(leadId));

    const previousDashboard = dashboard;
    setDashboard((current) => ({
      ...current,
      conversations: current.conversations.map((conversation) =>
        conversation.id === leadId ? { ...conversation, lead_contacted: nextValue } : conversation
      ),
      leads: current.leads.map((lead) =>
        lead.id === leadId ? { ...lead, lead_contacted: nextValue } : lead
      ),
    }));

    try {
      const response = await fetch(`/api/conversations/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          leadContacted: nextValue,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update lead');
      }

      setToast({
        message: nextValue ? 'Lead marked as contacted.' : 'Lead marked as not contacted.',
        tone: 'success',
      });
    } catch (error) {
      setDashboard(previousDashboard);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to update lead',
        tone: 'error',
      });
    } finally {
      setUpdatingLeadIds((current) => {
        const next = new Set(current);
        next.delete(leadId);
        return next;
      });
    }
  }

  async function handleSaveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!business) {
      return;
    }

    setSaveLoading(true);

    try {
      const response = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          businessName: settingsForm.businessName,
          businessType: settingsForm.businessType,
          widgetColor: settingsForm.primaryColor,
          customInstructions: settingsForm.aiInstructions,
          customFaqs: settingsForm.customFaqs.filter((faq) => faq.question.trim() || faq.answer.trim()),
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      await refreshDashboard();
      setToast({ message: 'Settings saved successfully!', tone: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Failed to save settings',
        tone: 'error',
      });
    } finally {
      setSaveLoading(false);
    }
  }

  function updateFaq(index: number, field: keyof CustomFaq, value: string) {
    setSettingsForm((current) => ({
      ...current,
      customFaqs: current.customFaqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq
      ),
    }));
  }

  function addFaq() {
    setSettingsForm((current) => ({
      ...current,
      customFaqs: [...current.customFaqs, { question: '', answer: '' }],
    }));
  }

  function removeFaq(index: number) {
    setSettingsForm((current) => ({
      ...current,
      customFaqs:
        current.customFaqs.length === 1
          ? [{ question: '', answer: '' }]
          : current.customFaqs.filter((_, faqIndex) => faqIndex !== index),
    }));
  }

  // ── Audit handlers ───────────────────────────────────────────────────────
  async function loadAuditSummary() {
    if (!business) return;
    setAuditLoading(true);
    setAuditError('');
    try {
      const res = await fetch(`/api/audit/summary?businessId=${business.id}`);
      const data = await res.json() as AuditSummary & { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to load audit');
      setAuditSummary(data);
    } catch (err) {
      setAuditError(err instanceof Error ? err.message : 'Failed to load audit summary');
    } finally {
      setAuditLoading(false);
    }
  }

  async function handleGenerateReport() {
    if (!business) return;
    setReportLoading(true);
    setReportData(null);
    try {
      const res = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id }),
      });
      const data = await res.json() as AuditReport & { error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setReportData(data);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Report generation failed', tone: 'error' });
    } finally {
      setReportLoading(false);
    }
  }

  async function handleMarkReviewed(convId: string) {
    setMarkingReviewed((s) => new Set(s).add(convId));
    try {
      const { supabase: sb } = await import('@/lib/supabase');
      await sb.from('conversations').update({ audit_reviewed: true, audit_reviewed_at: new Date().toISOString() }).eq('id', convId);
      setAuditSummary((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          flaggedConversations: prev.flaggedConversations.map((c) =>
            c.id === convId ? { ...c, reviewed: true } : c
          ),
        };
      });
      setToast({ message: 'Marked as reviewed.', tone: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to mark reviewed', tone: 'error' });
    } finally {
      setMarkingReviewed((s) => { const next = new Set(s); next.delete(convId); return next; });
    }
  }

  if (!business) {
    return (
      <>
        <AccessGate
          email={lookupEmail}
          onEmailChange={setLookupEmail}
          onSubmit={() => {
            void handleAccess();
          }}
          loading={authLoading}
          error={accessError}
        />
        {toast ? <Toast toast={toast} /> : null}
      </>
    );
  }

  const usageValue = stats?.monthlyMessages ?? 0;
  const usageWidth = planLimit ? Math.min(100, (usageValue / planLimit) * 100) : Math.min(100, usageValue / 10);
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const newLeadsCount = leads.filter((l) => new Date(l.created_at).getTime() > oneDayAgo).length;

  const reviewedConv = auditSummary?.flaggedConversations.find((c) => c.id === auditReviewId) ?? null;
  const chartBase = auditSummary?.weeklyStats.avgSafetyScore ?? 75;
  const chartTrend = auditSummary?.weeklyStats.safetyTrend ?? 'stable';
  const chartLineColor = chartTrend === 'improving' ? '#10b981' : chartTrend === 'declining' ? '#ef4444' : '#3b82f6';
  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    score: Math.min(100, Math.max(0, Math.round(chartBase + (chartTrend === 'improving' ? (i - 3) * 1.5 : chartTrend === 'declining' ? (3 - i) * 1.5 : 0) + Math.sin(i) * 2))),
  }));
  const showOnboardingWizard = Boolean(business && business.onboarding_complete !== true && !onboardingDismissed);
  const mobileTabs: Array<{ id: TabKey; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'conversations', label: 'Chats', icon: '💬' },
    { id: 'crm', label: 'CRM', icon: '👥' },
    { id: 'bookings', label: 'Book', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 lg:flex"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}
    >
      {toast ? <Toast toast={toast} /> : null}
      {showOnboardingWizard && business ? (
        <OnboardingWizard
          business={business}
          onComplete={async () => {
            setOnboardingDismissed(true);
            await refreshDashboard();
            setToast({ message: 'Onboarding complete! Your dashboard is ready.', tone: 'success' });
          }}
        />
      ) : null}

      {isTabletSidebarOpen ? (
        <div className="fixed inset-0 z-50 hidden md:block lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsTabletSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <aside className="relative h-full w-72 border-r border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl">
            <div className="flex h-20 items-center justify-between px-6 text-xl font-black tracking-tight">
              CypAI
              <button
                type="button"
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={() => setIsTabletSidebarOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-1 overflow-y-auto px-4 py-4">
              {tabItems.map(({ key, label, Icon, plans }) => {
                const active = activeTab === key;
                const normalizedPlan: SidebarPlan =
                  business.plan === 'basic' ? 'starter' : (business.plan as SidebarPlan);
                const isLocked = !plans.includes(normalizedPlan);

                return (
                  <button
                    key={`tablet-${key}`}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        setUpgradeLockTab(key);
                      } else {
                        setActiveTab(key);
                        setIsTabletSidebarOpen(false);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-black text-white'
                        : isLocked
                          ? 'text-zinc-500 hover:bg-zinc-950'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-100 lg:flex">
        <div className="flex h-20 items-center px-6 text-xl font-black tracking-tight">CypAI</div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {tabItems.map(({ key, label, Icon, plans }) => {
            const active = activeTab === key;
            const normalizedPlan: SidebarPlan =
              business.plan === 'basic' ? 'starter' : (business.plan as SidebarPlan);
            const isLocked = !plans.includes(normalizedPlan);

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    setUpgradeLockTab(key);
                  } else {
                    setActiveTab(key);
                  }
                }}
                data-testid={`dashboard-tab-${key}`}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? 'bg-black text-white'
                    : isLocked
                      ? 'text-zinc-500 hover:bg-zinc-950'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                <span className="relative inline-flex">
                  <Icon className="h-4 w-4" />
                  {isLocked && (
                    <span className="absolute -right-2 -top-2 text-[9px] leading-none">🔒</span>
                  )}
                  {!isLocked && key === 'bookings' && pendingBookingsCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                      {pendingBookingsCount}
                    </span>
                  )}
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-zinc-800" />

        <div className="p-4">
          <p className="mb-2 truncate px-4 text-xs font-medium text-zinc-500">{business?.owner_email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden rounded-full border border-zinc-800 px-3 py-1.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950 md:inline-flex lg:hidden"
                  onClick={() => setIsTabletSidebarOpen(true)}
                >
                  Menu
                </button>
                <h1 className="text-3xl font-black leading-none tracking-tight text-zinc-100">
                  Welcome back, {business?.business_name || 'CypAI'} 👋
                </h1>
                <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${getPlanBadgeClasses(business.plan)}`}>
                  {currentPlanName}
                </span>
                {(business.plan === 'trial' || business.plan === 'starter' || business.plan === 'basic') ? (
                  <Link href="/#pricing" className="hidden text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-100 sm:inline-flex">
                    Upgrade ↑
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 sm:inline-flex">
                {business?.owner_email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950 lg:hidden"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:pb-8">
          {loading ? <DashboardSkeleton /> : null}

          {!loading && business ? (
            <div className="space-y-6 pb-24 lg:pb-0">
              {activeTab === 'overview' ? (
                <section className="space-y-6">
                  <div data-testid="dashboard-overview-panel" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Conversations" value={String(stats?.totalConversations ?? 0)} />
                    <StatCard label="Leads Captured" value={String(stats?.leadsCaptured ?? 0)} />
                    <StatCard label="This Month's Messages" value={String(stats?.monthlyMessages ?? 0)} />
                    <StatCard
                      label="Current Plan"
                      value={currentPlanName}
                      badgeClassName={getPlanBadgeClasses(business.plan)}
                    />
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-white">Recovery Automation</h2>
                        <p className="mt-1 text-sm text-zinc-500">Abandoned signup and payment follow-up delivery status.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void loadAutomationOverview()}
                          className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-950"
                        >
                          Refresh
                        </button>
                        <button
                          type="button"
                          onClick={() => void retryLatestFailedAutomation()}
                          disabled={!latestFailedQueueId || retryAutomationLoading}
                          className="rounded-full border border-rose-700/50 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {retryAutomationLoading ? 'Retrying...' : 'Retry Latest Failed'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void retryFailedBatchAutomation()}
                          disabled={retryBatchAutomationLoading}
                          className="rounded-full border border-emerald-700/50 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {retryBatchAutomationLoading ? 'Retrying Batch...' : 'Retry 5 Failed'}
                        </button>
                        <button
                          type="button"
                          onClick={handleExportAutomationCsv}
                          disabled={automationLoading || automationRecent.length === 0}
                          className="rounded-full border border-zinc-600 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {[
                        { value: 'all', label: 'All Events' },
                        { value: 'abandoned_signup', label: 'Signups' },
                        { value: 'abandoned_payment', label: 'Payments' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setAutomationEventFilter(option.value as AutomationEventFilter)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            automationEventFilter === option.value
                              ? 'border-zinc-400 bg-zinc-100 text-zinc-900'
                              : 'border-zinc-700 text-zinc-300 hover:bg-zinc-950'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Per-event retry policies</p>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {[
                          { key: 'abandoned_signup' as const, label: 'Signup Recovery' },
                          { key: 'abandoned_payment' as const, label: 'Payment Recovery' },
                        ].map((policyItem) => (
                          <div key={policyItem.key} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <p className="mb-2 text-sm font-semibold text-zinc-100">{policyItem.label}</p>
                            <div className="flex flex-wrap items-end gap-2">
                              <label className="flex min-w-[120px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                Max Retries
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={retryPolicyForms[policyItem.key].maxRetries}
                                  onChange={(event) =>
                                    setRetryPolicyForms((prev) => ({
                                      ...prev,
                                      [policyItem.key]: {
                                        ...prev[policyItem.key],
                                        maxRetries: Number(event.target.value || 1),
                                      },
                                    }))
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                                />
                              </label>
                              <label className="flex min-w-[140px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                                Window (Hours)
                                <input
                                  type="number"
                                  min={1}
                                  max={168}
                                  value={retryPolicyForms[policyItem.key].retryWindowHours}
                                  onChange={(event) =>
                                    setRetryPolicyForms((prev) => ({
                                      ...prev,
                                      [policyItem.key]: {
                                        ...prev[policyItem.key],
                                        retryWindowHours: Number(event.target.value || 1),
                                      },
                                    }))
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => void saveRetryPolicy(policyItem.key)}
                                disabled={retryPolicySaving}
                                className="rounded-full border border-blue-700/50 px-3 py-1.5 text-xs font-semibold text-blue-200 transition hover:bg-blue-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {retryPolicySaving ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                            <p className="mt-2 text-xs text-zinc-500">
                              Current: {automationPolicies[policyItem.key].maxRetries} retries / {automationPolicies[policyItem.key].retryWindowHours}h
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">
                        Fallback default policy: {automationPolicies.default.maxRetries} retries within {automationPolicies.default.retryWindowHours}h.
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Failure spike alerting</p>
                      <div className="grid gap-3 lg:grid-cols-2">
                        <label className="flex min-w-[120px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Failure Threshold (%)
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={alertPolicyForm.failureRateThreshold}
                            onChange={(event) =>
                              setAlertPolicyForm((prev) => ({
                                ...prev,
                                failureRateThreshold: Number(event.target.value || 1),
                              }))
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                          />
                        </label>
                        <label className="flex min-w-[120px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Min Attempts
                          <input
                            type="number"
                            min={1}
                            max={1000}
                            value={alertPolicyForm.minAttempts}
                            onChange={(event) =>
                              setAlertPolicyForm((prev) => ({
                                ...prev,
                                minAttempts: Number(event.target.value || 1),
                              }))
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                          />
                        </label>
                        <label className="flex min-w-[120px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Cooldown (Minutes)
                          <input
                            type="number"
                            min={1}
                            max={1440}
                            value={alertPolicyForm.cooldownMinutes}
                            onChange={(event) =>
                              setAlertPolicyForm((prev) => ({
                                ...prev,
                                cooldownMinutes: Number(event.target.value || 1),
                              }))
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                          />
                        </label>
                        <label className="flex min-w-[160px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Alert Email
                          <input
                            type="email"
                            value={alertPolicyForm.alertEmail}
                            onChange={(event) =>
                              setAlertPolicyForm((prev) => ({
                                ...prev,
                                alertEmail: event.target.value,
                              }))
                            }
                            placeholder="owner@yourdomain.com"
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                          />
                        </label>
                      </div>
                      <label className="mt-3 flex min-w-[220px] flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Webhook URL (optional)
                        <input
                          type="url"
                          value={alertPolicyForm.webhookUrl}
                          onChange={(event) =>
                            setAlertPolicyForm((prev) => ({
                              ...prev,
                              webhookUrl: event.target.value,
                            }))
                          }
                          placeholder={alertPolicy.hasWebhook ? 'Webhook already configured; enter new URL to replace' : 'https://hooks.example.com/...'}
                          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100"
                        />
                      </label>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void saveAlertPolicy()}
                          disabled={alertPolicySaving}
                          className="rounded-full border border-amber-700/50 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {alertPolicySaving ? 'Saving...' : 'Save Alert Policy'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void testAlertHooks()}
                          disabled={alertTestLoading}
                          className="rounded-full border border-indigo-700/50 px-3 py-1.5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {alertTestLoading ? 'Sending Test...' : 'Send Test Alert'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleExportAlertLogsCsv()}
                          disabled={alertLogsExporting}
                          className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {alertLogsExporting ? 'Exporting...' : 'Export Alert Logs CSV'}
                        </button>
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">
                        Status: failure rate {alertState?.failureRate ?? 0}% across {alertState?.attempts ?? 0} attempts; cooldown {alertState?.cooldownActive ? 'active' : 'inactive'}.
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Last alert: {formatDateTime(alertPolicy.lastAlertAt)} | Destination webhook: {alertPolicy.hasWebhook ? 'configured' : 'not configured'} | signed webhook: {alertPolicy.hasSigningSecret ? 'enabled' : 'disabled'} | email: {alertPolicy.alertEmail || 'not configured'}
                      </p>

                      <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800">
                        <div className="border-b border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Recent alert deliveries
                        </div>
                        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2 text-xs">
                          {[{ value: 'all', label: 'All Triggers' }, { value: 'automatic', label: 'Automatic' }, { value: 'manual_test', label: 'Manual Tests' }].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAlertLogTriggerFilter(option.value as AlertLogTriggerFilter);
                                setAlertLogPage(1);
                              }}
                              className={`rounded-full border px-2.5 py-1 font-semibold transition ${
                                alertLogTriggerFilter === option.value
                                  ? 'border-zinc-500 bg-zinc-100 text-zinc-900'
                                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-950'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                          {[{ value: 'all', label: 'All Outcomes' }, { value: 'success', label: 'Delivered' }, { value: 'failed', label: 'Failed' }].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAlertLogOutcomeFilter(option.value as AlertLogOutcomeFilter);
                                setAlertLogPage(1);
                              }}
                              className={`rounded-full border px-2.5 py-1 font-semibold transition ${
                                alertLogOutcomeFilter === option.value
                                  ? 'border-emerald-500/70 bg-emerald-100 text-emerald-900'
                                  : 'border-zinc-700 text-zinc-300 hover:bg-zinc-950'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {alertLogs.length === 0 ? (
                          <p className="px-3 py-3 text-xs text-zinc-500">No alert dispatch logs yet.</p>
                        ) : (
                          <div className="max-h-56 overflow-auto">
                            <table className="min-w-full text-left text-xs text-zinc-300">
                              <thead className="bg-zinc-950/80 text-zinc-500">
                                <tr>
                                  <th className="px-3 py-2 font-semibold">When</th>
                                  <th className="px-3 py-2 font-semibold">Trigger</th>
                                  <th className="px-3 py-2 font-semibold">Scope</th>
                                  <th className="px-3 py-2 font-semibold">Rate</th>
                                  <th className="px-3 py-2 font-semibold">Delivery</th>
                                  <th className="px-3 py-2 font-semibold">Error</th>
                                </tr>
                              </thead>
                              <tbody>
                                {alertLogs.map((log) => (
                                  <tr key={log.id} className="border-t border-zinc-800/70">
                                    <td className="px-3 py-2 text-zinc-400">{formatDateTime(log.created_at)}</td>
                                    <td className="px-3 py-2">{log.triggered_by === 'manual_test' ? 'Manual test' : 'Automatic'}</td>
                                    <td className="px-3 py-2">{log.event_scope}</td>
                                    <td className="px-3 py-2">{Number(log.failure_rate || 0).toFixed(1)}% ({log.attempts})</td>
                                    <td className="px-3 py-2">
                                      {(log.sent_webhook ? 'Webhook ' : '') + (log.sent_email ? 'Email' : '') || 'None'}
                                      {log.webhook_provider ? ` (${log.webhook_provider})` : ''}
                                    </td>
                                    <td className="max-w-[240px] truncate px-3 py-2 text-rose-300">{log.dispatch_error || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-2 text-xs text-zinc-400">
                          <span>
                            Page {alertLogsMeta.page} of {Math.max(1, alertLogsMeta.totalPages)} ({alertLogsMeta.total} records)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAlertLogPage((prev) => Math.max(1, prev - 1))}
                              disabled={automationLoading || alertLogsMeta.page <= 1}
                              className="rounded-full border border-zinc-700 px-2.5 py-1 font-semibold text-zinc-300 transition hover:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Prev
                            </button>
                            <button
                              type="button"
                              onClick={() => setAlertLogPage((prev) => Math.min(alertLogsMeta.totalPages || 1, prev + 1))}
                              disabled={automationLoading || alertLogsMeta.page >= alertLogsMeta.totalPages}
                              className="rounded-full border border-zinc-700 px-2.5 py-1 font-semibold text-zinc-300 transition hover:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {automationLoading ? (
                      <div className="mt-5 text-sm text-zinc-400">Loading automation status...</div>
                    ) : automationUnavailable ? (
                      <div className="mt-5 rounded-2xl border border-amber-800/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
                        {automationUnavailable}
                      </div>
                    ) : (
                      <>
                        <div className="mt-5 grid gap-3 sm:grid-cols-4">
                          <MiniMetric label="Queued" value={automationSummary?.queued ?? 0} tone="neutral" />
                          <MiniMetric label="Sent" value={automationSummary?.sent ?? 0} tone="success" />
                          <MiniMetric label="Failed" value={automationSummary?.failed ?? 0} tone="error" />
                          <MiniMetric label="Recent" value={automationSummary?.total ?? 0} tone="neutral" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-emerald-300">
                          7d success rate: {automationTrend?.successRate ?? 0}%
                        </p>
                        <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">7d delivery timeline</p>
                            <div className="h-36 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={automationTimeline.map((point) => ({
                                    ...point,
                                    dayLabel: point.day.slice(5),
                                  }))}
                                  margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
                                >
                                  <XAxis dataKey="dayLabel" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                                  <YAxis hide domain={[0, 'auto']} />
                                  <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 12 }}
                                    labelStyle={{ color: '#e4e4e7' }}
                                  />
                                  <Line type="monotone" dataKey="sent" stroke="#34d399" strokeWidth={2} dot={false} />
                                  <Line type="monotone" dataKey="failed" stroke="#fb7185" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Conversion Lift</p>
                            <div className="space-y-2 text-sm text-zinc-300">
                              <p>Recovered (7d): <span className="font-semibold text-emerald-300">{automationLiftInsight.recovered}</span></p>
                              <p>Lost (7d): <span className="font-semibold text-rose-300">{automationLiftInsight.lost}</span></p>
                              <p>Avg daily rate: <span className="font-semibold text-emerald-300">{automationLiftInsight.avgDailyRate}%</span></p>
                              <p>Best day: <span className="font-semibold text-zinc-100">{automationLiftInsight.bestDay}</span></p>
                              <p>Best day recovered: <span className="font-semibold text-emerald-300">{automationLiftInsight.bestDayRecovered}</span></p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                          Latest failure: {latestAutomationFailure || 'No recent failures'}
                        </p>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800">
                          <div className="border-b border-zinc-800 bg-zinc-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Recent automation activity (last 25)
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-xs text-zinc-300">
                              <thead className="bg-zinc-950 text-zinc-500">
                                <tr>
                                  <th className="px-3 py-2 font-semibold">Created</th>
                                  <th className="px-3 py-2 font-semibold">Event</th>
                                  <th className="px-3 py-2 font-semibold">Status</th>
                                  <th className="px-3 py-2 font-semibold">Recipient</th>
                                  <th className="px-3 py-2 font-semibold">Retries</th>
                                  <th className="px-3 py-2 font-semibold">Last Error</th>
                                  <th className="px-3 py-2 font-semibold">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-800">
                                {automationRecent.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="px-3 py-4 text-center text-zinc-500">
                                      No recent automation records for this filter.
                                    </td>
                                  </tr>
                                ) : (
                                  automationRecent.map((row) => (
                                    <tr key={row.id} className="bg-zinc-900/60">
                                      <td className="px-3 py-2">{formatDateTime(row.created_at)}</td>
                                      <td className="px-3 py-2">{row.event_type === 'abandoned_signup' ? 'Signup' : 'Payment'}</td>
                                      <td className="px-3 py-2">
                                        <span
                                          className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${
                                            row.status === 'sent'
                                              ? 'bg-emerald-900/40 text-emerald-200'
                                              : row.status === 'failed'
                                                ? 'bg-rose-900/40 text-rose-200'
                                                : 'bg-zinc-800 text-zinc-300'
                                          }`}
                                        >
                                          {row.status}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2">{row.recipient_email || '-'}</td>
                                      <td className="px-3 py-2">{row.retry_count || 0}</td>
                                      <td className="max-w-[240px] truncate px-3 py-2 text-zinc-500" title={row.last_error || ''}>
                                        {row.last_error || '-'}
                                      </td>
                                      <td className="px-3 py-2">
                                        <button
                                          type="button"
                                          onClick={() => void retryAutomationById(row.id)}
                                          disabled={row.status !== 'failed' || retryRowLoadingIds.has(row.id)}
                                          className="rounded-full border border-zinc-700 px-2.5 py-1 font-semibold text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          {retryRowLoadingIds.has(row.id) ? 'Retrying...' : 'Retry'}
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Customer Satisfaction */}
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                        <h2 className="text-lg font-bold text-white">Customer Satisfaction</h2>
                      </div>
                      <span className="text-sm text-zinc-500">This month</span>
                    </div>

                    {satisfactionLoading ? (
                      <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-400" />
                        Loading ratings…
                      </div>
                    ) : !satisfactionData ? (
                      <div className="mt-6 rounded-2xl bg-zinc-950 px-4 py-6 text-center text-sm text-zinc-500">
                        No ratings yet this month. Ratings appear after customers complete the post-chat feedback poll.
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr]">
                        {/* Score display */}
                        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-amber-50 px-6 py-4">
                          <span className="text-5xl font-extrabold text-white">{satisfactionData.avgRating}</span>
                          <span className="text-sm font-medium text-zinc-500">out of 5</span>
                          <div className="mt-1 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Math.round(satisfactionData.avgRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span className="mt-1 text-xs text-zinc-500">
                            Based on {satisfactionData.totalRatings} review{satisfactionData.totalRatings !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Rating distribution bars */}
                        <div className="flex flex-col justify-center gap-2">
                          {[5, 4, 3, 2, 1].map((r) => {
                            const count = satisfactionData.distribution[r - 1];
                            const pct = satisfactionData.totalRatings > 0 ? (count / satisfactionData.totalRatings) * 100 : 0;
                            return (
                              <div key={r} className="flex items-center gap-2 text-sm">
                                <span className="w-3 shrink-0 text-right text-zinc-500">{r}</span>
                                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                                  <div
                                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="w-5 shrink-0 text-right text-xs text-zinc-500">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-white">Recent conversations</h2>
                          <p className="mt-1 text-sm text-zinc-500">Your latest 5 customer chats.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('conversations')}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View All
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
                        {conversations.length === 0 ? (
                          <div className="px-6 py-10 text-center text-sm text-zinc-500">
                            No conversations yet. Your AI conversations will appear here once customers start chatting.
                          </div>
                        ) : (
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-zinc-950 text-zinc-500">
                              <tr>
                                <th className="px-4 py-3 font-semibold">Time</th>
                                <th className="px-4 py-3 font-semibold">Preview</th>
                                <th className="px-4 py-3 font-semibold">Lead Captured</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {conversations.slice(0, 5).map((conversation) => (
                                <tr key={conversation.id} className="bg-zinc-900">
                                  <td className="px-4 py-3 text-zinc-400">{formatDate(conversation.created_at)}</td>
                                  <td className="px-4 py-3 text-white">{getConversationPreview(conversation)}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${conversation.lead_captured ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-800 text-zinc-400'}`}>
                                      {conversation.lead_captured ? 'Yes' : 'No'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-white">Your Widget Code</h2>
                          <p className="mt-1 text-sm text-zinc-500">Copy this into your website before the closing body tag.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            void handleCopyWidgetCode();
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </button>
                      </div>

                      <pre className="mt-6 overflow-x-auto rounded-2xl bg-zinc-800 p-4 text-xs leading-6 text-zinc-200">
                        <code>{widgetCode}</code>
                      </pre>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-white">Your Business QR Code</h2>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      Print this and place it on your desk, door, or receipts. Customers scan it to instantly chat with your AI.
                    </p>

                    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                      <div ref={qrRef} className="flex shrink-0 flex-col items-center gap-3 rounded-2xl border-2 border-zinc-800 bg-zinc-900 p-5">
                        <QRCode
                          value={`https://cypai.app/chat/${business.id}`}
                          size={160}
                          fgColor="#0f172a"
                        />
                        <p className="text-center text-xs font-semibold text-zinc-400">{business.business_name}</p>
                      </div>

                      <div className="flex flex-col justify-center gap-3">
                        <div>
                          <p className="font-semibold text-white">{business.business_name}</p>
                          <p className="text-sm text-zinc-500">Scan to chat with our AI assistant</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => void handleDownloadQR()}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a1a1a]"
                          >
                            <Download className="h-4 w-4" />
                            Download QR Code (PNG)
                          </button>
                          <button
                            type="button"
                            onClick={handlePrintQR}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950"
                          >
                            <Printer className="h-4 w-4" />
                            Print QR Code
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Print and laminate this QR code. Place it on your front desk, car windows, and receipts to get more leads.
                    </div>
                  </div>
                </section>
              ) : null}

              {activeTab === 'conversations' ? (
                <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                  <div data-testid="dashboard-conversations-panel" />
                  <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-sm">
                    <div className="border-b border-zinc-800 px-5 py-4">
                      <h2 className="text-lg font-bold text-white">Conversations</h2>
                      <p className="mt-1 text-sm text-zinc-500">All customer conversations for this business.</p>
                    </div>

                    {conversations.length === 0 ? (
                      <div className="px-5 py-10 text-sm text-zinc-500">No conversations yet. Your AI inbox will populate automatically.</div>
                    ) : (
                      <div className="max-h-[70vh] overflow-y-auto">
                        {conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            type="button"
                            onClick={() => setSelectedConversationId(conversation.id)}
                            className={`w-full border-b border-zinc-800 px-5 py-4 text-left transition last:border-b-0 hover:bg-zinc-950 ${selectedConversationId === conversation.id ? 'bg-blue-50' : 'bg-zinc-900'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-white">
                                {conversation.customer_name || 'Unknown visitor'}
                              </p>
                              <span className="text-xs text-zinc-500">{formatDate(conversation.created_at)}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-zinc-400">{getConversationPreview(conversation)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-sm">
                    {currentConversation ? (
                      <>
                        <div className="border-b border-zinc-800 px-6 py-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-white">{currentConversation.customer_name || 'Unknown visitor'}</h3>
                              <p className="mt-1 text-sm text-zinc-500">{currentConversation.customer_phone || 'Phone not captured yet'}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentConversation.lead_captured ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-800 text-zinc-400'}`}>
                              {currentConversation.lead_captured ? 'Lead captured' : 'No lead yet'}
                            </span>
                          </div>
                        </div>

                        <div className="max-h-[70vh] space-y-4 overflow-y-auto bg-zinc-950 p-6">
                          {(currentConversation.messages || []).length > 0 ? (
                            currentConversation.messages?.map((message, index) => (
                              <div key={`${currentConversation.id}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-zinc-900 text-zinc-300 shadow-sm'}`}>
                                  {message.content}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-zinc-500">No messages stored for this conversation.</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-zinc-500">
                        Select a conversation to view the full transcript.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}

              {activeTab === 'leads' ? (
                <section className="space-y-6">
                  <div data-testid="dashboard-leads-panel" />

                  {/* Broadcast Banner */}
                  <div className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <h3 className="font-bold">Broadcast to All Leads</h3>
                    </div>
                    <p className="mt-1 text-sm text-green-100">
                      Send a special offer or update to all {leads.filter((l) => l.customer_phone).length} leads with phone numbers via WhatsApp.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Type your message… e.g. 🚗 Weekend special! SUV 20% off this Friday–Sunday. Reply to book!"
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="mt-4 w-full resize-none rounded-2xl border border-white/30 bg-zinc-900 p-3 text-sm text-white placeholder-green-200 outline-none focus:border-white/60 focus:ring-0"
                    />
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-green-100">
                        Will open WhatsApp for {leads.filter((l) => l.customer_phone).length} lead{leads.filter((l) => l.customer_phone).length !== 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleBroadcast()}
                        disabled={!broadcastMessage.trim() || broadcastSending}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow transition hover:bg-green-50 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                        {broadcastSending ? 'Preparing…' : 'Send Broadcast →'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">Leads</h2>
                      <p className="mt-1 text-sm text-zinc-500">All customers captured by your AI assistant.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        exportLeadsCsv(leads);
                        setToast({ message: 'Leads exported to CSV.', tone: 'success' });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-sm">
                    {leads.length === 0 ? (
                      <div className="px-6 py-16 text-center text-sm text-zinc-500">
                        No leads yet. Your AI will capture leads automatically when customers chat.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="bg-zinc-950 text-zinc-500">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Date</th>
                              <th className="px-4 py-3 font-semibold">Customer Name</th>
                              <th className="px-4 py-3 font-semibold">Phone</th>
                              <th className="px-4 py-3 font-semibold">First Message</th>
                              <th className="px-4 py-3 font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {leads.map((lead) => (
                              <tr key={lead.id} className="bg-zinc-900">
                                <td className="px-4 py-3 text-zinc-400">{formatDate(lead.created_at)}</td>
                                <td className="px-4 py-3 font-semibold text-white">{lead.customer_name || 'Unknown'}</td>
                                <td className="px-4 py-3 text-zinc-400">{lead.customer_phone || '-'}</td>
                                <td className="max-w-sm px-4 py-3 text-zinc-400">{getConversationPreview(lead)}</td>
                                <td className="px-4 py-3">
                                  <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(lead.lead_contacted)}
                                      disabled={updatingLeadIds.has(lead.id)}
                                      onChange={(event) => {
                                        void handleLeadContacted(lead.id, event.target.checked);
                                      }}
                                      className="h-4 w-4 rounded border-zinc-700 accent-blue-600"
                                      data-testid={`lead-contacted-${lead.id}`}
                                    />
                                    Mark Contacted
                                  </label>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Broadcast History */}
                  <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-sm">
                    <div className="border-b border-zinc-800 px-6 py-4">
                      <h3 className="font-bold text-white">Broadcast History</h3>
                      <p className="mt-0.5 text-sm text-zinc-500">Last 5 broadcasts sent to your leads.</p>
                    </div>
                    {broadcastHistoryLoading ? (
                      <div className="flex h-24 items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                      </div>
                    ) : broadcastHistory.length === 0 ? (
                      <div className="px-6 py-8 text-center text-sm text-zinc-500">No broadcasts sent yet.</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {broadcastHistory.map((item) => (
                          <div key={item.id} className="flex items-start justify-between gap-4 px-6 py-4">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-zinc-200">{item.message}</p>
                              <p className="mt-1 text-xs text-zinc-500">{formatDate(item.created_at)}</p>
                            </div>
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {item.sent_to_count} lead{item.sent_to_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Broadcast Modal */}
                  {broadcastModal ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 p-6 shadow-2xl">
                        <button
                          type="button"
                          aria-label="Close"
                          onClick={() => { setBroadcastModal(null); setBroadcastMessage(''); }}
                          className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                          <MessageSquare className="h-5 w-5 text-emerald-600" />
                          Send Broadcast via WhatsApp
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          Click each button to open WhatsApp and send your message. Counter updates as you go.
                        </p>

                        <div className="mt-4 rounded-2xl bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                          <span className="font-semibold">Message:</span> {broadcastMessage}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                          <span className="text-zinc-400">Sent: {broadcastSentCount}/{broadcastModal.length}</span>
                          {broadcastSentCount === broadcastModal.length && broadcastModal.length > 0 && (
                            <span className="text-emerald-600">✅ Broadcast complete!</span>
                          )}
                        </div>

                        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                          {broadcastModal.map((lead, idx) => {
                            const sent = idx < broadcastSentCount;
                            const waLink = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(broadcastMessage)}`;
                            return (
                              <a
                                key={lead.id}
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setBroadcastSentCount((n) => Math.max(n, idx + 1))}
                                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                  sent
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-green-300 hover:bg-green-50'
                                }`}
                              >
                                <span>{lead.name} · {lead.phone}</span>
                                {sent ? (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <span className="text-[#25D366]">Open WhatsApp →</span>
                                )}
                              </a>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => { setBroadcastModal(null); setBroadcastMessage(''); }}
                          className="mt-5 w-full rounded-full border border-zinc-800 py-2.5 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-950"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {activeTab === 'bookings' ? (
                <section className="space-y-6">
                  <div data-testid="dashboard-bookings-panel" />
                  <BookingsTab businessId={business.id} businessName={business.business_name} />
                </section>
              ) : null}

              {activeTab === 'settings' ? (
                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                  <div data-testid="dashboard-settings-panel" />
                  <form onSubmit={handleSaveSettings} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-white">Settings</h2>
                        <p className="mt-1 text-sm text-zinc-500">Update your business profile, AI behavior, and chat widget appearance.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saveLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="business-name" className="mb-2 block text-sm font-semibold text-zinc-300">Business Name</label>
                        <input
                          id="business-name"
                          value={settingsForm.businessName}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, businessName: event.target.value }))}
                          className="h-12 w-full rounded-2xl border border-zinc-700 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      <div>
                        <label htmlFor="business-type" className="mb-2 block text-sm font-semibold text-zinc-300">Business Type</label>
                        <select
                          id="business-type"
                          value={settingsForm.businessType}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, businessType: event.target.value }))}
                          className="h-12 w-full rounded-2xl border border-zinc-700 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          {businessTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label htmlFor="primary-color" className="mb-2 block text-sm font-semibold text-zinc-300">Primary Color</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 px-4 py-3">
                        <input
                          id="primary-color"
                          type="color"
                          value={settingsForm.primaryColor}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, primaryColor: event.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <span className="h-8 w-8 rounded-full border border-zinc-800" style={{ backgroundColor: settingsForm.primaryColor }} />
                        <span className="text-sm font-medium text-zinc-300">{settingsForm.primaryColor}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label htmlFor="ai-instructions" className="mb-2 block text-sm font-semibold text-zinc-300">AI Instructions</label>
                      <textarea
                        id="ai-instructions"
                        rows={6}
                        value={settingsForm.aiInstructions}
                        onChange={(event) => setSettingsForm((current) => ({ ...current, aiInstructions: event.target.value }))}
                        placeholder="Add specific info about your business..."
                        className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-white">Custom FAQs</h3>
                          <p className="text-sm text-zinc-500">Add question and answer pairs to guide your AI responses.</p>
                        </div>
                        <button
                          type="button"
                          onClick={addFaq}
                          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-950"
                        >
                          <Plus className="h-4 w-4" />
                          Add FAQ
                        </button>
                      </div>

                      <div className="space-y-4">
                        {settingsForm.customFaqs.map((faq, index) => (
                          <div key={`${index}-${faq.question}`} className="rounded-2xl border border-zinc-800 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">FAQ {index + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition hover:bg-zinc-950"
                                aria-label={`Remove FAQ ${index + 1}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid gap-3">
                              <input
                                value={faq.question}
                                onChange={(event) => updateFaq(index, 'question', event.target.value)}
                                placeholder="Question"
                                className="h-11 rounded-2xl border border-zinc-700 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                              />
                              <textarea
                                rows={3}
                                value={faq.answer}
                                onChange={(event) => updateFaq(index, 'answer', event.target.value)}
                                placeholder="Answer"
                                className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>

                  <div data-testid="dashboard-subscription-panel" />
                  <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-white">Live widget preview</h3>
                    <p className="mt-1 text-sm text-zinc-500">Preview how your chat bubble and welcome message will look.</p>
                    <div className="mt-5 h-[560px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
                      <ChatWidget
                        businessId={business.id}
                        businessName={settingsForm.businessName || business.business_name}
                        primaryColor={settingsForm.primaryColor}
                        welcomeMessage={`Hi, this is ${settingsForm.businessName || business.business_name}. How can I help you today?`}
                        embedded
                      />
                    </div>
                  </div>
                </section>
              ) : null}

              {activeTab === 'subscription' ? (
                <section className="space-y-6">
                  <div className="max-w-5xl mx-auto px-0">

                    {/* Trial banner */}
                    {business.plan === 'trial' ? (
                      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
                        ⚠️ You&apos;re on a free trial. Choose a plan below to continue after 7 days.
                      </div>
                    ) : null}

                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
                      <p className="text-zinc-500 mt-2">Upgrade or downgrade anytime. 7-day free trial on all plans.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                      {([
                        {
                          id: 'starter' as const,
                          name: 'Starter',
                          price: 29,
                          description: 'Perfect for small local businesses',
                          features: [
                            '500 messages/month',
                            'Website chat widget',
                            'Lead capture (name + phone)',
                            'Basic analytics',
                            'Email support',
                            'QR code for walk-in customers',
                            'Mobile-friendly chat',
                          ],
                          cta: 'Upgrade to Starter',
                          popular: false,
                          hint: null,
                        },
                        {
                          id: 'pro' as const,
                          name: 'Pro',
                          price: 79,
                          description: 'For growing businesses that need more',
                          features: [
                            'Unlimited messages',
                            'Website chat widget',
                            'Lead capture (name + phone)',
                            'WhatsApp integration',
                            'Advanced analytics & reports',
                            'Priority support (24h response)',
                            'Custom AI training & FAQs',
                            'QR code + booking system',
                            'Customer satisfaction ratings',
                            'Broadcast messages to leads',
                          ],
                          cta: 'Upgrade to Pro',
                          popular: true,
                          hint: '💡 Most businesses start here',
                        },
                        {
                          id: 'business' as const,
                          name: 'Business',
                          price: 149,
                          description: 'Full suite for serious businesses',
                          features: [
                            'Everything in Pro',
                            'Agent Audit & compliance reports',
                            'AI safety scoring per conversation',
                            'Sensitive data detection',
                            'Weekly PDF compliance report',
                            'Multi-location support',
                            'Phone support',
                            'Dedicated onboarding call',
                            'Custom integrations on request',
                            'SLA guarantee',
                          ],
                          cta: 'Upgrade to Business',
                          popular: false,
                          hint: '🏆 Best for established businesses',
                        },
                      ] as Array<{
                        id: 'starter' | 'pro' | 'business';
                        name: string;
                        price: number;
                        description: string;
                        features: string[];
                        cta: string;
                        popular: boolean;
                        hint: string | null;
                      }>).map((plan) => {
                        const isCurrent = plan.id === business.plan;
                        return (
                          <div
                            key={plan.id}
                            className={`relative flex flex-col h-full rounded-2xl p-6 bg-zinc-900 ${
                              plan.popular
                                ? 'border-2 border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.1)]'
                                : 'border border-zinc-800'
                            }`}
                          >
                            {/* Most Popular badge */}
                            {plan.popular ? (
                              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                Most Popular
                              </span>
                            ) : null}

                            {/* Current Plan badge */}
                            {isCurrent ? (
                              <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                Current Plan
                              </span>
                            ) : null}

                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            <p className="mt-1 text-sm text-zinc-500">{plan.description}</p>

                            <p className="mt-4">
                              <span className="text-4xl font-bold text-white">${plan.price}</span>
                              <span className="text-lg text-zinc-500">/mo</span>
                            </p>

                            {plan.hint ? (
                              <p className="mt-1 text-sm text-blue-600 font-medium">{plan.hint}</p>
                            ) : null}

                            <ul className="flex-1 mt-4 space-y-2 text-sm text-zinc-300">
                              {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>

                            <button
                              type="button"
                              disabled={isCurrent}
                              onClick={() => {
                                if (!isCurrent) router.push(`/payment?plan=${plan.id}&upgrade=true`);
                              }}
                              className={`mt-6 w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                                isCurrent
                                  ? 'border border-zinc-800 text-zinc-500 cursor-not-allowed'
                                  : plan.popular
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-950'
                              }`}
                            >
                              {isCurrent ? '✓ Your current plan' : plan.cta}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-center text-sm text-zinc-500 mt-8">
                      All plans include a 7-day free trial. Cancel anytime. Payments via PayPal.
                    </p>
                  </div>
                </section>
              ) : null}

              {activeTab === 'audit' ? (
                <section className="space-y-6">
                  {business.plan !== 'business' ? (
                    <div className="rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50 p-10 text-center">
                      <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-purple-400" />
                      <h3 className="text-xl font-extrabold text-white">Agent Audit</h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">
                        AI-powered compliance monitoring is a Business plan exclusive. Monitor safety scores, flag risky conversations, and generate compliance reports.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('subscription')}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-purple-700"
                      >
                        <CreditCard className="h-4 w-4" />
                        Upgrade to Business — $149/mo
                      </button>
                    </div>
                  ) : auditLoading ? (
                    <div className="flex h-48 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                  ) : auditError ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
                      <p className="font-semibold text-red-600">{auditError}</p>
                      <button
                        type="button"
                        onClick={() => void loadAuditSummary()}
                        className="mt-3 text-sm text-red-500 underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Compliance Status Banner */}
                      <div
                        className={`flex items-center gap-3 rounded-3xl px-6 py-4 ${
                          auditSummary?.complianceStatus === 'good'
                            ? 'bg-emerald-50 text-emerald-700'
                            : auditSummary?.complianceStatus === 'warning'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {auditSummary?.complianceStatus === 'good' ? (
                          <ShieldCheck className="h-6 w-6 shrink-0" />
                        ) : (
                          <ShieldAlert className="h-6 w-6 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold">
                            {auditSummary?.complianceStatus === 'good'
                              ? 'All Clear — No critical issues detected this week'
                              : auditSummary?.complianceStatus === 'warning'
                                ? 'Attention — Some conversations need review'
                                : 'Critical — Immediate action required'}
                          </p>
                          <p className="mt-0.5 text-sm opacity-80">
                            {auditSummary?.weeklyStats.totalConversations ?? 0} conversation{(auditSummary?.weeklyStats.totalConversations ?? 0) !== 1 ? 's' : ''} analysed this week
                          </p>
                        </div>
                      </div>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard
                          label="Avg Safety Score"
                          value={auditSummary?.weeklyStats.avgSafetyScore != null ? `${auditSummary.weeklyStats.avgSafetyScore}/100` : '--'}
                        />
                        <StatCard
                          label="Flagged This Week"
                          value={String(auditSummary?.weeklyStats.flaggedCount ?? 0)}
                          badgeClassName={
                            (auditSummary?.weeklyStats.flaggedCount ?? 0) === 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : (auditSummary?.weeklyStats.flaggedCount ?? 0) >= 3
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }
                        />
                        <StatCard
                          label="Data Events"
                          value={String(auditSummary?.weeklyStats.sensitiveDataIncidents ?? 0)}
                        />
                        <StatCard
                          label="Compliance"
                          value={
                            auditSummary?.complianceStatus
                              ? auditSummary.complianceStatus.charAt(0).toUpperCase() +
                                auditSummary.complianceStatus.slice(1)
                              : '--'
                          }
                          badgeClassName={
                            auditSummary?.complianceStatus === 'good'
                              ? 'bg-emerald-100 text-emerald-700'
                              : auditSummary?.complianceStatus === 'warning'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }
                        />
                      </div>

                      {/* Safety Score Trend */}
                      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <h3 className="mb-4 text-base font-bold text-white">Safety Score Trend (7 days)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={28} />
                            <Tooltip formatter={(v) => [`${v}/100`, 'Safety']} />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke={chartLineColor}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <p className="mt-2 text-center text-xs text-zinc-500">
                          {chartTrend === 'improving' ? '↑ Improving trend' : chartTrend === 'declining' ? '↓ Declining trend' : '→ Stable'}
                        </p>
                      </div>

                      {/* Flagged Conversations */}
                      {(auditSummary?.flaggedConversations.length ?? 0) > 0 && (
                        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-sm">
                          <div className="flex items-center justify-between px-6 py-5">
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                              <Flag className="h-4 w-4 text-red-500" />
                              Flagged Conversations
                            </h3>
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                              {auditSummary?.flaggedConversations.length}
                            </span>
                          </div>
                          <div className="divide-y divide-slate-100">
                            {auditSummary?.flaggedConversations.map((conv) => (
                              <div key={conv.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm text-zinc-300">{conv.firstMessage.slice(0, 70)}{conv.firstMessage.length > 70 ? '…' : ''}</p>
                                  <p className="mt-1 text-xs text-zinc-500">{formatDate(conv.createdAt)} · {conv.flagReason}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  {conv.safetyScore !== null && (
                                    <span
                                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        conv.safetyScore >= 80
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : conv.safetyScore >= 60
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {conv.safetyScore}/100
                                    </span>
                                  )}
                                  {conv.reviewed ? (
                                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">Reviewed</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setAuditReviewId(conv.id)}
                                      className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top Issues */}
                      {(auditSummary?.topIssues.length ?? 0) > 0 && (
                        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                          <h3 className="mb-4 text-base font-bold text-white">Top Issues This Week</h3>
                          <ul className="space-y-2">
                            {auditSummary?.topIssues.map((issue, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                                <Flag className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Generate Compliance Report */}
                      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="flex items-center gap-2 text-base font-bold text-white">
                              <FileText className="h-5 w-5 text-blue-500" />
                              Compliance Report
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500">Generate an AI-powered 30-day compliance summary for your records.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleGenerateReport()}
                            disabled={reportLoading}
                            className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#1a1a1a] disabled:opacity-50"
                          >
                            {reportLoading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            {reportLoading ? 'Generating…' : 'Generate Report'}
                          </button>
                        </div>
                        {reportData && (
                          <div className="mt-6 space-y-4">
                            <div className="rounded-2xl bg-zinc-950 p-5">
                              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                {reportData.periodStart} – {reportData.periodEnd}
                              </p>
                              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{reportData.aiSummary}</p>
                              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                  { label: 'Conversations', value: String(reportData.totalConversations) },
                                  { label: 'Flagged', value: String(reportData.flaggedCount) },
                                  { label: 'Avg Safety', value: reportData.avgSafetyScore != null ? String(reportData.avgSafetyScore) : '--' },
                                  { label: 'Data Events', value: String(reportData.sensitiveDataIncidents) },
                                ].map(({ label, value }) => (
                                  <div key={label} className="rounded-xl bg-zinc-900 p-3 text-center shadow-sm">
                                    <p className="text-2xl font-extrabold text-white">{value}</p>
                                    <p className="text-xs text-zinc-500">{label}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                              <Download className="h-4 w-4" />
                              Download / Print Report
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Review Modal */}
                      {reviewedConv ? (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 p-6 shadow-2xl">
                            <button
                              type="button"
                              onClick={() => setAuditReviewId(null)}
                              aria-label="Close"
                              className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-800"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                              <ShieldAlert className="h-5 w-5 text-red-500" />
                              Flagged Conversation
                            </h3>
                            <div className="mt-4 max-h-40 overflow-y-auto rounded-2xl bg-zinc-950 p-4">
                              <p className="mb-1 text-xs text-zinc-500">First message:</p>
                              <p className="text-sm text-zinc-200">{reviewedConv.firstMessage}</p>
                            </div>
                            <div className="mt-4 rounded-2xl bg-amber-50 p-4">
                              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-600">AI Audit Findings</p>
                              <p className="text-sm text-amber-800">{reviewedConv.flagReason || 'No flag reason recorded.'}</p>
                              {reviewedConv.safetyScore !== null && (
                                <p className="mt-2 text-sm font-semibold text-amber-900">Safety Score: {reviewedConv.safetyScore}/100</p>
                              )}
                            </div>
                            <div className="mt-5 flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setAuditReviewId(null)}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-800"
                              >
                                Close
                              </button>
                              {!reviewedConv.reviewed && (
                                <button
                                  type="button"
                                  disabled={markingReviewed.has(reviewedConv.id)}
                                  onClick={() => void handleMarkReviewed(reviewedConv.id)}
                                  className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {markingReviewed.has(reviewedConv.id) ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  Mark as Reviewed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </section>
              ) : null}

              {activeTab === 'crm' ? (
                <section>
                  <div data-testid="dashboard-crm-panel" />
                  <CRMTab businessId={business.id} businessName={business.business_name} />
                </section>
              ) : null}

              {activeTab === 'followups' ? (
                <section>
                  <div data-testid="dashboard-followups-panel" />
                  <FollowUpsTab businessId={business.id} businessName={business.business_name} />
                </section>
              ) : null}

              {activeTab === 'analytics' ? (
                <section>
                  <div data-testid="dashboard-analytics-panel" />
                  <AnalyticsTab businessId={business.id} />
                </section>
              ) : null}

              {activeTab === 'agency' ? (
                <section>
                  <div data-testid="dashboard-agency-panel" />
                  <AgencyTab ownerEmail={business.owner_email} />
                </section>
              ) : null}
            </div>
          ) : null}
        </main>

        {/* Upgrade lock modal */}
        {upgradeLockTab ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="relative w-full max-w-sm rounded-3xl bg-zinc-900 p-8 text-center shadow-2xl">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setUpgradeLockTab(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">🔒</div>
              <h3 className="mt-4 text-xl font-extrabold text-white">Feature Locked</h3>
              <p className="mt-2 text-sm text-zinc-400">
                This feature requires a higher plan. Upgrade to unlock CRM, Follow-ups, Analytics, and more.
              </p>
              <button
                type="button"
                onClick={() => { setActiveTab('subscription'); setUpgradeLockTab(null); }}
                className="mt-6 w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Upgrade Now →
              </button>
            </div>
          </div>
        ) : null}

        {/* Quick Actions floating bar */}
        {(newLeadsCount > 0 || pendingBookingsCount > 0) && (
          <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-2 lg:bottom-6">
            {newLeadsCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('crm')}
                className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-[#1a1a1a]"
              >
                👥 {newLeadsCount} New Lead{newLeadsCount !== 1 ? 's' : ''}
              </button>
            )}
            {pendingBookingsCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-orange-600"
              >
                📅 {pendingBookingsCount} Pending Booking{pendingBookingsCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-zinc-800 bg-zinc-900 lg:hidden">
        {mobileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              const tabConfig = tabItems.find((item) => item.key === tab.id);
              const normalizedPlan: SidebarPlan =
                business?.plan === 'basic' ? 'starter' : ((business?.plan ?? 'trial') as SidebarPlan);
              if (tabConfig && !tabConfig.plans.includes(normalizedPlan)) {
                setUpgradeLockTab(tab.id);
                return;
              }
              setActiveTab(tab.id);
            }}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
              activeTab === tab.id
                ? 'text-zinc-100'
                : 'text-zinc-500'
            }`}
            data-testid={`dashboard-mobile-tab-${tab.id}`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}

function StatCard({
  label,
  value,
  badgeClassName,
}: {
  label: string;
  value: string;
  badgeClassName?: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      {badgeClassName ? (
        <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${badgeClassName}`}>
          {value}
        </span>
      ) : (
        <p className="mt-4 text-3xl font-extrabold text-white">{value}</p>
      )}
    </div>
  );
}

function MiniMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'neutral' | 'success' | 'error';
}) {
  const styles: Record<'neutral' | 'success' | 'error', string> = {
    neutral: 'border-zinc-700 bg-zinc-950 text-zinc-100',
    success: 'border-emerald-700/40 bg-emerald-900/20 text-emerald-200',
    error: 'border-rose-700/40 bg-rose-900/20 text-rose-200',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}





