'use client'

import { ExternalLink, ShieldCheck } from 'lucide-react'

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

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, '')
}

function buildWhatsAppLink(lead: HighValueLead) {
  const message = [
    `Priority lead alert: ${lead.name}`,
    `Lead ID: ${lead.leadId}`,
    `Specialty: ${lead.specialty}`,
    `Priority Score: ${lead.score.toFixed(1)}`,
    `Context: ${lead.note}`,
  ].join('\n')

  return `https://wa.me/${normalizePhone(lead.phone)}?text=${encodeURIComponent(message)}`
}

export default function HighValueLeadTable({ leads }: HighValueLeadTableProps) {
  return (
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
            const whatsAppLink = buildWhatsAppLink(lead)

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
                      <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(0,97,148,0.18)] transition hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Take Action
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
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
  )
}
