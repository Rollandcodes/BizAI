import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "./cors";
import {
  getOpenAIClient,
  buildSystemPrompt,
  selectModel,
  extractLead,
  isRateLimited,
  classifyError,
  DEGRADED_MESSAGES,
} from "@/lib/ai";
import { PLAN_MESSAGE_LIMITS } from "@/lib/plans";
import { checkCalendarAvailability, createCalendarEvent } from "@/app/actions/calendar";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type BookingIntent = {
  name: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  carType: string;
  totalDays: number;
  bookingTime: string | null;
  customerMessage: string;
};

function normalizePhone(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function parseBookingIntent(rawMessage: string): BookingIntent | null {
  const marker = "[BOOKING_READY]";
  const idx = rawMessage.indexOf(marker);
  if (idx === -1) return null;

  const after = rawMessage.slice(idx + marker.length).trim();
  const jsonLine = after
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("{") && line.endsWith("}"));

  if (!jsonLine) return null;

  try {
    const parsed = JSON.parse(jsonLine) as {
      name?: string;
      phone?: string;
      pickupDate?: string;
      returnDate?: string;
      carType?: string;
      totalDays?: number;
      bookingTime?: string;
    };

    const phone = normalizePhone(parsed.phone ?? "");
    const pickupDate = (parsed.pickupDate ?? "").trim();
    if (!phone || !pickupDate) return null;

    const customerMessage = rawMessage.slice(0, idx).trim();

    return {
      name: (parsed.name ?? "Customer").trim(),
      phone,
      pickupDate,
      returnDate: (parsed.returnDate ?? pickupDate).trim() || pickupDate,
      carType: (parsed.carType ?? "Standard").trim() || "Standard",
      totalDays: Math.max(1, Number(parsed.totalDays ?? 1) || 1),
      bookingTime: parsed.bookingTime?.trim() || null,
      customerMessage,
    };
  } catch {
    return null;
  }
}

function buildBookingWindow(intent: BookingIntent): { startIso: string; endIso: string } {
  const start = new Date(`${intent.pickupDate}T${intent.bookingTime ?? "10:00"}:00`);
  if (Number.isNaN(start.getTime())) {
    throw new Error("Invalid booking datetime from AI output");
  }

  // Default one-hour service slot for availability checks.
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { status: "BizAI Chat API v2.0", ts: new Date().toISOString() },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages?: Array<{ role: "user" | "assistant"; content: string }>;
      message?: string;
      businessId?: string;
      sessionId?: string;
      businessType?: string;
      niche?: string;
      systemPrompt?: string;
      businessName?: string;
    };

    const {
      messages: rawMessages,
      message: singleMessage,
      businessId,
      sessionId,
      businessType,
      niche,
      systemPrompt: customSystemPrompt,
      businessName = "this business",
    } = body;

    // Normalize messages
    const messages = Array.isArray(rawMessages)
      ? rawMessages
      : typeof singleMessage === "string" && singleMessage.trim()
      ? [{ role: "user" as const, content: singleMessage.trim() }]
      : null;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array or message string required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    const rlKey = businessId ? `biz:${businessId}` : `ip:${ip}`;
    if (isRateLimited(rlKey, 20)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429, headers: corsHeaders }
      );
    }

    // Load business config and check plan quota
    const supabase = adminClient();
    let businessConfig: {
      id: string;
      business_name: string;
      business_type: string | null;
      system_prompt: string | null;
      pricing_info: string | null;
      common_questions_text: string | null;
      additional_info: string | null;
      custom_faqs: Array<{ question: string; answer: string }> | null;
      plan: string;
      message_count_month: number | null;
      is_active: boolean | null;
    } | null = null;

    if (businessId) {
      const { data } = await supabase
        .from("businesses")
        .select("id,business_name,business_type,system_prompt,pricing_info,common_questions_text,additional_info,custom_faqs,plan,message_count_month,is_active")
        .eq("id", businessId)
        .single();
      businessConfig = data;
    }

    // Plan quota check
    if (businessConfig) {
      if (businessConfig.is_active === false) {
        return NextResponse.json(
          { error: "This AI assistant is currently inactive." },
          { status: 403, headers: corsHeaders }
        );
      }
      const limit = PLAN_MESSAGE_LIMITS[businessConfig.plan] ?? 100;
      const used = businessConfig.message_count_month ?? 0;
      if (limit !== null && used >= limit) {
        return NextResponse.json(
          {
            message: "Monthly message limit reached. Please upgrade your plan to continue.",
            degraded: true,
            upgradeRequired: true,
          },
          { status: 200, headers: corsHeaders }
        );
      }
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      businessName: businessConfig?.business_name ?? businessName,
      niche: businessConfig?.business_type ?? niche ?? businessType ?? "default",
      customSystemPrompt: businessConfig?.system_prompt ?? customSystemPrompt,
      pricingInfo: businessConfig?.pricing_info,
      commonQuestionsText: businessConfig?.common_questions_text,
      additionalInfo: businessConfig?.additional_info,
      customFaqs: businessConfig?.custom_faqs ?? [],
    });

    // AI call
    const openai = getOpenAIClient();
    const model = selectModel(messages);
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20), // cap context at 20 turns
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const rawMessage = completion.choices[0]?.message?.content ?? "";
    const { leadCaptured, customerName, customerPhone, cleanMessage } = extractLead(rawMessage);
    let finalMessage = cleanMessage;

    // Booking flow: check calendar availability first, then create event if free.
    const bookingIntent = parseBookingIntent(rawMessage);
    if (bookingIntent && businessId && sessionId) {
      try {
        const { startIso, endIso } = buildBookingWindow(bookingIntent);
        const availability = await checkCalendarAvailability(startIso, endIso, businessId);

        if (!availability.available) {
          finalMessage = `${bookingIntent.customerMessage || cleanMessage}\n\nThat time is not available. Please share another preferred slot and I will confirm it right away.`;
        } else {
          const { data: insertedBooking, error: bookingInsertError } = await supabase
            .from("bookings")
            .insert({
              business_id: businessId,
              session_id: sessionId,
              customer_name: bookingIntent.name,
              customer_phone: bookingIntent.phone,
              pickup_date: bookingIntent.pickupDate,
              return_date: bookingIntent.returnDate,
              car_type: bookingIntent.carType,
              total_days: bookingIntent.totalDays,
              booking_date: bookingIntent.pickupDate,
              booking_time: bookingIntent.bookingTime,
              service_type: bookingIntent.carType,
              status: "confirmed",
            })
            .select("id")
            .single();

          if (bookingInsertError) {
            throw new Error(`Failed to save booking: ${bookingInsertError.message}`);
          }

          await createCalendarEvent(
            {
              title: `Booking - ${bookingIntent.name}`,
              start: startIso,
              end: endIso,
              customerPhone: bookingIntent.phone,
              description: `Business booking ${insertedBooking?.id ?? ""} (${bookingIntent.carType})`,
            },
            businessId
          );

          // Send booking confirmation email
          try {
            const { sendBookingEmailAction } = await import('@/app/actions/send-booking-email');
            await sendBookingEmailAction(
              bookingIntent.phone + '@example.com', // Replace with actual email if available
              bookingIntent.name,
              businessConfig?.business_name ?? businessName,
              bookingIntent.pickupDate,
              bookingIntent.bookingTime ?? undefined,
              bookingIntent.carType ?? undefined,
              undefined // confirmationLink, if available
            );
          } catch (emailErr) {
            console.error('[chat] booking email error:', emailErr);
          }

            // PayPal order creation
            try {
              // Only proceed if booking was inserted
              if (insertedBooking?.id) {
                const { createPayPalOrder } = await import('@/app/actions/paypal');
                const paypalOrder = await createPayPalOrder(
                  insertedBooking.id,
                  Number(bookingIntent.totalDays) * 50, // Example: €50 per day
                  'EUR',
                  `Booking for ${bookingIntent.name} (${bookingIntent.carType})`
                );
                // Persist PayPal order ID/status
                await supabase
                  .from('bookings')
                  .update({
                    paypal_order_id: paypalOrder.id,
                    paypal_order_status: paypalOrder.status,
                  })
                  .eq('id', insertedBooking.id);
                // Find approval link
                const approvalLink = paypalOrder.links.find(l => l.rel === 'approve')?.href;
                if (approvalLink) {
                  finalMessage += `\n\nTo confirm your booking, please complete payment: ${approvalLink}`;
                }
              }
            } catch (paypalErr) {
              console.error('[chat] PayPal order error:', paypalErr);
              finalMessage += '\n\nBooking confirmed, but payment link could not be generated. Our team will contact you.';
            }

            finalMessage = bookingIntent.customerMessage || cleanMessage;
        }
      } catch (bookingErr) {
        console.error("[chat] booking calendar flow error:", bookingErr);
        finalMessage = `${bookingIntent.customerMessage || cleanMessage}\n\nI could not finalize the booking calendar sync right now. Our team will confirm your booking manually shortly.`;
      }
    }

    // Persist conversation (non-blocking)
    if (businessId && sessionId) {
      void (async () => {
        try {
          const allMessages = [...messages, { role: "assistant" as const, content: finalMessage }];
          const { data: existing } = await supabase
            .from("conversations")
            .select("id")
            .eq("session_id", sessionId)
            .eq("business_id", businessId)
            .single();

          if (existing) {
            await supabase
              .from("conversations")
              .update({
                messages: allMessages,
                ...(leadCaptured && {
                  lead_captured: true,
                  customer_name: customerName,
                  customer_phone: customerPhone,
                }),
              })
              .eq("id", existing.id);
          } else {
            await supabase.from("conversations").insert({
              business_id: businessId,
              session_id: sessionId,
              messages: allMessages,
              lead_captured: leadCaptured,
              customer_name: customerName,
              customer_phone: customerPhone,
              channel: "web",
            });
          }

          // Increment usage counter
          await supabase.rpc("increment_message_count", { p_business_id: businessId }).single();
        } catch (err) {
          console.error("[chat] DB error:", err);
        }
      })();
    }

    return NextResponse.json(
      { message: finalMessage, leadCaptured, customerName, customerPhone, model },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number; code?: string };
    console.error("[chat] error:", error);

    const degraded = classifyError(error);
    if (degraded) {
      return NextResponse.json(
        { message: DEGRADED_MESSAGES[degraded], degraded: true, degradedReason: degraded },
        { status: 200, headers: corsHeaders }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "AI rate limit reached. Please try again shortly." },
        { status: 429, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "AI service temporarily unavailable." },
      { status: 503, headers: corsHeaders }
    );
  }
}
