"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/supabase";
import FollowUpsTab from "@/components/dashboard/FollowUpsTab";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export const metadata = {
  title: "Follow-ups | Dashboard",
};

export default function FollowUpsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (!email) {
        router.push("/login");
        return;
      }

      // Get business by email
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("email", email)
        .single();

      if (!businessData) {
        setLoading(false);
        return;
      }

      setBusiness(businessData as Business);
      setLoading(false);
    }

    void fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e8a020] border-t-transparent" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <p className="text-slate-500">No business found. Please log in again.</p>
      </div>
    );
  }

  return (
    <FollowUpsTab businessId={business.id} businessName={business.business_name} />
  );
}
