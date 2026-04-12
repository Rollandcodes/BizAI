import { NextRequest, NextResponse } from "next/server";
import { assertSupabaseConfig, createServerClient } from "@/lib/supabase";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

const supabase = createServerClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "No email address found" }, { status: 400 });
    }

    const { businessName, niche } = await req.json();

    if (!businessName || !niche) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    assertSupabaseConfig();

    const normalizedEmail = email.trim().toLowerCase();
    const businessPayload = {
      owner_email: normalizedEmail,
      business_name: businessName,
      business_type: niche,
      onboarding_complete: true,
      plan: "trial" as const,
    };

    // Create or update the user's business so onboarding stays idempotent.
    const { data: business, error } = await supabase
      .from("businesses")
      .upsert(businessPayload, {
        onConflict: "owner_email",
      })
      .select()
      .single();

    if (error) {
      console.error("[onboarding POST] DB Error:", error);
      return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
    }

    // Mark onboarding as complete in Clerk publicMetadata
    try {
      const client = await clerkClient();
      await client.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
        },
      });
    } catch (metadataError) {
      console.error("[onboarding POST] Clerk Metadata Error:", metadataError);
    }

    return NextResponse.json({ business });
  } catch (err) {
    console.error("[onboarding POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
