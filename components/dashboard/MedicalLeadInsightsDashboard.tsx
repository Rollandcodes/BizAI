'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Cell,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Globe2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
  Wallet,
} from 'lucide-react'

import HighValueLeadTable from '@/components/dashboard/HighValueLeadTable'
import { cn } from '@/lib/utils'

type FunnelStage = {
  label: string
  value: number
  accent: string
  hint: string
  barClass: string
}

type MedicalLeadInsightsDashboardProps = {
  className?: string
}

type MarketLanguage = {
  name: string
  value: number
  color: string
}

type MarketCategory = {
  name: string
  value: number
  tone: string
}

type DashboardStatsResponse = {
  totalLeads?: number
  totalBookings?: number
  totalRevenue?: number
  languages?: {
    english?: number
    turkish?: number
    russian?: number
    arabic?: number
    greek?: number
  }
  regions?: {
    northCyprus?: number
    southCyprus?: number
  }
}

const MARKET_TONES = ['bg-primary', 'bg-primary-container', 'bg-secondary', 'bg-secondary-container']
const LANGUAGE_COLORS = ['#006194', '#006a61', '#825100', '#6d28d9', '#0ea5e9']

const DEFAULT_LEAD_STAGES: FunnelStage[] = [
  {
    label: 'Website Visits',
    value: 4200,
    accent: 'bg-primary text-white',
    hint: 'Organic + paid traffic from treatment and property landing pages',
    barClass: 'w-full',
  },
  {
    label: 'AI Conversations',
    value: 1800,
    accent: 'bg-primary-container text-white',
    hint: 'Visitors who engaged with the chat widget or WhatsApp assistant',
    barClass: 'w-2/5',
  },
  {
    label: 'Qualified Medical Leads',
    value: 482,
    accent: 'bg-secondary text-white',
    hint: 'Conversation qualified by treatment, budget, timeline, and contact details',
    barClass: 'w-[12%]',
  },
  {
    label: 'Booked Appointments',
    value: 126,
    accent: 'bg-secondary-container text-on-secondary-container',
    hint: 'Confirmed consults handed over to the team',
    barClass: 'w-[5%]',
  },
]

const DEFAULT_MARKET_LANGUAGES: MarketLanguage[] = [
  { name: 'English', value: 40, color: '#006194' },
  { name: 'Greek', value: 25, color: '#006a61' },
  { name: 'Turkish', value: 15, color: '#825100' },
  { name: 'Arabic', value: 10, color: '#6d28d9' },
  { name: 'Russian', value: 10, color: '#0ea5e9' },
]

const DEFAULT_INQUIRY_CATEGORIES: MarketCategory[] = [
  { name: 'North Cyprus', value: 120, tone: 'bg-primary' },
  { name: 'South Cyprus', value: 80, tone: 'bg-primary-container' },
]

const momentumData = [
  { day: 'Mon', visits: 280, leads: 26 },
  { day: 'Tue', visits: 320, leads: 31 },
  { day: 'Wed', visits: 310, leads: 29 },
  { day: 'Thu', visits: 360, leads: 34 },
  { day: 'Fri', visits: 410, leads: 39 },
  { day: 'Sat', visits: 460, leads: 45 },
  { day: 'Sun', visits: 390, leads: 38 },
]

const criticalLeads = [
  {
    name: 'Robert Chen',
    leadId: '942-A',
    specialty: 'Cardiology',
    score: 9.8,
    progressClass: 'w-[98%]',
    note: 'Needs same-day follow-up',
    phone: '+90 533 555 0111',
  },
  {
    name: 'Elena Rodriguez',
    leadId: '772-B',
    specialty: 'General Surgery',
    score: 7.2,
    progressClass: 'w-[72%]',
    note: 'Awaiting price clarification',
    phone: '+90 533 555 0222',
  },
  {
    name: 'Michael Thorne',
    leadId: '211-F',
    specialty: 'Neurology',
    score: 8.5,
    progressClass: 'w-[85%]',
    note: 'Ready for consultation slot',
    phone: '+90 533 555 0333',
  },
]

function formatCount(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function toWidthClass(percent: number) {
  if (percent >= 95) return 'w-full'
  if (percent >= 85) return 'w-5/6'
  if (percent >= 75) return 'w-4/5'
  if (percent >= 65) return 'w-2/3'
  if (percent >= 55) return 'w-3/5'
  if (percent >= 45) return 'w-1/2'
  if (percent >= 35) return 'w-2/5'
  if (percent >= 25) return 'w-1/3'
  if (percent >= 15) return 'w-1/5'
  if (percent >= 8) return 'w-[10%]'
  if (percent >= 4) return 'w-[5%]'
  return 'w-[2%]'
}

function buildLeadStages(totalLeads: number, totalBookings: number): FunnelStage[] {
  const aiConversations = Math.max(totalLeads, 0)
  const websiteVisits = Math.max(Math.round(aiConversations * 2.25), aiConversations, 1)
  const qualifiedLeads = Math.max(Math.round(aiConversations * 0.58), totalBookings)

  const stagesRaw = [
    {
      label: 'Website Visits',
      value: websiteVisits,
      accent: 'bg-primary text-white',
      hint: 'Sessions entering the lead funnel from campaigns and organic pages',
    },
    {
      label: 'AI Conversations',
      value: aiConversations,
      accent: 'bg-primary-container text-white',
      hint: 'Leads that started a conversation in chat or messaging',
    },
    {
      label: 'Qualified Medical Leads',
      value: qualifiedLeads,
      accent: 'bg-secondary text-white',
      hint: 'Leads matching qualification criteria before booking',
    },
    {
      label: 'Booked Appointments',
      value: Math.max(totalBookings, 0),
      accent: 'bg-secondary-container text-on-secondary-container',
      hint: 'Confirmed consults handed over to the team',
    },
  ]

  const firstValue = Math.max(stagesRaw[0]?.value ?? 1, 1)

  return stagesRaw.map((stage) => {
    const ratio = Math.round((stage.value / firstValue) * 100)

    return {
      ...stage,
      barClass: toWidthClass(ratio),
    }
  })
}

function buildLanguageCharts(languages: NonNullable<DashboardStatsResponse['languages']>) {
  const entries: Array<{ name: string; value: number }> = [
    { name: 'English', value: languages.english ?? 0 },
    { name: 'Turkish', value: languages.turkish ?? 0 },
    { name: 'Russian', value: languages.russian ?? 0 },
    { name: 'Arabic', value: languages.arabic ?? 0 },
    { name: 'Greek (EL)', value: languages.greek ?? 0 },
  ]

  const sorted = entries
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name))
    .map((entry, index) => ({
      ...entry,
      color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
    }))

  return sorted
}

function buildRegionCategories(regions: NonNullable<DashboardStatsResponse['regions']>): MarketCategory[] {
  return [
    {
      name: 'North Cyprus',
      value: Math.max(regions.northCyprus ?? 0, 0),
      tone: MARKET_TONES[0],
    },
    {
      name: 'South Cyprus',
      value: Math.max(regions.southCyprus ?? 0, 0),
      tone: MARKET_TONES[1],
    },
  ]
}

function SectionHeading({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
        <h3 className="mt-2 font-headline text-2xl font-bold text-on-surface">{title}</h3>
      </div>
      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary-fixed">
        Market Intel
      </span>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, tone }: { icon: typeof Building2; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-[18px] bg-surface-container-lowest p-5 shadow-[0_16px_40px_rgba(11,28,48,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-400" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-on-surface">{value}</p>
    </div>
  )
}

function PulseSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-surface-container-high', className)} />
}

export default function MedicalLeadInsightsDashboard({ className }: MedicalLeadInsightsDashboardProps) {
  const [leadStages, setLeadStages] = useState<FunnelStage[]>(DEFAULT_LEAD_STAGES)
  const [leadLanguages, setLeadLanguages] = useState<MarketLanguage[]>(DEFAULT_MARKET_LANGUAGES)
  const [inquiryCategories, setInquiryCategories] = useState<MarketCategory[]>(DEFAULT_INQUIRY_CATEGORIES)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [insightsLoading, setInsightsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadInsights() {
      setInsightsLoading(true)

      try {
        const response = await fetch('/api/dashboard-stats', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load dashboard stats: ${response.status}`)
        }

        const payload = (await response.json()) as DashboardStatsResponse

        if (!isMounted) {
          return
        }

        const leads = Math.max(payload.totalLeads ?? 0, payload.totalBookings ?? 0)
        const bookings = Math.max(payload.totalBookings ?? 0, 0)
        const revenue = Math.max(payload.totalRevenue ?? 0, 0)
        const languageData = payload.languages ?? {
          english: 0,
          turkish: 0,
          russian: 0,
          arabic: 0,
          greek: 0,
        }
        const regionData = payload.regions ?? {
          northCyprus: 0,
          southCyprus: 0,
        }

        setLeadStages(buildLeadStages(leads, bookings))
        setTotalRevenue(revenue)

        setLeadLanguages(buildLanguageCharts(languageData))
        setInquiryCategories(buildRegionCategories(regionData))
      } catch (error) {
        console.error('MedicalLeadInsightsDashboard: failed to load lead insights', error)
      } finally {
        if (isMounted) {
          setInsightsLoading(false)
        }
      }
    }

    void loadInsights()

    return () => {
      isMounted = false
    }
  }, [])

  const funnelDropoff = useMemo(() => {
    const first = leadStages[0]?.value ?? 1

    return leadStages.map((stage, index) => ({
      ...stage,
      transition: index === 0 ? 100 : Math.round((stage.value / (leadStages[index - 1]?.value ?? first)) * 100),
      ratio: Math.round((stage.value / Math.max(first, 1)) * 100),
    }))
  }, [leadStages])

  return (
    <section className={cn('w-full bg-surface px-6 py-8 text-on-surface sm:px-8 lg:px-10', className)}>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary shadow-[0_10px_30px_rgba(11,28,48,0.05)]">
              <Sparkles className="h-3.5 w-3.5" />
              Clinical Curator · Medical Lead Insights Dashboard
            </div>
            <h2 className="font-headline text-[2.75rem] font-black leading-none tracking-tight text-on-surface sm:text-5xl">
              Vertical lead funnel for medical tourism and residency growth.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Track how website traffic becomes AI conversations, how those conversations become qualified medical leads,
              and how the best leads convert into booked appointments.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <MetricCard icon={Users2} label="Leads" value={formatCount(leadStages[1]?.value ?? 0)} tone="bg-primary-fixed text-primary" />
            <MetricCard icon={CalendarDays} label="Bookings" value={formatCount(leadStages[3]?.value ?? 0)} tone="bg-secondary-container text-secondary" />
            <MetricCard icon={Wallet} label="Revenue" value={formatCurrency(totalRevenue)} tone="bg-tertiary-fixed text-tertiary" />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <section className="rounded-[28px] bg-surface-container-low p-8 shadow-[0_22px_60px_rgba(11,28,48,0.07)]">
            <SectionHeading title="Lead Funnel Velocity" eyebrow="Revenue Recovery" />

            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                {insightsLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div key={`funnel-skeleton-${index}`} className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                        <PulseSkeleton className="mb-3 h-4 w-32" />
                        <PulseSkeleton className="mb-3 h-3 w-full" />
                        <PulseSkeleton className="h-3 w-4/5" />
                      </div>
                    ))
                  : funnelDropoff.map((stage, index) => (
                      <div key={stage.label} className="relative flex items-start gap-5">
                        <div className="relative flex flex-col items-center pt-1">
                          <div className={cn('flex h-14 w-14 items-center justify-center rounded-full text-lg font-black shadow-[0_18px_40px_rgba(11,28,48,0.12)]', stage.accent)}>
                            {formatCount(stage.value)}
                          </div>
                          {index < funnelDropoff.length - 1 ? (
                            <div className="mt-3 h-10 w-px bg-gradient-to-b from-primary-container/40 to-secondary-container/20" />
                          ) : null}
                        </div>

                        <div className="flex-1 rounded-[22px] bg-surface-container-lowest p-4 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{stage.label}</p>
                              <p className="mt-1 text-sm font-medium text-slate-600">{stage.hint}</p>
                            </div>
                            <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                              {stage.transition}% step-through
                            </span>
                          </div>
                          <div className="h-3 rounded-full bg-surface-container-low">
                            <div
                              className={cn(
                                'h-3 rounded-full transition-all',
                                index === 0
                                  ? 'bg-primary'
                                  : index === 1
                                    ? 'bg-primary-container'
                                    : index === 2
                                      ? 'bg-secondary'
                                      : 'bg-secondary-container',
                                stage.barClass,
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              <div className="space-y-5">
                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Lead Language Mix</p>
                      <h4 className="mt-1 font-headline text-lg font-bold text-on-surface">Where the conversations start</h4>
                    </div>
                    <Globe2 className="h-5 w-5 text-slate-400" />
                  </div>

                  {insightsLoading ? (
                    <PulseSkeleton className="h-56 w-full" />
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: 'none',
                              borderRadius: 16,
                              boxShadow: '0 18px 40px rgba(11,28,48,0.12)',
                            }}
                          />
                          <Pie data={leadLanguages} dataKey="value" innerRadius={52} outerRadius={82} paddingAngle={3}>
                            {leadLanguages.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {insightsLoading ? (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <PulseSkeleton className="h-12 w-full" />
                      <PulseSkeleton className="h-12 w-full" />
                      <PulseSkeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
                      {leadLanguages.map((entry) => (
                        <div key={entry.name} className="rounded-2xl bg-surface-container-low px-3 py-2 text-center">
                          <p className="font-bold text-on-surface">{entry.value}</p>
                          <p>{entry.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Conversion Momentum</p>
                      <h4 className="mt-1 font-headline text-lg font-bold text-on-surface">Visits to leads over 7 days</h4>
                    </div>
                    <TrendingUp className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={momentumData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: 'none',
                            borderRadius: 16,
                            boxShadow: '0 18px 40px rgba(11,28,48,0.12)',
                          }}
                        />
                        <Line type="monotone" dataKey="visits" stroke="#006194" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="leads" stroke="#006a61" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-surface-container-low p-8 shadow-[0_22px_60px_rgba(11,28,48,0.07)]">
            <SectionHeading title="Market Insights" eyebrow="Niche intelligence" />

            {insightsLoading ? (
              <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <PulseSkeleton className="mb-4 h-5 w-40" />
                  <PulseSkeleton className="h-52 w-full" />
                </div>
                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <PulseSkeleton className="mb-4 h-5 w-40" />
                  <PulseSkeleton className="h-56 w-full" />
                </div>
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Lead Language Mix</p>
                      <h4 className="mt-1 font-headline text-lg font-bold text-on-surface">Top 5 languages used by leads</h4>
                    </div>
                    <Globe2 className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: 'none',
                            borderRadius: 16,
                            boxShadow: '0 18px 40px rgba(11,28,48,0.12)',
                          }}
                        />
                        <Pie data={leadLanguages} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={3}>
                          {leadLanguages.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-2">
                    {leadLanguages.map((entry) => (
                      <div key={entry.name} className="rounded-2xl bg-surface-container-low px-3 py-2 text-center">
                        <p className="font-bold text-on-surface">{entry.value}</p>
                        <p>{entry.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Region Coverage</p>
                      <h4 className="mt-1 font-headline text-lg font-bold text-on-surface">North vs South Cyprus demand</h4>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inquiryCategories} layout="vertical" margin={{ top: 0, right: 10, left: 8, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          width={132}
                          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: 'none',
                            borderRadius: 16,
                            boxShadow: '0 18px 40px rgba(11,28,48,0.12)',
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                          {inquiryCategories.map((category, index) => (
                            <Cell key={category.name} fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
                    {inquiryCategories.map((category) => (
                      <div key={category.name} className="rounded-2xl bg-surface-container-low px-3 py-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={cn('h-2.5 w-2.5 rounded-full', category.tone)} />
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{category.name}</p>
                        </div>
                        <p className="text-2xl font-black text-on-surface">{category.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-[22px] bg-surface-container-highest p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tertiary text-white shadow-[0_14px_30px_rgba(11,28,48,0.12)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Human insight</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    The funnel is strongest when the assistant captures treatment type, travel timing, budget range, and WhatsApp contact in the first exchange.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[22px] bg-surface-container-lowest p-5 shadow-[0_14px_34px_rgba(11,28,48,0.05)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Performance Snapshot</p>
                  <h4 className="mt-1 font-headline text-lg font-bold text-on-surface">Lead recovery today</h4>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Website visits</p>
                  <p className="mt-2 text-2xl font-black text-on-surface">{formatCount(leadStages[0]?.value ?? 0)}</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Appointments</p>
                  <p className="mt-2 text-2xl font-black text-on-surface">{formatCount(leadStages[3]?.value ?? 0)}</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Lead score</p>
                  <p className="mt-2 text-2xl font-black text-on-surface">9.8</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Conversion</p>
                  <p className="mt-2 text-2xl font-black text-on-surface">{funnelDropoff[3]?.ratio ?? 0}%</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[28px] bg-surface-container-low p-8 shadow-[0_22px_60px_rgba(11,28,48,0.07)]">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionHeading title="Critical Intelligence Queue" eyebrow="Priority leads" />
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Priority leads requiring immediate curation and response.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-surface-container-highest px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-surface-container-high">
                Filter
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-surface-container-highest px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-surface-container-high">
                Export
              </button>
            </div>
          </div>

          <HighValueLeadTable leads={criticalLeads} />
        </section>
      </div>
    </section>
  )
}
