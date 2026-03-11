import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';
import { getNicheConfig, interpolateNicheConfig } from '@/lib/niches';
import { Business, ConversationMessage, Conversation } from '@/lib/supabase';

const supabase = createServerClient();

// ============================================================================
// Types
// ============================================================================

interface ChatRequest {
  businessId: string;
  sessionId: string;
  message: string;
  conversationHistory: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
}

// ============================================================================
// Initialize OpenAI lazily (request-time, not build-time)
// ============================================================================

function getOpenAIClient(): OpenAI {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey: openaiApiKey });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if text contains a phone number or name pattern (lead capture)
 */
function containsLeadInfo(text: string): boolean {
  // Simple phone number patterns (basic)
  const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}\s?\d{1,14})/;
  
  // Check for common name patterns (has both first and last name or email)
  const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  const namePattern = /my name is|i'm|i am|call me|you can reach me/i;

  return phonePattern.test(text) || emailPattern.test(text) || namePattern.test(text);
}

/**
 * Extract conversation ID from sessionId or create new conversation
 */
async function getOrCreateConversation(
  businessId: string,
  sessionId: string
): Promise<string> {
  // Try to find existing conversation
  const { data: existingConversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('business_id', businessId)
    .eq('session_id', sessionId)
    .single();

  if (existingConversation) {
    return existingConversation.id;
  }

  // Create new conversation
  const { data: newConversation, error } = await supabase
    .from('conversations')
    .insert([
      {
        business_id: businessId,
        session_id: sessionId,
        messages: [],
        lead_captured: false,
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  return newConversation.id;
}

/**
 * Update conversation with new message and lead status
 */
async function updateConversation(
  conversationId: string,
  messages: ConversationMessage[],
  leadCaptured: boolean
): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({
      messages,
      lead_captured: leadCaptured,
    })
    .eq('id', conversationId);

  if (error) {
    throw new Error(`Failed to update conversation: ${error.message}`);
  }
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    assertSupabaseConfig();
    const openai = getOpenAIClient();

    // Parse request body
    const body = await request.json();
    const { businessId, sessionId, message, conversationHistory } =
      body as ChatRequest;

    // Validate required fields
    if (
      !businessId ||
      !sessionId ||
      !message ||
      !Array.isArray(conversationHistory)
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields: businessId, sessionId, message, conversationHistory',
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // 1. Fetch business details
    // ========================================================================
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('Business fetch error:', businessError);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // ========================================================================
    // 2. Get niche config
    // ========================================================================
    const nicheConfig = getNicheConfig(business.business_type || 'default');
    if (!nicheConfig) {
      console.warn(
        `No niche config found for business_type: ${business.business_type}`
      );
      return NextResponse.json(
        { error: 'Business type not supported' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 3. Interpolate niche config with business name
    // ========================================================================
    const interpolatedConfig = interpolateNicheConfig(
      nicheConfig,
      business.business_name
    );

    // ========================================================================
    // 4. Build system message
    // ========================================================================
    const systemMessage = `${interpolatedConfig.systemPrompt}

Additional context:
- Customer is interacting with our chat assistant
- Our goal is to provide excellent service and collect contact information (name, phone)
- If the customer provides contact info, acknowledge and confirm it`;

    // ========================================================================
    // 5. Build messages array for OpenAI
    // ========================================================================
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // ========================================================================
    // 6. Call OpenAI Chat Completions
    // ========================================================================
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content || 'Unable to generate response';

    // ========================================================================
    // 7. Check for lead capture (phone/name/email in response)
    // ========================================================================
    const hasLeadInfo =
      containsLeadInfo(message) || containsLeadInfo(reply);

    // ========================================================================
    // 8. Get or create conversation
    // ========================================================================
    const conversationId = await getOrCreateConversation(
      businessId,
      sessionId
    );

    // ========================================================================
    // 9. Update conversation with new messages
    // ========================================================================
    const updatedMessages: ConversationMessage[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
      { role: 'assistant', content: reply },
    ];

    await updateConversation(
      conversationId,
      updatedMessages,
      hasLeadInfo
    );

    // ========================================================================
    // 10. Return response
    // ========================================================================
    return NextResponse.json({
      reply,
      sessionId,
    } as ChatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat', details: errorMessage },
      { status: 500 }
    );
  }
}
