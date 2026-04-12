import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser, hasAgencyAccess } from "@/lib/clerk-auth";

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const authUser = await getAuthenticatedUser();
    if (!authUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as {
      businessId?: string;
      leadContacted?: boolean;
      contactStatus?: string;
      contactNotes?: string;
      customerRating?: number;
    };

    const { businessId, leadContacted, contactStatus, contactNotes, customerRating } = body;

    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }

    const supabase = admin();
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .select("id, owner_email")
      .eq("id", businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (!hasAgencyAccess(authUser.email) && business.owner_email !== authUser.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};
    if (leadContacted !== undefined) updates.lead_contacted = leadContacted;
    if (contactStatus !== undefined) updates.contact_status = contactStatus;
    if (contactNotes !== undefined) updates.contact_notes = contactNotes;
    if (customerRating !== undefined) updates.customer_rating = customerRating;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", conversationId)
      .eq("business_id", businessId)
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const authUser = await getAuthenticatedUser();
  if (!authUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = admin();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, owner_email")
    .eq("id", data.business_id)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!hasAgencyAccess(authUser.email) && business.owner_email !== authUser.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ conversation: data });
}
