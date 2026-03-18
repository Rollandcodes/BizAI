"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Copy, Check, Download, Smartphone, MessageCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/supabase";
import QRCode from "react-qr-code";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export const metadata = {
  title: "QR Codes | Dashboard",
};

export default function QRPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [copiedChat, setCopiedChat] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

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

  const chatUrl = business ? `${typeof window !== "undefined" ? window.location.origin : "https://cypai.app"}/chat/${business.id}` : "";
  const whatsAppUrl = business?.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}` : "";

  function copyToClipboard(text: string, type: "chat" | "whatsapp") {
    navigator.clipboard.writeText(text);
    if (type === "chat") {
      setCopiedChat(true);
      setTimeout(() => setCopiedChat(false), 2000);
    } else {
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 2000);
    }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QR Codes</h1>
        <p className="text-slate-500">Generate QR codes for your business</p>
      </div>

      {/* Chat Widget QR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Chat Widget</h2>
            <p className="text-sm text-slate-500">Scan to open the AI chat</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <QRCode value={chatUrl} size={160} level="H" />
          </div>
          
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Chat Link</p>
              <p className="mt-1 break-all text-sm font-medium text-slate-900">{chatUrl}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(chatUrl, "chat")}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {copiedChat ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedChat ? "Copied!" : "Copy Link"}
              </button>
              
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp QR */}
      {business.whatsapp && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">WhatsApp</h2>
              <p className="text-sm text-slate-500">Scan to open WhatsApp chat</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="rounded-2xl bg-white p-4 shadow-lg">
              <QRCode value={whatsAppUrl} size={160} level="H" />
            </div>
            
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">WhatsApp Link</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-900">{whatsAppUrl}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(whatsAppUrl, "whatsapp")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:bg-[#20bd5a]"
                >
                  {copiedWhatsApp ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedWhatsApp ? "Copied!" : "Copy Link"}
                </button>
                
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Instructions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <Download className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">How to Use</h2>
            <p className="text-sm text-slate-500">Print and share your QR codes</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a020] text-xs font-bold text-white">1</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Take a Screenshot</p>
              <p className="text-xs text-slate-500">Capture the QR code above using your phone</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a020] text-xs font-bold text-white">2</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Print or Share</p>
              <p className="text-xs text-slate-500">Add it to your business cards, flyers, or website</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a020] text-xs font-bold text-white">3</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Customers Scan</p>
              <p className="text-xs text-slate-500">Customers scan to start chatting instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
