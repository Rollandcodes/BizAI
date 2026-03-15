import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "@/app/api/chat/cors";

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { sessionId?: string; businessId?: string; rating?: number };
    const { sessionId, businessId, rating } = body;

    if (!sessionId || !businessId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "sessionId, businessId, and rating (1-5) are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = admin();
    const { error } = await supabase
      .from("conversations")
      .update({ customer_rating: rating })
      .eq("session_id", sessionId)
      .eq("business_id", businessId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500, headers: corsHeaders });
  }
}
