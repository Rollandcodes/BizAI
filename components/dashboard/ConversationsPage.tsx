'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, Search, Sparkles, User } from 'lucide-react'

type AirtableLeadRecord = {
  id: string
  fields?: Record<string, unknown>
}

type LeadsApiResponse = {
  records?: AirtableLeadRecord[]
}

type LeadHistoryApiResponse = {
  leadId: string
  source: 'airtable' | 'none'
  conversationHistory: string[]
}

type LeadItem = {
  id: string
  leadId: string
  name: string
  phone: string
  interest: string
  priorityScore: number
  sentiment: 'Hot Lead' | 'Price Sensitive' | 'Ready to Book'
}

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''))
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return 0
}

function readStringArray(value: unknown): string[] {
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()]
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim())
  }

  return []
}

function getSentimentFromScore(score: number): LeadItem['sentiment'] {
  if (score >= 9.2) return 'Hot Lead'
  if (score >= 8.3) return 'Ready to Book'
  return 'Price Sensitive'
}

function getSentimentTagClass(sentiment: LeadItem['sentiment']) {
  if (sentiment === 'Hot Lead') return 'bg-red-500/15 border-red-400/40 text-red-300'
  if (sentiment === 'Ready to Book') return 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
  return 'bg-amber-500/15 border-amber-400/40 text-amber-200'
}

function mapLead(record: AirtableLeadRecord): LeadItem {
  const fields = record.fields ?? {}
  const name =
    readText(fields['Name']) ||
    readText(fields['Full Name']) ||
    readText(fields['Customer Name']) ||
    'Unnamed Lead'

  const leadId =
    readText(fields['Lead ID']) ||
    readText(fields['lead_id']) ||
    readText(fields['LeadId']) ||
    record.id

  const phone =
    readText(fields['Phone']) ||
    readText(fields['Customer Phone']) ||
    readText(fields['WhatsApp']) ||
    readText(fields['Phone Number'])

  const procedureInterest = readStringArray(fields['Procedure Type'])
  const propertyInterest = readStringArray(fields['Property Interest'])
  const interest = procedureInterest[0] || propertyInterest[0] || readText(fields['Interest']) || 'General Inquiry'

  const explicitScore =
    readNumber(fields['Priority Score']) ||
    readNumber(fields['Lead Score']) ||
    readNumber(fields['Score'])

  const booked = fields['Booked Appointment'] === true || /booked/i.test(readText(fields['Lead Stage']))
  const derivedScore = booked ? 9.4 : Math.min(9.1, 7.4 + Math.min(1.6, interest.length / 20))
  const priorityScore = explicitScore > 0 ? explicitScore : Number(derivedScore.toFixed(1))

  return {
    id: record.id,
    leadId,
    name,
    phone,
    interest,
    priorityScore,
    sentiment: getSentimentFromScore(priorityScore),
  }
}

export default function ConversationsPage() {
  const [search, setSearch] = useState('')
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [activeLeadId, setActiveLeadId] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadLeads() {
      setLeadsLoading(true)

      try {
        const response = await fetch('/api/leads', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load leads: ${response.status}`)
        }

        const payload = (await response.json()) as LeadsApiResponse
        const mappedLeads = (payload.records ?? [])
          .map(mapLead)
          .sort((left, right) => right.priorityScore - left.priorityScore)

        if (!isMounted) {
          return
        }

        setLeads(mappedLeads)

        if (mappedLeads.length > 0) {
          setActiveLeadId(mappedLeads[0].id)
        }
      } catch (error) {
        console.error('ConversationsPage: failed to load leads', error)
        if (isMounted) {
          setLeads([])
        }
      } finally {
        if (isMounted) {
          setLeadsLoading(false)
        }
      }
    }

    void loadLeads()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return leads
    }

    return leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.interest.toLowerCase().includes(query) ||
        lead.sentiment.toLowerCase().includes(query)
      )
    })
  }, [leads, search])

  const activeLead = useMemo(() => {
    return filteredLeads.find((lead) => lead.id === activeLeadId) ?? leads.find((lead) => lead.id === activeLeadId) ?? null
  }, [filteredLeads, leads, activeLeadId])

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      if (!activeLead) {
        setHistory([])
        return
      }

      setHistoryLoading(true)

      try {
        const params = new URLSearchParams({
          leadId: activeLead.leadId,
          phone: activeLead.phone,
        })

        const response = await fetch(`/api/leads/history?${params.toString()}`, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to load lead history: ${response.status}`)
        }

        const payload = (await response.json()) as LeadHistoryApiResponse

        if (!isMounted) {
          return
        }

        setHistory(payload.conversationHistory ?? [])
      } catch (error) {
        console.error('ConversationsPage: failed to load conversation history', error)
        if (isMounted) {
          setHistory([])
        }
      } finally {
        if (isMounted) {
          setHistoryLoading(false)
        }
      }
    }

    void loadHistory()

    return () => {
      isMounted = false
    }
  }, [activeLead])

  return (
    <div className="h-[calc(100vh-160px)] grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Recent Leads
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, interest, sentiment..."
              className="w-full rounded-xl border border-white/10 bg-[#090914] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-primary/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {leadsLoading ? (
            <>
              <div className="h-24 animate-pulse rounded-xl bg-white/5" />
              <div className="h-24 animate-pulse rounded-xl bg-white/5" />
              <div className="h-24 animate-pulse rounded-xl bg-white/5" />
            </>
          ) : filteredLeads.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/65">
              No leads found for your current search.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isActive = activeLead?.id === lead.id

              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setActiveLeadId(lead.id)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-white">{lead.name}</p>
                    <span className="text-xs font-bold text-primary">{lead.priorityScore.toFixed(1)}</span>
                  </div>
                  <p className="mb-2 line-clamp-1 text-xs text-white/70">{lead.interest}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getSentimentTagClass(lead.sentiment)}`}>
                      {lead.sentiment}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">Lead ID {lead.leadId}</span>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </section>

      <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 p-4">
          {activeLead ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">{activeLead.name}</h2>
                <p className="text-xs text-white/60">{activeLead.interest}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <MessageSquare className="h-4 w-4 text-primary" />
                Full conversation transcript
              </div>
            </div>
          ) : (
            <div className="text-sm text-white/60">Select a lead to view the full transcript.</div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {historyLoading ? (
            <div className="space-y-3">
              <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-white/5" />
              <div className="ml-auto h-16 w-2/3 animate-pulse rounded-2xl bg-white/5" />
              <div className="h-16 w-4/5 animate-pulse rounded-2xl bg-white/5" />
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/65">
              No conversation history was found for this lead.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry, index) => {
                const isAgent = /^ai:|^assistant:|^agent:/i.test(entry.trim()) || index % 2 === 0

                return (
                  <div key={`${activeLead?.id ?? 'lead'}-${index}`} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isAgent
                          ? 'rounded-tl-md border border-primary/30 bg-primary/12 text-white'
                          : 'rounded-tr-md border border-white/15 bg-white/[0.06] text-white/95'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45">
                        {isAgent ? <Sparkles className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-white/60" />}
                        {isAgent ? 'Assistant' : 'Lead'}
                      </div>
                      <p>{entry}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
