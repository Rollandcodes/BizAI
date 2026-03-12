import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from './cors';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const NICHE_PROMPTS: Record<string, string> = {
  car_rental: `You are a friendly AI assistant for a
car rental business in Northern Cyprus.
Prices: Economy $25/day, Compact $35/day,
SUV $55/day, Van $75/day.
Your job:
1. Answer questions about prices, availability,
   pickup/dropoff locations
2. Collect customer name and phone number for bookings
3. When you have their name AND phone, say exactly:
   [LEAD_CAPTURED] Name: {name}, Phone: {phone}
4. Speak in whatever language the customer uses
   (English, Turkish, Arabic, Russian)
Be warm, helpful, and professional.`,

  barbershop: `You are a friendly AI assistant for a
barbershop/salon in Northern Cyprus.
Hours: Monday-Saturday 9am-7pm, Sunday closed.
Services: Haircut $15, Beard trim $10,
Full groom $22, Kids cut $10.
Your job:
1. Answer questions about services, prices, hours
2. Help book appointments - collect name, phone,
   preferred date and service
3. When you have their details say:
   [LEAD_CAPTURED] Name: {name}, Phone: {phone}
4. Speak in whatever language the customer uses
Be warm, friendly, and welcoming.`,

  student_accommodation: `You are a helpful AI
assistant for student accommodation in Northern Cyprus.
Near: EMU, CIU, NEU, LAU universities.
Room types: Single $250/mo, Double $180/mo,
Studio $350/mo. Utilities included.
Your job:
1. Answer questions about rooms, prices, location,
   amenities, availability
2. Collect student name, phone, university,
   move-in date
3. When you have name AND phone say:
   [LEAD_CAPTURED] Name: {name}, Phone: {phone}
4. Speak in whatever language the student uses
Be helpful and reassuring for international students.`,

  restaurant: `You are a friendly AI assistant for
a restaurant in Northern Cyprus.
Your job:
1. Share menu info, opening hours, location
2. Help with reservations - collect name, phone,
   date, party size
3. When you have name AND phone say:
   [LEAD_CAPTURED] Name: {name}, Phone: {phone}
4. Speak in whatever language the customer uses`,

  default: `You are a helpful AI customer service
assistant for a local business in Northern Cyprus.
Your job:
1. Answer customer questions helpfully
2. Collect customer name and phone number
3. When you have name AND phone say:
   [LEAD_CAPTURED] Name: {name}, Phone: {phone}
4. Speak in whatever language the customer uses
Be professional, warm, and helpful.`,
};

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const supabase = getSupabaseClient();
    const body = await request.json();
    const {
      messages,
      businessId,
      sessionId,
      businessType = 'default',
      systemPrompt,
      businessName = 'this business',
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemMessage =
      systemPrompt || NICHE_PROMPTS[businessType] || NICHE_PROMPTS.default;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${systemMessage}\n\nBusiness name: ${businessName}`,
        },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = completion.choices[0].message.content || '';

    let leadCaptured = false;
    let customerName: string | null = null;
    let customerPhone: string | null = null;

    if (aiMessage.includes('[LEAD_CAPTURED]')) {
      leadCaptured = true;
      const nameMatch = aiMessage.match(/Name:\s*([^,\n]+)/);
      const phoneMatch = aiMessage.match(/Phone:\s*([^\n]+)/);
      customerName = nameMatch?.[1]?.trim() || null;
      customerPhone = phoneMatch?.[1]?.trim() || null;
    }

    if (businessId && sessionId) {
      try {
        const allMessages = [...messages, { role: 'assistant', content: aiMessage }];

        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .eq('session_id', sessionId)
          .eq('business_id', businessId)
          .single();

        if (existing) {
          await supabase
            .from('conversations')
            .update({
              messages: allMessages,
              ...(leadCaptured && {
                lead_captured: true,
                customer_name: customerName,
                customer_phone: customerPhone,
              }),
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('conversations').insert({
            business_id: businessId,
            session_id: sessionId,
            messages: allMessages,
            lead_captured: leadCaptured,
            customer_name: customerName,
            customer_phone: customerPhone,
          });
        }
      } catch (dbError) {
        console.error('DB save error:', dbError);
      }
    }

    const cleanMessage = aiMessage.replace(/\[LEAD_CAPTURED\].*$/m, '').trim();

    return NextResponse.json(
      {
        message: cleanMessage,
        leadCaptured,
        customerName,
        customerPhone,
      },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    const err = error as { status?: number };
    if (err?.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API key invalid' },
        { status: 500, headers: corsHeaders }
      );
    }

    if (err?.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests, please wait' },
        { status: 429, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'CypAI Chat API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
