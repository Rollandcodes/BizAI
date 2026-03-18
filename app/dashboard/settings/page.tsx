"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/supabase";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { planDisplayName } from "@/lib/plans";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

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

  function handleSaved() {
    // Refresh business data after save
    async function refreshData() {
      const email = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (!email) return;

      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("email", email)
        .single();

      if (data) {
        setBusiness(data as Business);
      }
    }

    void refreshData();
  }

  function showToast(message: string, tone: "success" | "error") {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  }

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
    <>
      <SettingsTab
        business={business}
        onSaved={handleSaved}
        showToast={showToast}
        plan={business.plan}
        planName={planDisplayName(business.plan)}
        planExpiresAt={business.plan_expires_at}
      />
      {toast && (
        <div
          className={`fixed bottom-4 right-4 rounded-lg px-4 py-3 text-sm font-semibold text-white ${
            toast.tone === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
