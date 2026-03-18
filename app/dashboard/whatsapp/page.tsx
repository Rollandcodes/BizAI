"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Check, X, ExternalLink, Copy, RefreshCw, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/supabase";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export default function WhatsAppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [whatsappEvents, setWhatsappEvents] = useState<unknown[]>([]);

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

      // Fetch recent WhatsApp events
      const { data: eventsData } = await supabase
        .from("whatsapp_events")
        .select("*")
        .eq("business_id", businessData.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setWhatsappEvents(eventsData ?? []);
      setLoading(false);
    }

    void fetchData();
  }, [router]);

  const isConnected = business?.whatsapp && business.whatsapp_phone_number_id;

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp Connection</h1>
        <p className="text-slate-500">Manage your WhatsApp business integration</p>
      </div>

      {/* Connection Status */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isConnected ? "bg-green-100" : "bg-slate-100"}`}>
              <MessageCircle className={`h-6 w-6 ${isConnected ? "text-green-600" : "text-slate-400"}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">WhatsApp Business</h2>
              <p className={`text-sm ${isConnected ? "text-green-600" : "text-slate-500"}`}>
                {isConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          {isConnected ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <Check className="h-4 w-4" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
              <X className="h-4 w-4" />
              Inactive
            </span>
          )}
        </div>

        {isConnected && business.whatsapp && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Connected Number</p>
            <p className="mt-1 font-semibold text-slate-900">{business.whatsapp}</p>
          </div>
        )}

        <div className="mt-6">
          <a
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#20bd5a]"
          >
            <Smartphone className="h-4 w-4" />
            {isConnected ? "Update Connection" : "Connect WhatsApp"}
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">WhatsApp Features</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Automated Responses</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your AI automatically responds to WhatsApp messages 24/7
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Lead Capture</h3>
            <p className="mt-1 text-sm text-slate-500">
              Contacts are automatically added to your CRM
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Booking Notifications</h3>
            <p className="mt-1 text-sm text-slate-500">
              Receive booking confirmations via WhatsApp
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Multi-language Support</h3>
            <p className="mt-1 text-sm text-slate-500">
              AI communicates in English, Turkish, Arabic, and more
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        {whatsappEvents.length > 0 ? (
          <div className="mt-4 space-y-3">
            {whatsappEvents.slice(0, 10).map((event: unknown, index: number) => {
              const e = event as { id: string; created_at: string; event_type?: string; from_number?: string };
              return (
                <div key={e.id || index} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{e.event_type || "Message"}</p>
                      <p className="text-xs text-slate-500">{e.from_number || "Unknown"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No recent WhatsApp activity</p>
        )}
      </div>
    </div>
  );
}
