import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

type Template = { label: string; text: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      businessName?: string;
      businessType?: string | null;
      objective?: string;
      tone?: 'friendly' | 'professional' | 'urgent';
    };

    const businessName = body.businessName?.trim();
    const objective = body.objective?.trim();
    const businessType = body.businessType?.trim() || 'general';
    const tone = body.tone ?? 'friendly';

    if (!businessName || !objective) {
      return NextResponse.json({ error: 'businessName and objective are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      messages: [
        {
          role: 'system',
          content: `You write WhatsApp follow-up templates for small businesses.
Return strict JSON with this shape:
{"templates":[{"label":"...","text":"..."}]}

Rules:
- Return exactly 3 templates.
- Keep each message under 240 characters.
- Include {name} in every template.
- Include {businessName} in at least one template.
- Keep the copy natural and sales-safe.
- No markdown, no commentary, JSON only.`,
        },
        {
          role: 'user',
          content: `Business name: ${businessName}
Business type: ${businessType}
Tone: ${tone}
Objective: ${objective}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as { templates?: Template[] };
    const templates = (parsed.templates ?? []).filter((template) => template.label?.trim() && template.text?.trim()).slice(0, 3);

    if (templates.length === 0) {
      return NextResponse.json({ error: 'No templates generated' }, { status: 502 });
    }

    return NextResponse.json({ templates });
  } catch (err) {
    console.error('[followups/generate]', err);
    const message = err instanceof Error ? err.message : 'Failed to generate templates';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}