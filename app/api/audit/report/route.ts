import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@/lib/supabase';
import { getAuthenticatedUser, hasAgencyAccess } from '@/lib/clerk-auth';

type ConversationRow = {
  id: string;
  created_at: string;
  messages: Array<{ role: string; content: string }> | null;
  ai_safety_score: number | null;
  flagged: boolean | null;
  flag_reason: string | null;
  sensitive_data_detected: boolean | null;
};

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey });
}

function deriveTopIssues(rows: ConversationRow[]): string[] {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.flagged && row.flag_reason) {
      for (const r of row.flag_reason.split(',').map((s) => s.trim()).filter(Boolean)) {
        counts[r] = (counts[r] ?? 0) + 1;
      }
    }
    if (row.sensitive_data_detected) {
      counts['Sensitive data detected'] = (counts['Sensitive data detected'] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue, count]) => `${issue}: ${count} time${count > 1 ? 's' : ''}`);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { businessId?: string };
  try {
    body = (await req.json()) as { businessId?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { businessId } = body;
  if (!businessId) {
    return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
  }

  const authUser = await getAuthenticatedUser();
  if (!authUser?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const { data: businessAccess, error: businessAccessError } = await supabase
      .from('businesses')
      .select('id, owner_email')
      .eq('id', businessId)
      .single();

    if (businessAccessError || !businessAccess) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (!hasAgencyAccess(authUser.email) && businessAccess.owner_email !== authUser.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch conversations + business in parallel
    const [{ data: convData, error: convError }, { data: bizData, error: bizError }] =
      await Promise.all([
        supabase
          .from('conversations')
          .select('id, created_at, messages, ai_safety_score, flagged, flag_reason, sensitive_data_detected')
          .eq('business_id', businessId)
          .gte('created_at', thirtyDaysAgo)
          .order('created_at', { ascending: false }),
        supabase
          .from('businesses')
          .select('id, business_name, business_type, owner_email')
          .eq('id', businessId)
          .single(),
      ]);

    if (convError) throw convError;
    if (bizError) throw bizError;

    const rows = (convData ?? []) as ConversationRow[];
    const business = bizData as { id: string; business_name: string; business_type: string; owner_email: string };

    const totalConversations = rows.length;
    const flaggedCount = rows.filter((r) => r.flagged).length;
    const scoredRows = rows.filter((r) => r.ai_safety_score !== null);
    const avgSafetyScore =
      scoredRows.length > 0
        ? Math.round(scoredRows.reduce((s, r) => s + (r.ai_safety_score ?? 0), 0) / scoredRows.length)
        : null;
    const sensitiveDataIncidents = rows.filter((r) => r.sensitive_data_detected).length;
    const topIssues = deriveTopIssues(rows);

    // AI-generated executive summary
    let aiSummary = '';
    try {
      const openai = getOpenAIClient();
      const summaryPrompt = `Write a professional 2-3 sentence compliance report summary for a business.

Business: ${business.business_name} (${business.business_type})
Period: Last 30 days
Total conversations: ${totalConversations}
Flagged conversations: ${flaggedCount}
Average safety score: ${avgSafetyScore ?? 'N/A'}/100
Sensitive data incidents: ${sensitiveDataIncidents}
Top issues: ${topIssues.join('; ') || 'None detected'}

Write a professional, factual summary suitable for stakeholders or regulators.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: summaryPrompt }],
        max_tokens: 200,
        temperature: 0.4,
      });
      aiSummary = completion.choices[0]?.message?.content?.trim() ?? '';
    } catch (err) {
      console.error('Audit report: AI summary failed', err);
      aiSummary = `This report covers ${totalConversations} conversations in the last 30 days for ${business.business_name}. ${flaggedCount} conversation(s) were flagged for review. Average AI safety score: ${avgSafetyScore ?? 'N/A'}/100.`;
    }

    // Save report to audit_reports table
    const today = new Date().toISOString().slice(0, 10);
    const { data: savedReport, error: saveError } = await supabase
      .from('audit_reports')
      .upsert(
        {
          business_id: businessId,
          report_date: today,
          total_conversations: totalConversations,
          flagged_count: flaggedCount,
          avg_safety_score: avgSafetyScore,
          sensitive_data_incidents: sensitiveDataIncidents,
          top_issues: topIssues,
          ai_summary: aiSummary,
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id,report_date' }
      )
      .select('id')
      .single();

    if (saveError) {
      // Non-fatal: report save failed but we can still return the data
      console.error('Audit report save error:', saveError);
    }

    return NextResponse.json({
      reportId: savedReport?.id ?? null,
      businessName: business.business_name,
      businessType: business.business_type,
      periodStart: thirtyDaysAgo.slice(0, 10),
      periodEnd: today,
      totalConversations,
      flaggedCount,
      avgSafetyScore,
      sensitiveDataIncidents,
      topIssues,
      aiSummary,
      incidents: rows
        .filter((r) => r.flagged)
        .map((r) => ({
          id: r.id,
          date: r.created_at.slice(0, 10),
          flagReason: r.flag_reason ?? '',
          safetyScore: r.ai_safety_score,
        })),
    });
  } catch (err) {
    console.error('Audit report error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate report' },
      { status: 500 }
    );
  }
}
