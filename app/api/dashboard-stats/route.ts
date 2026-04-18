import { NextResponse } from 'next/server'

type AirtableRecord = {
  id: string
  fields?: Record<string, unknown>
}

type AirtablePageResponse = {
  records?: AirtableRecord[]
  offset?: string
}

type LanguageBreakdown = {
  english: number
  turkish: number
  russian: number
  arabic: number
  greek: number
}

type RegionBreakdown = {
  northCyprus: number
  southCyprus: number
}

const LANGUAGE_FIELDS = ['Lead Language', 'Language', 'Preferred Language']
const REVENUE_FIELDS = ['Value', 'Booking Value', 'Revenue']
const REGION_FIELDS = ['Region', 'Market Region', 'Location', 'Area', 'City']

function toTextArray(value: unknown): string[] {
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

function readFirstMatchingField(fields: Record<string, unknown>, candidates: string[]): string[] {
  for (const fieldName of candidates) {
    const values = toTextArray(fields[fieldName])
    if (values.length > 0) {
      return values
    }
  }

  return []
}

function parseRevenueValue(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const numeric = Number(value.replace(/[^\d.-]/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }

  return 0
}

function getRevenueFromFields(fields: Record<string, unknown>): number {
  for (const key of REVENUE_FIELDS) {
    const amount = parseRevenueValue(fields[key])
    if (amount !== 0) {
      return amount
    }
  }

  return 0
}

function normalizeLanguage(language: string): keyof LanguageBreakdown | null {
  const normalized = language.trim().toLowerCase()

  if (normalized === 'english' || normalized === 'en') return 'english'
  if (normalized === 'turkish' || normalized === 'tr' || normalized === 'turkce' || normalized === 'türkçe') return 'turkish'
  if (normalized === 'russian' || normalized === 'ru') return 'russian'
  if (normalized === 'arabic' || normalized === 'ar') return 'arabic'
  if (normalized === 'greek' || normalized === 'el' || normalized === 'gr') return 'greek'

  return null
}

function normalizeRegion(region: string): keyof RegionBreakdown | null {
  const normalized = region.trim().toLowerCase()

  if (
    normalized.includes('south') ||
    normalized.includes('republic of cyprus') ||
    normalized.includes('roc') ||
    normalized.includes('limassol') ||
    normalized.includes('paphos') ||
    normalized.includes('larnaca')
  ) {
    return 'southCyprus'
  }

  if (
    normalized.includes('north') ||
    normalized.includes('trnc') ||
    normalized.includes('northern cyprus') ||
    normalized.includes('kyrenia') ||
    normalized.includes('lefkosa') ||
    normalized.includes('famagusta')
  ) {
    return 'northCyprus'
  }

  return null
}

async function fetchAirtableLeads(): Promise<AirtableRecord[]> {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim()
  const baseId = process.env.AIRTABLE_BASE_ID?.trim()
  const tableName = process.env.AIRTABLE_LEADS_TABLE?.trim()

  if (!apiKey || !baseId || !tableName) {
    return []
  }

  const records: AirtableRecord[] = []
  let offset: string | undefined

  while (true) {
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
      throw new Error(`Airtable request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as AirtablePageResponse
    records.push(...(payload.records ?? []))

    if (!payload.offset) {
      break
    }

    offset = payload.offset
  }

  return records
}

export async function GET() {
  try {
    const records = await fetchAirtableLeads()

    const languages: LanguageBreakdown = {
      english: 0,
      turkish: 0,
      russian: 0,
      arabic: 0,
      greek: 0,
    }
    const regions: RegionBreakdown = {
      northCyprus: 0,
      southCyprus: 0,
    }
    let totalRevenue = 0

    for (const record of records) {
      const fields = record.fields ?? {}
      totalRevenue += getRevenueFromFields(fields)

      const leadLanguages = readFirstMatchingField(fields, LANGUAGE_FIELDS)
      for (const language of leadLanguages) {
        const key = normalizeLanguage(language)
        if (key) {
          languages[key] += 1
        }
      }

      const leadRegions = readFirstMatchingField(fields, REGION_FIELDS)
      for (const region of leadRegions) {
        const key = normalizeRegion(region)
        if (key) {
          regions[key] += 1
        }
      }
    }

    return NextResponse.json({
      source: 'airtable',
      totalLeads: records.length,
      totalBookings: records.length,
      totalRevenue,
      languages,
      regions,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GET /api/dashboard-stats failed', error)

    return NextResponse.json(
      {
        source: 'none',
        totalLeads: 0,
        totalBookings: 0,
        totalRevenue: 0,
        languages: {
          english: 0,
          turkish: 0,
          russian: 0,
          arabic: 0,
          greek: 0,
        },
        regions: {
          northCyprus: 0,
          southCyprus: 0,
        },
        generatedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
