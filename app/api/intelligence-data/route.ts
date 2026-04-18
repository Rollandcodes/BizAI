import { NextRequest, NextResponse } from "next/server";

interface RawLeadRecord {
  Lead_ID?: string;
  [key: string]: unknown;
}

interface IntelligenceMetrics {
  source: "airtable" | "none";
  regionBreakdown: Record<string, number>; // Girne, Iskele, Limassol, Paphos, Other
  languageBreakdown: Record<string, number>; // Arabic, Russian, English, Other
  regulatoryPulse: Array<{ keyword: string; count: number; category: string }>;
  revenueProjection: {
    totalProjected: number;
    averageLead: number;
    topTier: number; // 30th percentile
    midTier: number; // 70th percentile
    leadCount: number;
  };
  generatedAt: string;
}

// Extract city from location field
function normalizeCity(location: string | undefined | null): string {
  if (!location) return "Other";
  const loc = String(location).toLowerCase().trim();

  if (loc.includes("girne") || loc.includes("kyrenia")) return "Girne";
  if (loc.includes("iskele") || loc.includes("boğaziçi")) return "Iskele";
  if (loc.includes("limassol") || loc.includes("lemesos")) return "Limassol";
  if (loc.includes("paphos") || loc.includes("pafos")) return "Paphos";
  if (loc.includes("larnaca") || loc.includes("larnaka")) return "Larnaca";
  if (loc.includes("nicosia") || loc.includes("lefkosa") || loc.includes("nicoşia")) return "Nicosia";
  if (loc.includes("famagusta") || loc.includes("magusa")) return "Famagusta";
  
  return "Other";
}

// Extract language
function normalizeLanguage(lang: string | undefined | null): string {
  if (!lang) return "Other";
  const l = String(lang).toLowerCase().trim();

  if (l.includes("arabic") || l === "ar") return "Arabic";
  if (l.includes("russian") || l === "ru") return "Russian";
  if (l.includes("english") || l === "en") return "English";
  if (l.includes("turkish") || l === "tr") return "Turkish";
  if (l.includes("greek") || l === "el") return "Greek";

  return "Other";
}

// Extract budget/transaction value from lead data
function extractBudget(record: Record<string, unknown>): number {
  const budgetFields = [
    "Budget",
    "Budget USD",
    "Stated Budget",
    "Transaction Value",
    "Project Value",
    "Property Budget",
    "Investment Amount",
    "Estimated Value",
  ];

  for (const field of budgetFields) {
    const value = record[field];
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (!isNaN(num) && num > 0) return num;
    }
  }

  return 0;
}

// Extract regulatory keywords from conversation or interest field
function extractRegulatoryKeywords(record: Record<string, unknown>): Array<{ keyword: string; category: string }> {
  const keywords: Array<{ keyword: string; category: string }> = [];
  const interestFields = [
    "Interest",
    "Inquiry Type",
    "Service Type",
    "Property Type",
    "Procedure Type",
    "Conversation Summary",
  ];

  const regulatoryKeywords = {
    residency: ["residency", "residency law 2026", "permanent residency", "fast-track", "regulation 6.2", "visa"],
    property: ["property", "real estate", "investment", "development", "title deed", "vat exemption", "tax"],
    medical: ["ivf", "fertility", "cardiology", "healthcare", "treatment", "dental", "surgery", "medical"],
    business: ["business license", "company formation", "employment", "work permit", "tax id"],
  };

  let text = "";
  for (const field of interestFields) {
    if (record[field]) {
      text += String(record[field]).toLowerCase() + " ";
    }
  }

  for (const [category, terms] of Object.entries(regulatoryKeywords)) {
    for (const term of terms) {
      if (text.includes(term)) {
        keywords.push({ keyword: term, category });
      }
    }
  }

  return keywords;
}

async function fetchAirtableIntelligenceData(): Promise<IntelligenceMetrics> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!apiKey || !baseId) {
    console.warn("Airtable credentials missing");
    return {
      source: "none",
      regionBreakdown: {},
      languageBreakdown: {},
      regulatoryPulse: [],
      revenueProjection: {
        totalProjected: 0,
        averageLead: 0,
        topTier: 0,
        midTier: 0,
        leadCount: 0,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  const regionCounts: Record<string, number> = {};
  const languageCounts: Record<string, number> = {};
  const regulatoryKeywordCounts: Record<string, { keyword: string; category: string; count: number }> = {};
  const budgets: number[] = [];

  let offset: string | undefined;
  let page = 0;
  const maxPages = 50; // Safety limit

  try {
    while (page < maxPages) {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableName}`);
      url.searchParams.set("pageSize", "100");
      if (offset) url.searchParams.set("offset", offset);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        console.error(`Airtable fetch failed: ${response.statusText}`);
        break;
      }

      const data = (await response.json()) as {
        records: Array<{ fields: RawLeadRecord }>;
        offset?: string;
      };

      for (const record of data.records) {
        const fields = record.fields as Record<string, unknown>;

        // Region breakdown
        const region = String(fields.Region || fields.Location || "").trim();
        const city = normalizeCity(region);
        regionCounts[city] = (regionCounts[city] || 0) + 1;

        // Language breakdown
        const language = String(fields.Language || fields["Lead Language"] || "").trim();
        const lang = normalizeLanguage(language);
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;

        // Regulatory keywords
        const keywords = extractRegulatoryKeywords(fields);
        for (const { keyword, category } of keywords) {
          const key = `${keyword}-${category}`;
          if (!regulatoryKeywordCounts[key]) {
            regulatoryKeywordCounts[key] = { keyword, category, count: 0 };
          }
          regulatoryKeywordCounts[key].count += 1;
        }

        // Revenue projection (from stated budgets)
        const budget = extractBudget(fields);
        if (budget > 0) {
          budgets.push(budget);
        }
      }

      offset = data.offset;
      if (!offset) break;

      page += 1;
    }

    // Calculate revenue metrics
    let totalProjected = 0;
    let topTier = 0;
    let midTier = 0;

    if (budgets.length > 0) {
      totalProjected = budgets.reduce((a, b) => a + b, 0);

      budgets.sort((a, b) => b - a);
      // Top tier: 30th percentile (highest earners)
      const topIdx = Math.floor(budgets.length * 0.3);
      topTier = budgets[topIdx] || 0;
      // Mid tier: 70th percentile
      const midIdx = Math.floor(budgets.length * 0.7);
      midTier = budgets[midIdx] || 0;
    }

    // Sort regulatory pulse by frequency
    const regulatoryPulse = Object.values(regulatoryKeywordCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(({ keyword, category, count }) => ({ keyword, count, category }));

    return {
      source: "airtable",
      regionBreakdown: regionCounts,
      languageBreakdown: languageCounts,
      regulatoryPulse,
      revenueProjection: {
        totalProjected,
        averageLead: budgets.length ? totalProjected / budgets.length : 0,
        topTier,
        midTier,
        leadCount: budgets.length,
      },
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Airtable intelligence fetch error:", error);
    return {
      source: "none",
      regionBreakdown: regionCounts,
      languageBreakdown: languageCounts,
      regulatoryPulse: [],
      revenueProjection: {
        totalProjected: 0,
        averageLead: 0,
        topTier: 0,
        midTier: 0,
        leadCount: 0,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}

export async function GET(_request: NextRequest) {
  const data = await fetchAirtableIntelligenceData();
  return NextResponse.json(data);
}
