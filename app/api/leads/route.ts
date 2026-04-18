import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase'

type AirtableRecord = {
  id: string
  fields: Record<string, unknown>
}

type AirtablePageResponse = {
  records?: AirtableRecord[]
  offset?: string
}

type ConversationRow = {
  id: string
  messages: Array<{ role: string; content: string }> | null
  lead_captured: boolean | null
}

function toTextArray(value: unknown): string[] {
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim())
  }

  return []
}

function inferLanguageFromMessage(messages: Array<{ role: string; content: string }> | null): string {
  const userMessage = messages?.find((message) => message.role === 'user')?.content ?? ''

  if (/[\u0600-\u06FF]/.test(userMessage)) return 'Arabic'
  if (/[\u0400-\u04FF]/.test(userMessage)) return 'Russian'
  if (/[\u0370-\u03FF]/.test(userMessage)) return 'Greek'
  if (/[şğüöçıİŞĞÜÖÇ]/i.test(userMessage)) return 'Turkish'

  return 'English'
}

function inferProcedureType(messages: Array<{ role: string; content: string }> | null): string {
  const text = (messages ?? []).map((message) => message.content).join(' ').toLowerCase()

  if (text.includes('ivf')) return 'IVF'
  if (text.includes('dental') || text.includes('implant')) return 'Dental'
  if (text.includes('aesthetic') || text.includes('cosmetic')) return 'Aesthetics'
  if (text.includes('residency') || text.includes('property')) return 'Residency'

  return 'General Inquiry'
}

async function fetchAirtableRecords(): Promise<AirtableRecord[]> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim()
  const baseId = process.env.AIRTABLE_BASE_ID?.trim()
  const tableName = process.env.AIRTABLE_LEADS_TABLE?.trim()

  if (!apiKey || !baseId || !tableName) {
    return []
  }

  const records: AirtableRecord[] = []
  let offset: string | undefined

  for (let page = 0; page < 10; page += 1) {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`)
    url.searchParams.set('pageSize', '100')

    if (offset) {
      url.searchParams.set('offset', offset)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Airtable request failed: ${response.status}`)
    }

    const payload = (await response.json()) as AirtablePageResponse
    for (const record of payload.records ?? []) {
      records.push(record)
    }

    if (!payload.offset) {
      break
    }

    offset = payload.offset
  }

  return records
}

async function fetchSupabaseLeadFallback(): Promise<AirtableRecord[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('id,messages,lead_captured')
    .eq('lead_captured', true)
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) {
    throw error
  }

  return ((data ?? []) as ConversationRow[]).map((row) => {
    const procedureType = inferProcedureType(row.messages)
    const leadLanguage = inferLanguageFromMessage(row.messages)

    const booked = (row.messages ?? []).some((message) =>
      /booked|appointment confirmed|confirmed consult/i.test(message.content),
    )

    return {
      id: row.id,
      fields: {
        'Procedure Type': procedureType,
        'Lead Language': leadLanguage,
        'Booked Appointment': booked,
      },
    }
  })
}

function normalizeAirtableRecords(records: AirtableRecord[]): AirtableRecord[] {
  return records.map((record) => {
    const fields = record.fields ?? {}

    return {
      id: record.id,
      fields: {
        ...fields,
        'Procedure Type': toTextArray(fields['Procedure Type']),
        'Lead Language': toTextArray(fields['Lead Language']),
      },
    }
  })
}

export async function GET() {
  try {
    const airtableRecords = await fetchAirtableRecords()
    if (airtableRecords.length > 0) {
      return NextResponse.json({ records: normalizeAirtableRecords(airtableRecords), source: 'airtable' })
    }

    const fallbackRecords = await fetchSupabaseLeadFallback()
    return NextResponse.json({ records: normalizeAirtableRecords(fallbackRecords), source: 'supabase' })
  } catch (error) {
    console.error('GET /api/leads failed', error)
    return NextResponse.json({ records: [], source: 'none' }, { status: 200 })
  }
}
