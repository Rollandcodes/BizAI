'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bot,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

import ChatWidget from '@/components/ChatWidget';
import { PLANS } from '@/lib/plans';

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
  widget_color?: string | null;
  plan: 'trial' | 'basic' | 'pro' | 'business';
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

type TabKey = 'overview' | 'conversations' | 'leads' | 'settings' | 'subscription';

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

const DASHBOARD_STORAGE_KEY = 'bizai-dashboard-email';
const businessTypeOptions = [
  { value: 'car_rental', label: 'Car Rental' },
  { value: 'barbershop', label: 'Barbershop' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'gym', label: 'Gym' },
  { value: 'other', label: 'Other' },
];

const tabItems: Array<{ key: TabKey; label: string; Icon: LucideIcon }> = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'conversations', label: 'Conversations', Icon: MessageSquare },
  { key: 'leads', label: 'Leads', Icon: Users },
  { key: 'settings', label: 'Settings', Icon: Settings },
  { key: 'subscription', label: 'Subscription', Icon: CreditCard },
];

const messageLimits: Record<BusinessRecord['plan'], number | null> = {
  trial: 100,
  basic: 500,
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
    trial: 'bg-slate-100 text-slate-700',
    basic: 'bg-green-100 text-green-700',
    pro: 'bg-blue-100 text-blue-700',
    business: 'bg-purple-100 text-purple-700',
  };

  return styles[plan] || styles.trial;
}

function getPlanDisplayName(plan: BusinessRecord['plan']) {
  const names: Record<BusinessRecord['plan'], string> = {
    trial: 'Trial',
    basic: 'Basic',
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
  link.download = 'bizai-leads.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="mt-4 h-9 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-5 w-32" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="mb-8 flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">BizAI Dashboard</p>
            <h1 className="text-2xl font-extrabold text-slate-900">Enter your business email to access dashboard</h1>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="owner@business.com"
            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking account...' : 'Access Dashboard'}
          </button>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>No account found. Sign up first or contact <a href="mailto:bizaicyprus123@gmail.com" className="font-semibold text-blue-700 hover:underline">bizaicyprus123@gmail.com</a></p>
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
  planId: 'basic' | 'pro' | 'business';
  email: string;
  onSuccess: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Loading PayPal checkout...</div>;
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

export default function DashboardPage() {
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
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<'basic' | 'pro' | 'business'>('pro');
  const [paymentError, setPaymentError] = useState('');
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>({
    businessName: '',
    businessType: 'other',
    primaryColor: '#2563eb',
    aiInstructions: '',
    customFaqs: [{ question: '', answer: '' }],
  });

  const business = dashboard.business;
  const stats = dashboard.stats;
  const conversations = dashboard.conversations;
  const leads = dashboard.leads;
  const currentConversation = conversations.find((item) => item.id === selectedConversationId) || null;
  const planLimit = business ? messageLimits[business.plan] : null;
  const currentPlanName = business ? getPlanDisplayName(business.plan) : 'Trial';
  const currentPlanPrice = business && business.plan !== 'trial' ? PLANS[business.plan]?.price || '0.00' : '0.00';
  const widgetCode = useMemo(() => {
    if (!business) {
      return '';
    }

    return `<script>\n  window.BizAIConfig = { businessId: "${business.id}" }\n</script>\n<script src="https://biz-ai-u4n3.vercel.app/widget.js"></script>`;
  }, [business]);

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
      return;
    }

    setSettingsForm({
      businessName: business.business_name || '',
      businessType: business.business_type || 'other',
      primaryColor: business.widget_color || '#2563eb',
      aiInstructions: business.customInstructions || '',
      customFaqs: business.customFaqs && business.customFaqs.length > 0 ? business.customFaqs : [{ question: '', answer: '' }],
    });

    const eligiblePlan = business.plan === 'trial' ? 'basic' : business.plan;
    setSelectedUpgradePlan((eligiblePlan as 'basic' | 'pro' | 'business') || 'pro');
  }, [business]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      {toast ? <Toast toast={toast} /> : null}

      <aside className="hidden w-60 shrink-0 flex-col bg-[#0f172a] text-white lg:flex">
        <div className="flex h-20 items-center px-6 text-xl font-extrabold">BizAI</div>

        <nav className="flex-1 space-y-2 px-4 py-4">
          {tabItems.map(({ key, label, Icon }) => {
            const active = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                data-testid={`dashboard-tab-${key}`}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-white/10" />

        <div className="p-4">
          <p className="mb-2 truncate px-4 text-xs font-medium text-slate-400">{business?.owner_email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Good morning, {business?.business_name || 'BizAI'} 👋
                </h1>
                <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${getPlanBadgeClasses(business.plan)}`}>
                  {currentPlanName}
                </span>
                {(business.plan === 'trial' || business.plan === 'basic') ? (
                  <Link href="/#pricing" className="hidden text-xs font-semibold text-blue-600 hover:underline sm:inline-flex">
                    Upgrade ↑
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 sm:inline-flex">
                {business?.owner_email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:hidden"
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
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Conversations" value={String(stats?.totalConversations ?? 0)} />
                    <StatCard label="Leads Captured" value={String(stats?.leadsCaptured ?? 0)} />
                    <StatCard label="This Month's Messages" value={String(stats?.monthlyMessages ?? 0)} />
                    <StatCard
                      label="Current Plan"
                      value={currentPlanName}
                      badgeClassName={getPlanBadgeClasses(business.plan)}
                    />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Recent conversations</h2>
                          <p className="mt-1 text-sm text-slate-500">Your latest 5 customer chats.</p>
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

                      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                        {conversations.length === 0 ? (
                          <div className="px-6 py-10 text-center text-sm text-slate-500">
                            No conversations yet. Your AI conversations will appear here once customers start chatting.
                          </div>
                        ) : (
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                              <tr>
                                <th className="px-4 py-3 font-semibold">Time</th>
                                <th className="px-4 py-3 font-semibold">Preview</th>
                                <th className="px-4 py-3 font-semibold">Lead Captured</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {conversations.slice(0, 5).map((conversation) => (
                                <tr key={conversation.id} className="bg-white">
                                  <td className="px-4 py-3 text-slate-600">{formatDate(conversation.created_at)}</td>
                                  <td className="px-4 py-3 text-slate-900">{getConversationPreview(conversation)}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${conversation.lead_captured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
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

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Your Widget Code</h2>
                          <p className="mt-1 text-sm text-slate-500">Copy this into your website before the closing body tag.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            void handleCopyWidgetCode();
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </button>
                      </div>

                      <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-100 p-4 text-xs leading-6 text-slate-800">
                        <code>{widgetCode}</code>
                      </pre>
                    </div>
                  </div>
                </section>
              ) : null}

              {activeTab === 'conversations' ? (
                <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                  <div data-testid="dashboard-conversations-panel" />
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
                      <p className="mt-1 text-sm text-slate-500">All customer conversations for this business.</p>
                    </div>

                    {conversations.length === 0 ? (
                      <div className="px-5 py-10 text-sm text-slate-500">No conversations yet. Your AI inbox will populate automatically.</div>
                    ) : (
                      <div className="max-h-[70vh] overflow-y-auto">
                        {conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            type="button"
                            onClick={() => setSelectedConversationId(conversation.id)}
                            className={`w-full border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${selectedConversationId === conversation.id ? 'bg-blue-50' : 'bg-white'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {conversation.customer_name || 'Unknown visitor'}
                              </p>
                              <span className="text-xs text-slate-500">{formatDate(conversation.created_at)}</span>
                            </div>
                            <p className="mt-1 truncate text-sm text-slate-600">{getConversationPreview(conversation)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {currentConversation ? (
                      <>
                        <div className="border-b border-slate-200 px-6 py-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">{currentConversation.customer_name || 'Unknown visitor'}</h3>
                              <p className="mt-1 text-sm text-slate-500">{currentConversation.customer_phone || 'Phone not captured yet'}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentConversation.lead_captured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                              {currentConversation.lead_captured ? 'Lead captured' : 'No lead yet'}
                            </span>
                          </div>
                        </div>

                        <div className="max-h-[70vh] space-y-4 overflow-y-auto bg-slate-50 p-6">
                          {(currentConversation.messages || []).length > 0 ? (
                            currentConversation.messages?.map((message, index) => (
                              <div key={`${currentConversation.id}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm bg-white text-slate-700 shadow-sm'}`}>
                                  {message.content}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-slate-500">No messages stored for this conversation.</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-slate-500">
                        Select a conversation to view the full transcript.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}

              {activeTab === 'leads' ? (
                <section className="space-y-6">
                  <div data-testid="dashboard-leads-panel" />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">Leads</h2>
                      <p className="mt-1 text-sm text-slate-500">All customers captured by your AI assistant.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        exportLeadsCsv(leads);
                        setToast({ message: 'Leads exported to CSV.', tone: 'success' });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {leads.length === 0 ? (
                      <div className="px-6 py-16 text-center text-sm text-slate-500">
                        No leads yet. Your AI will capture leads automatically when customers chat.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500">
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
                              <tr key={lead.id} className="bg-white">
                                <td className="px-4 py-3 text-slate-600">{formatDate(lead.created_at)}</td>
                                <td className="px-4 py-3 font-semibold text-slate-900">{lead.customer_name || 'Unknown'}</td>
                                <td className="px-4 py-3 text-slate-600">{lead.customer_phone || '-'}</td>
                                <td className="max-w-sm px-4 py-3 text-slate-600">{getConversationPreview(lead)}</td>
                                <td className="px-4 py-3">
                                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(lead.lead_contacted)}
                                      disabled={updatingLeadIds.has(lead.id)}
                                      onChange={(event) => {
                                        void handleLeadContacted(lead.id, event.target.checked);
                                      }}
                                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
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
                </section>
              ) : null}

              {activeTab === 'settings' ? (
                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                  <div data-testid="dashboard-settings-panel" />
                  <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">Settings</h2>
                        <p className="mt-1 text-sm text-slate-500">Update your business profile, AI behavior, and chat widget appearance.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saveLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <div>
                        <label htmlFor="business-name" className="mb-2 block text-sm font-semibold text-slate-700">Business Name</label>
                        <input
                          id="business-name"
                          value={settingsForm.businessName}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, businessName: event.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      <div>
                        <label htmlFor="business-type" className="mb-2 block text-sm font-semibold text-slate-700">Business Type</label>
                        <select
                          id="business-type"
                          value={settingsForm.businessType}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, businessType: event.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      <label htmlFor="primary-color" className="mb-2 block text-sm font-semibold text-slate-700">Primary Color</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3">
                        <input
                          id="primary-color"
                          type="color"
                          value={settingsForm.primaryColor}
                          onChange={(event) => setSettingsForm((current) => ({ ...current, primaryColor: event.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <span className="h-8 w-8 rounded-full border border-slate-200" style={{ backgroundColor: settingsForm.primaryColor }} />
                        <span className="text-sm font-medium text-slate-700">{settingsForm.primaryColor}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label htmlFor="ai-instructions" className="mb-2 block text-sm font-semibold text-slate-700">AI Instructions</label>
                      <textarea
                        id="ai-instructions"
                        rows={6}
                        value={settingsForm.aiInstructions}
                        onChange={(event) => setSettingsForm((current) => ({ ...current, aiInstructions: event.target.value }))}
                        placeholder="Add specific info about your business..."
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Custom FAQs</h3>
                          <p className="text-sm text-slate-500">Add question and answer pairs to guide your AI responses.</p>
                        </div>
                        <button
                          type="button"
                          onClick={addFaq}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Plus className="h-4 w-4" />
                          Add FAQ
                        </button>
                      </div>

                      <div className="space-y-4">
                        {settingsForm.customFaqs.map((faq, index) => (
                          <div key={`${index}-${faq.question}`} className="rounded-2xl border border-slate-200 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-slate-900">FAQ {index + 1}</p>
                              <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
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
                                className="h-11 rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                              />
                              <textarea
                                rows={3}
                                value={faq.answer}
                                onChange={(event) => updateFaq(index, 'answer', event.target.value)}
                                placeholder="Answer"
                                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>

                  <div data-testid="dashboard-subscription-panel" />
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Live widget preview</h3>
                    <p className="mt-1 text-sm text-slate-500">Preview how your chat bubble and welcome message will look.</p>
                    <div className="mt-5 h-[560px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
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
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Current plan</p>
                        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{currentPlanName}</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          ${currentPlanPrice}/month
                          {business.plan_expires_at ? ` · Expires ${formatDate(business.plan_expires_at)}` : ''}
                        </p>
                      </div>
                      <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${getPlanBadgeClasses(business.plan)}`}>
                        {currentPlanName}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                        <span>Messages used this month</span>
                        <span>
                          {usageValue}/{planLimit ?? 'Unlimited'}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${usageWidth}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Upgrade your subscription</h3>
                        <p className="mt-1 text-sm text-slate-500">Choose another plan and pay securely with PayPal.</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                      {(Object.values(PLANS) as Array<(typeof PLANS)[keyof typeof PLANS]>).map((plan) => {
                        const isCurrent = plan.id === business.plan;
                        const isSelected = selectedUpgradePlan === plan.id;

                        return (
                          <div
                            key={plan.id}
                            className={`rounded-3xl border p-5 transition ${
                              isCurrent
                                ? 'border-blue-300 bg-blue-50'
                                : isSelected
                                  ? 'border-slate-900 bg-slate-900 text-white'
                                  : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className={`text-lg font-bold ${isSelected && !isCurrent ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
                                <p className={`mt-1 text-sm ${isSelected && !isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
                              </div>
                              {isCurrent ? (
                                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">Current</span>
                              ) : null}
                            </div>
                            <p className={`mt-5 text-3xl font-extrabold ${isSelected && !isCurrent ? 'text-white' : 'text-slate-900'}`}>
                              ${plan.price}
                              <span className={`text-sm font-medium ${isSelected && !isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>/mo</span>
                            </p>
                            <ul className="mt-4 space-y-2">
                              {plan.features.map((feature) => (
                                <li key={feature} className={`flex items-start gap-2 text-sm ${isSelected && !isCurrent ? 'text-slate-200' : 'text-slate-600'}`}>
                                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected && !isCurrent ? 'text-cyan-300' : 'text-emerald-600'}`} />
                                  {feature}
                                </li>
                              ))}
                            </ul>

                            {!isCurrent ? (
                              <button
                                type="button"
                                onClick={() => setSelectedUpgradePlan(plan.id as 'basic' | 'pro' | 'business')}
                                className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                  isSelected
                                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {isSelected ? 'Selected for checkout' : 'Choose plan'}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    {paymentError ? (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {paymentError}
                      </div>
                    ) : null}

                    {selectedUpgradePlan !== business.plan ? (
                      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <h4 className="text-lg font-bold text-slate-900">Complete upgrade</h4>
                        <p className="mt-1 text-sm text-slate-500">Checkout for the {PLANS[selectedUpgradePlan].name} plan.</p>
                        <div className="mt-4">
                          <PayPalScriptProvider
                            options={{
                              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                              currency: 'USD',
                              intent: 'capture',
                            }}
                          >
                            <UpgradeCheckoutButtons
                              planId={selectedUpgradePlan}
                              email={business.owner_email}
                              onError={setPaymentError}
                              onSuccess={async () => {
                                setPaymentError('');
                                await refreshDashboard();
                                setToast({ message: 'Subscription updated successfully!', tone: 'success' });
                              }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {tabItems.map(({ key, label, Icon }) => {
            const active = activeTab === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                data-testid={`dashboard-mobile-tab-${key}`}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="mb-1 h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {badgeClassName ? (
        <span className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${badgeClassName}`}>
          {value}
        </span>
      ) : (
        <p className="mt-4 text-3xl font-extrabold text-slate-900">{value}</p>
      )}
    </div>
  );
}
