"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/contexts/BusinessContext";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { planDisplayName } from "@/lib/plans";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

export default function SettingsPage() {
  const router = useRouter();
  const { business: contextBusiness, loading: contextLoading, isAuthenticated, refresh } = useBusiness();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(contextBusiness);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!contextLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [contextLoading, isAuthenticated, router]);

  useEffect(() => {
    if (contextBusiness) {
      setBusiness(contextBusiness);
      setLoading(false);
    }
  }, [contextBusiness]);

  function handleSaved() {
    // Refresh business data after save
    void refresh().then(() => {
      // After refresh, fetch the updated data
      async function fetchUpdated() {
        const email = localStorage.getItem("cypai-dashboard-email");
        if (!email) return;

        const { data } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_email", email)
          .single();

        if (data) {
          setBusiness(data as typeof data);
        }
      }
      void fetchUpdated();
    });
  }

  function showToast(message: string, tone: "success" | "error") {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  }

  if (contextLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <ChatSkeleton />
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
