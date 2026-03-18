import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const status = searchParams.get("status");

    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }

    const supabase = admin();
    let query = supabase
      .from("orders")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessId,
      conversationId,
      customerName,
      customerPhone,
      customerEmail,
      items,
      totalAmount,
      status,
      source,
      notes,
    } = body;

    if (!businessId || !customerName) {
      return NextResponse.json(
        { error: "businessId and customerName required" },
        { status: 400 }
      );
    }

    const supabase = admin();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        business_id: businessId,
        conversation_id: conversationId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        items: items || [],
        total_amount: totalAmount || 0,
        status: status || "pending",
        source: source || "chat",
        notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, businessId, status, notes } = body;

    if (!orderId || !businessId) {
      return NextResponse.json(
        { error: "orderId and businessId required" },
        { status: 400 }
      );
    }

    const supabase = admin();
    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .eq("business_id", businessId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
