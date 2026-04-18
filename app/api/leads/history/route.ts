import { NextRequest, NextResponse } from 'next/server'

type AirtableRecord = {
  id: string
  fields?: Record<string, unknown>
}

type AirtablePageResponse = {
  records?: AirtableRecord[]
  offset?: string
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

function extractConversationHistory(fields: Record<string, unknown>): string[] {
  const candidates = [
    fields['Conversation History'],
    fields['Full Conversation'],
    fields['Messages'],
    fields['Conversation'],
  ]

  for (const candidate of candidates) {
    const textEntries = toTextArray(candidate)
    if (textEntries.length > 0) {
      return textEntries
    }
  }

  return []
}

function matchLead(fields: Record<string, unknown>, leadId: string, phone: string) {
  const leadIdCandidates = [fields['Lead ID'], fields['lead_id'], fields['LeadId'], fields['ID']]
  const phoneCandidates = [fields['Phone'], fields['Customer Phone'], fields['WhatsApp'], fields['Phone Number']]

  const normalizedLeadId = leadId.trim().toLowerCase()
  const normalizedPhone = phone.replace(/[^\d]/g, '')

  const leadIdMatch = leadIdCandidates.some((value) => {
    if (typeof value !== 'string') {
      return false
    }

    return value.trim().toLowerCase() === normalizedLeadId
  })

  const phoneMatch = phoneCandidates.some((value) => {
    if (typeof value !== 'string') {
      return false
    }

    return value.replace(/[^\d]/g, '') === normalizedPhone
  })

  return leadIdMatch || phoneMatch
}

async function fetchAirtableLeadHistory(params: { leadId: string; phone: string }): Promise<string[]> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim()
  const baseId = process.env.AIRTABLE_BASE_ID?.trim()
  const tableName = process.env.AIRTABLE_LEADS_TABLE?.trim()

  if (!apiKey || !baseId || !tableName) {
    return []
  }

  let offset: string | undefined

  for (let page = 0; page < 20; page += 1) {
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
      const fields = record.fields ?? {}
      if (matchLead(fields, params.leadId, params.phone)) {
        return extractConversationHistory(fields)
      }
    }

    if (!payload.offset) {
      break
    }

    offset = payload.offset
  }

  return []
}

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get('leadId')?.trim() ?? ''
  const phone = req.nextUrl.searchParams.get('phone')?.trim() ?? ''

  if (!leadId && !phone) {
    return NextResponse.json({ error: 'leadId or phone required' }, { status: 400 })
  }

  try {
    const conversationHistory = await fetchAirtableLeadHistory({ leadId, phone })

    return NextResponse.json({
      leadId,
      source: 'airtable',
      conversationHistory,
    })
  } catch (error) {
    console.error('GET /api/leads/history failed', error)

    return NextResponse.json({
      leadId,
      source: 'none',
      conversationHistory: [],
    })
  }
}
