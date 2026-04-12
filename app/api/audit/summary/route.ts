import { NextRequest, NextResponse } from 'next/server';
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
  audit_reviewed: boolean | null;
};

function deriveTopIssues(conversations: ConversationRow[]): string[] {
  const counts: Record<string, number> = {};
  for (const conv of conversations) {
    if (conv.flagged && conv.flag_reason) {
      const reasons = conv.flag_reason.split(',').map((r) => r.trim()).filter(Boolean);
      for (const r of reasons) {
        counts[r] = (counts[r] ?? 0) + 1;
      }
    }
    if (conv.sensitive_data_detected) {
      counts['Sensitive data detected'] = (counts['Sensitive data detected'] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue, count]) => `${issue}: ${count} time${count > 1 ? 's' : ''}`);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
  }

  const authUser = await getAuthenticatedUser();
  if (!authUser?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServerClient();
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, owner_email')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (!hasAgencyAccess(authUser.email) && business.owner_email !== authUser.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('conversations')
      .select('id, created_at, messages, ai_safety_score, flagged, flag_reason, sensitive_data_detected, audit_reviewed')
      .eq('business_id', businessId)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as ConversationRow[];
    const totalConversations = rows.length;
    const flaggedRows = rows.filter((r) => r.flagged);
    const flaggedCount = flaggedRows.length;

    const scoredRows = rows.filter((r) => r.ai_safety_score !== null);
    const avgSafetyScore =
      scoredRows.length > 0
        ? Math.round(scoredRows.reduce((sum, r) => sum + (r.ai_safety_score ?? 0), 0) / scoredRows.length)
        : null;

    const sensitiveDataIncidents = rows.filter((r) => r.sensitive_data_detected).length;

    // Safety trend: compare first half vs second half of the week
    const midDate = new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString();
    const recentScores = scoredRows.filter((r) => r.created_at >= midDate).map((r) => r.ai_safety_score ?? 0);
    const olderScores = scoredRows.filter((r) => r.created_at < midDate).map((r) => r.ai_safety_score ?? 0);
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : null;
    const olderAvg = olderScores.length > 0 ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length : null;
    let safetyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAvg !== null && olderAvg !== null) {
      if (recentAvg - olderAvg > 5) safetyTrend = 'improving';
      else if (olderAvg - recentAvg > 5) safetyTrend = 'declining';
    }

    // Compliance status
    let complianceStatus: 'good' | 'warning' | 'critical' = 'good';
    if ((avgSafetyScore !== null && avgSafetyScore < 60) || flaggedCount >= 10) {
      complianceStatus = 'critical';
    } else if ((avgSafetyScore !== null && avgSafetyScore < 80) || flaggedCount >= 3) {
      complianceStatus = 'warning';
    }

    const flaggedConversations = flaggedRows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      firstMessage:
        (r.messages?.find((m) => m.role === 'user')?.content ?? '').slice(0, 100),
      flagReason: r.flag_reason ?? '',
      safetyScore: r.ai_safety_score,
      reviewed: r.audit_reviewed ?? false,
    }));

    const topIssues = deriveTopIssues(rows);

    return NextResponse.json({
      weeklyStats: {
        totalConversations,
        flaggedCount,
        avgSafetyScore,
        sensitiveDataIncidents,
        safetyTrend,
      },
      flaggedConversations,
      topIssues,
      complianceStatus,
    });
  } catch (err) {
    console.error('Audit summary error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load audit summary' },
      { status: 500 }
    );
  }
}
