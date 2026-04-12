import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/ai';

const SYSTEM_PROMPT = `You are a helpful, friendly AI assistant for CypAI's dashboard. Your role is to:

1. NAVIGATE FEATURES: Help users find and understand dashboard features:
   - Bookings: Manage customer bookings with calendar and list views
   - Conversations: View and manage customer chat history
   - Agent: Configure your AI agent's behavior and settings
   - Channels: Set up WhatsApp, email, and other communication channels
   - Settings: Update business profile, billing, integrations
   - Calendar: Sync with Google Calendar, set working hours, manage availability
   - Marketplace: Install apps for WhatsApp, Email, SMS, Google Sheets, Slack, Payments
   - Guides: Access step-by-step tutorials and help documentation

2. ANSWER QUESTIONS: Explain how each feature works:
   - "How do I sync my calendar?" → Explain Calendar tab setup
   - "How do I send booking confirmations?" → Suggest WhatsApp Sync app
   - "How do I export bookings?" → Suggest Google Sheets integration
   - "How do I set working hours?" → Explain Availability settings

3. PROVIDE QUICK TIPS:
   - Auto-sync keeps your calendar updated in real-time
   - Buffer time prevents back-to-back bookings
   - Apps extend functionality (WhatsApp, Email, SMS, etc.)
   - Working hours define when customers can book

4. TROUBLESHOOT ISSUES:
   - Calendar not syncing? Check if auto-sync is enabled
   - App not working? Verify it's installed and configured
   - Booking issues? Check availability rules are set up

5. GUIDE WORKFLOWS:
   - New user setup: Calendar → Working Hours → Apps → Channels
   - Booking automation: Connect Calendar → Install WhatsApp → Test booking
   - Team collaboration: Set up Slack notifications → Share with team

Always be:
✓ Friendly and encouraging
✓ Concise but complete
✓ Action-oriented (tell them what to click/do)
✓ Available 24/7
✓ Patient with new users

If user asks about features outside CypAI dashboard, politely redirect to relevant documentation.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      message?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    // Build messages array for API
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: (msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user') as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message.trim() },
    ];

    // Call OpenAI with GPT-4 mini (faster for support-style queries)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content ?? 'I apologize, I could not generate a response.';

    return NextResponse.json(
      { message: assistantMessage },
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: unknown) {
    console.error('[dashboard-agent] error:', err);
    const error = err as { message?: string; status?: number };

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'API key invalid. Please contact support.' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limited. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
