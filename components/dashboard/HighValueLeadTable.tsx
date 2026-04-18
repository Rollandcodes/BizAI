'use client'

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, MessageCircleReply, ShieldCheck, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export type HighValueLead = {
  name: string
  leadId: string
  specialty: string
  score: number
  progressClass: string
  note: string
  phone: string
}

type HighValueLeadTableProps = {
  leads: HighValueLead[]
}

type LeadHistoryApiResponse = {
  leadId: string
  source: 'airtable' | 'none'
  conversationHistory: string[]
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, '')
}

function buildAiReply(lead: HighValueLead, conversationHistory: string[]) {
  const lastContext = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : lead.note

  return [
    `Hi ${lead.name}, thank you for your inquiry regarding ${lead.specialty}.`,
    'I reviewed your request and can help you with the next step today.',
    `Based on your message: "${lastContext}"`,
    'Would you like me to share available slots and pricing details now?',
  ].join('\n\n')
}

export default function HighValueLeadTable({ leads }: HighValueLeadTableProps) {
  const [selectedLead, setSelectedLead] = useState<HighValueLead | null>(null)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchHistory() {
      if (!selectedLead) {
        setConversationHistory([])
        return
      }

      setHistoryLoading(true)

      try {
        const query = new URLSearchParams({ leadId: selectedLead.leadId, phone: selectedLead.phone })
        const response = await fetch(`/api/leads/history?${query.toString()}`, { cache: 'no-store' })

        if (!response.ok) {
          throw new Error(`Failed to load conversation history: ${response.status}`)
        }

        const payload = (await response.json()) as LeadHistoryApiResponse
        if (isMounted) {
          setConversationHistory(payload.conversationHistory ?? [])
        }
      } catch (error) {
        console.error('HighValueLeadTable: failed to fetch lead history', error)
        if (isMounted) {
          setConversationHistory([])
        }
      } finally {
        if (isMounted) {
          setHistoryLoading(false)
        }
      }
    }

    void fetchHistory()

    return () => {
      isMounted = false
    }
  }, [selectedLead])

  const replyLink = useMemo(() => {
    if (!selectedLead) {
      return ''
    }

    const phone = normalizePhone(selectedLead.phone)
    const aiReply = buildAiReply(selectedLead, conversationHistory)
    return `https://wa.me/${phone}?text=${encodeURIComponent(aiReply)}`
  }, [selectedLead, conversationHistory])

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left">
            <th className="px-4 pb-3 text-[10px] uppercase tracking-[0.25em] text-slate-500">Patient Lead</th>
            <th className="px-4 pb-3 text-[10px] uppercase tracking-[0.25em] text-slate-500">Specialty Category</th>
            <th className="px-4 pb-3 text-[10px] uppercase tracking-[0.25em] text-slate-500">Priority Score</th>
            <th className="px-4 pb-3 text-right text-[10px] uppercase tracking-[0.25em] text-slate-500">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isHighValue = lead.score > 8

            return (
              <tr
                key={lead.leadId}
                className={cn(
                  'group transition hover:bg-surface-container-high',
                  isHighValue ? 'animate-pulse [animation-duration:2.4s]' : '',
                )}
              >
                <td className="bg-surface-container-lowest px-4 py-5 first:rounded-l-2xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-fixed text-sm font-black text-primary">
                      {lead.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-on-surface">{lead.name}</p>
                        {isHighValue ? (
                          <span className="relative inline-flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500">Lead ID: {lead.leadId}</p>
                    </div>
                  </div>
                </td>
                <td className="bg-surface-container-lowest px-4 py-5">
                  <span className="inline-flex rounded-full bg-primary-fixed px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                    {lead.specialty}
                  </span>
                </td>
                <td className="bg-surface-container-lowest px-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn('text-lg font-black', isHighValue ? 'text-red-600' : 'text-tertiary')}>
                      {lead.score.toFixed(1)}
                    </div>
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-surface-container-low">
                      <div className={cn('h-2 rounded-full', isHighValue ? 'bg-red-500' : 'bg-tertiary', lead.progressClass)} />
                    </div>
                  </div>
                </td>
                <td className="bg-surface-container-lowest px-4 py-5 text-right last:rounded-r-2xl">
                  <div className="flex items-center justify-end gap-3">
                    <div className="hidden text-right lg:block">
                      <p className={cn('text-xs font-semibold', isHighValue ? 'text-red-600' : 'text-slate-500')}>
                        {lead.note}
                      </p>
                    </div>
                    {isHighValue ? (
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(0,97,148,0.18)] transition hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Take Action
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-2 rounded-lg bg-surface-container-high px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-surface-container-highest">
                        View Details
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        </table>
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-surface-container-low p-6 shadow-[0_28px_70px_rgba(11,28,48,0.35)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Priority Lead Action</p>
                <h3 className="mt-2 text-2xl font-black text-on-surface">{selectedLead.name}</h3>
                <p className="mt-1 text-sm text-slate-600">Lead ID: {selectedLead.leadId} · {selectedLead.specialty}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-slate-600 hover:bg-surface-container-highest"
                aria-label="Close action modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Full Conversation History</h4>
                <span className="text-xs font-semibold text-slate-500">Source: Airtable</span>
              </div>

              <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
                {historyLoading ? (
                  <>
                    <div className="h-16 animate-pulse rounded-xl bg-surface-container-high" />
                    <div className="h-16 animate-pulse rounded-xl bg-surface-container-high" />
                    <div className="h-16 animate-pulse rounded-xl bg-surface-container-high" />
                  </>
                ) : conversationHistory.length > 0 ? (
                  conversationHistory.map((message, index) => (
                    <div key={`history-${index}`} className="rounded-xl bg-surface-container-low p-3 text-sm leading-6 text-slate-700">
                      {message}
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl bg-surface-container-low p-4 text-sm text-slate-600">
                    No Airtable history found for this lead yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <a
                href={replyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_14px_32px_rgba(0,97,148,0.18)] transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircleReply className="h-4 w-4" />
                Reply via WhatsApp
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
