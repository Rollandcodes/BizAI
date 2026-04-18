"use client";

import { useState, type FormEvent } from "react";
import { Plus, X, Copy, Check, Smartphone, Code, Bell, CreditCard, AlertTriangle, QrCode, Clock, Globe, AlertCircle } from "lucide-react";
import type { Business } from "@/lib/supabase";

const BUSINESS_TYPES = [
  { value: "medical_tourism", label: "Medical Tourism (IVF/Dental/Aesthetics)" },
  { value: "real_estate_residency", label: "High-Yield Real Estate & Residency" },
  { value: "car_sales", label: "Car Sales" },
  { value: "student_accommodation", label: "Student Accommodation" },
  { value: "restaurant", label: "Restaurant / Café" },
  { value: "clinic", label: "Clinic / Medical" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "hotel", label: "Hotel / Guesthouse" },
  { value: "other", label: "Other" },
];

const WIDGET_COLORS = [
  { value: "#2563eb", className: "bg-blue-600" },
  { value: "#7c3aed", className: "bg-violet-600" },
  { value: "#0891b2", className: "bg-cyan-600" },
  { value: "#059669", className: "bg-emerald-600" },
  { value: "#dc2626", className: "bg-red-600" },
  { value: "#d97706", className: "bg-amber-600" },
  { value: "#db2777", className: "bg-pink-600" },
  { value: "#1d4ed8", className: "bg-blue-700" },
];

interface SettingsState {
  businessName: string;
  businessType: string;
  whatsapp: string;
  whatsappPhoneNumberId: string;
  website: string;
  primaryColor: string;
  aiInstructions: string;
  pricingInfo: string;
  commonQuestionsText: string;
  additionalInfo: string;
  customFaqs: Array<{ question: string; answer: string }>;
  notifications: {
    email: boolean;
    whatsapp: boolean;
    newLeads: boolean;
  };
}

interface Props {
  business: Business;
  onSaved: () => void;
  showToast: (msg: string, tone: "success" | "error") => void;
  plan?: string;
  planName?: string;
  planExpiresAt?: string | null;
}

export default function SettingsTab({ business, onSaved, showToast, plan = "starter", planName = "Starter", planExpiresAt }: Props) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [form, setForm] = useState<SettingsState>({
    businessName: business.business_name ?? "",
    businessType: business.business_type ?? "other",
    whatsapp: business.whatsapp ?? "",
    whatsappPhoneNumberId: business.whatsapp_phone_number_id ?? "",
    website: business.website ?? "",
    primaryColor: business.widget_color ?? "#2563eb",
    aiInstructions: (business as Business & { customInstructions?: string }).customInstructions ?? "",
    pricingInfo: business.pricing_info ?? "",
    commonQuestionsText: business.common_questions_text ?? "",
    additionalInfo: business.additional_info ?? "",
    customFaqs: business.custom_faqs?.length ? business.custom_faqs : [{ question: "", answer: "" }],
    notifications: {
      email: true,
      whatsapp: true,
      newLeads: true,
    },
  });

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setNotification(key: keyof SettingsState["notifications"], value: boolean) {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  }

  const addFaq = () => set("customFaqs", [...form.customFaqs, { question: "", answer: "" }]);
  const removeFaq = (i: number) =>
    set("customFaqs", form.customFaqs.length === 1 ? [{ question: "", answer: "" }] : form.customFaqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: "question" | "answer", v: string) =>
    set("customFaqs", form.customFaqs.map((item, idx) => (idx === i ? { ...item, [field]: v } : item)));

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          business_name: form.businessName,
          business_type: form.businessType,
          whatsapp: form.whatsapp,
          whatsapp_phone_number_id: form.whatsappPhoneNumberId,
          website: form.website,
          widget_color: form.primaryColor,
          system_prompt: form.aiInstructions || null,
          pricing_info: form.pricingInfo || null,
          common_questions_text: form.commonQuestionsText || null,
          additional_info: form.additionalInfo || null,
          custom_faqs: form.customFaqs.filter((f) => f.question.trim() || f.answer.trim()),
        }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      await onSaved();
      showToast("Settings saved!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  const handleCopyWidget = () => {
    const code = `<script src="https://cypai.app/widget.js" data-business-id="${business.id}"></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Copied to clipboard!", "success");
  };

  const inputCls = "h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition";
  const textareaCls = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";
  const sectionCls = "rounded-xl border border-gray-100 bg-white p-6 shadow-sm";
  const sectionButtonCls = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"
    }`;

  const isWhatsAppConnected = !!business.whatsapp && !!business.whatsapp_phone_number_id;
  const widgetCode = `<script src="https://cypai.app/widget.js" data-business-id="${business.id}"></script>`;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left sidebar - Section navigation */}
      <nav className="w-full shrink-0 space-y-1 lg:w-64">
        <button onClick={() => setActiveSection("profile")} className={sectionButtonCls(activeSection === "profile")} type="button">
          <Globe className="h-5 w-5" /> Business Profile
        </button>
        <button onClick={() => setActiveSection("ai")} className={sectionButtonCls(activeSection === "ai")} type="button">
          <Brain className="h-5 w-5" /> AI Configuration
        </button>
        <button onClick={() => setActiveSection("whatsapp")} className={sectionButtonCls(activeSection === "whatsapp")} type="button">
          <Smartphone className="h-5 w-5" /> WhatsApp
        </button>
        <button onClick={() => setActiveSection("widget")} className={sectionButtonCls(activeSection === "widget")} type="button">
          <Code className="h-5 w-5" /> Widget Code
        </button>
        <button onClick={() => setActiveSection("notifications")} className={sectionButtonCls(activeSection === "notifications")} type="button">
          <Bell className="h-5 w-5" /> Notifications
        </button>
        <button onClick={() => setActiveSection("billing")} className={sectionButtonCls(activeSection === "billing")} type="button">
          <CreditCard className="h-5 w-5" /> Subscription
        </button>
        <button onClick={() => setActiveSection("danger")} className={sectionButtonCls(activeSection === "danger")} type="button">
          <AlertTriangle className="h-5 w-5 text-red-500" /> Danger Zone
        </button>
      </nav>

      {/* Right content */}
      <div className="flex-1">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Business Profile Section */}
          {activeSection === "profile" && (
            <section className={sectionCls}>
              <h2 className="mb-5 text-lg font-bold text-gray-900">Business Profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="business-name">Business name</label>
                    <input id="business-name" className={inputCls} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required />
                </div>
                <div>
                    <label className={labelCls} htmlFor="business-type">Business type</label>
                    <select id="business-type" className={inputCls} value={form.businessType} onChange={(e) => set("businessType", e.target.value)}>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                    <label className={labelCls} htmlFor="whatsapp-number">WhatsApp number</label>
                    <input id="whatsapp-number" className={inputCls} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+905551234567" />
                </div>
                <div>
                    <label className={labelCls} htmlFor="website-url">Website URL</label>
                    <input id="website-url" className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://yourbusiness.com" />
                </div>
              </div>
            </section>
          )}

          {/* AI Configuration Section */}
          {activeSection === "ai" && (
            <>
              <section className={sectionCls}>
                <h2 className="mb-5 text-lg font-bold text-gray-900">Widget Appearance</h2>
                <div className="flex flex-wrap gap-3">
                  {WIDGET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => set("primaryColor", color.value)}
                      className={`h-10 w-10 rounded-full border-2 transition ${form.primaryColor === color.value ? "border-gray-900 scale-110" : "border-transparent"} ${color.className}`}
                      title={`Use ${color.value} as widget color`}
                      aria-label={`Use ${color.value} as widget color`}
                    />
                  ))}
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => set("primaryColor", e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-full border-2 border-gray-200 p-0.5"
                    aria-label="Custom widget color"
                  />
                </div>
              </section>

              <section className={sectionCls}>
                <h2 className="mb-5 text-lg font-bold text-gray-900">AI Instructions</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      Custom AI instructions <span className="normal-case font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      className={textareaCls}
                      rows={4}
                      value={form.aiInstructions}
                      onChange={(e) => set("aiInstructions", e.target.value)}
                      placeholder="You are a helpful assistant for…"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Pricing information</label>
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={form.pricingInfo}
                      onChange={(e) => set("pricingInfo", e.target.value)}
                      placeholder="Economy car: $25/day, SUV: $55/day…"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Common questions & answers</label>
                    <textarea
                      className={textareaCls}
                      rows={3}
                      value={form.commonQuestionsText}
                      onChange={(e) => set("commonQuestionsText", e.target.value)}
                      placeholder="Q: Do you offer free delivery?\nA: Yes, within 10km."
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Additional context</label>
                    <textarea
                      className={textareaCls}
                      rows={2}
                      value={form.additionalInfo}
                      onChange={(e) => set("additionalInfo", e.target.value)}
                      placeholder="Parking is available at the main entrance. We are closed on public holidays."
                    />
                  </div>
                </div>
              </section>

              <section className={sectionCls}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Custom FAQs</h2>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    title="Add FAQ"
                    aria-label="Add FAQ"
                  >
                    <Plus className="h-3 w-3" /> Add FAQ
                  </button>
                </div>
                <div className="space-y-4">
                  {form.customFaqs.map((faq, i) => (
                    <div key={i} className="relative rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <button
                        type="button"
                        onClick={() => removeFaq(i)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        title="Remove FAQ"
                        aria-label="Remove FAQ"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <input
                        className={`${inputCls} mb-2`}
                        value={faq.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder={`Question ${i + 1}`}
                      />
                      <textarea
                        className={textareaCls}
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        placeholder="Answer…"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* WhatsApp Connection Section */}
          {activeSection === "whatsapp" && (
            <section className={sectionCls}>
              <h2 className="mb-5 text-lg font-bold text-gray-900">WhatsApp Connection</h2>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isWhatsAppConnected ? "bg-green-100" : "bg-gray-100"}`}>
                  {isWhatsAppConnected ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {isWhatsAppConnected ? "Connected" : "Not Connected"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isWhatsAppConnected
                      ? `Phone: ${form.whatsapp}`
                      : "Add your WhatsApp number to enable sync"}
                  </p>
                </div>
              </div>
              {isWhatsAppConnected && (
                <div className="mt-6">
                  <label className={labelCls}>WhatsApp Phone ID</label>
                  <input
                    className={inputCls}
                    value={form.whatsappPhoneNumberId}
                    onChange={(e) => set("whatsappPhoneNumberId", e.target.value)}
                    placeholder="1234567890"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Get your Phone ID from the Meta Developer Portal
                  </p>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <QrCode className="h-4 w-4" />
                  Reconnect
                </button>
              </div>
            </section>
          )}

          {/* Widget Embed Code Section */}
          {activeSection === "widget" && (
            <section className={sectionCls}>
              <h2 className="mb-5 text-lg font-bold text-gray-900">Widget Embed Code</h2>
              <p className="mb-4 text-sm text-gray-500">
                Copy this code and paste it into your website&apos;s HTML, just before the closing &lt;/body&gt; tag.
              </p>
              <div className="relative">
                <code className="block rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 break-all">
                  {widgetCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyWidget}
                  className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Installation Instructions</h3>
                <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
                  <li>Copy the embed code above</li>
                  <li>Paste it into your website HTML</li>
                  <li>The widget will appear automatically</li>
                  <li>Customize the color in AI Configuration</li>
                </ol>
              </div>
            </section>
          )}

          {/* Notification Preferences Section */}
          {activeSection === "notifications" && (
            <section className={sectionCls}>
              <h2 className="mb-5 text-lg font-bold text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.notifications.email}
                    onChange={(e) => setNotification("email", e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts via WhatsApp</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.notifications.whatsapp}
                    onChange={(e) => setNotification("whatsapp", e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">New Lead Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when new leads are captured</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.notifications.newLeads}
                    onChange={(e) => setNotification("newLeads", e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </label>
              </div>
            </section>
          )}

          {/* Subscription & Billing Section */}
          {activeSection === "billing" && (
            <section className={sectionCls}>
              <h2 className="mb-5 text-lg font-bold text-gray-900">Subscription & Billing</h2>
              
              {/* Current Plan */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-2xl font-bold text-gray-900">{planName}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </span>
                </div>
                {planExpiresAt && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    Next billing date: {new Date(planExpiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Plan Actions */}
              <div className="space-y-3">
                <a
                  href="/payment"
                  className="flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Manage Subscription
                </a>
                <p className="text-center text-xs text-gray-500">
                  Powered by Paddle • Secure payment processing
                </p>
              </div>

              {/* Cancel link */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Cancel Subscription
                </button>
              </div>
            </section>
          )}

          {/* Danger Zone Section */}
          {activeSection === "danger" && (
            <section className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 text-lg font-bold text-red-900">Danger Zone</h2>
              <p className="mb-4 text-sm text-red-700">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center justify-center rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Delete Account
                </button>
              </div>

              {/* Delete confirmation modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                    <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Account?</h3>
                    <p className="mb-4 text-sm text-gray-500">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Save button - only show for relevant sections */}
          {(activeSection === "profile" || activeSection === "ai" || activeSection === "notifications") && (
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Helper component for Brain icon (since it's not imported)
function Brain({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    </svg>
  );
}
