"use client";
import { useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import type { Business } from "@/lib/supabase";

const BUSINESS_TYPES = [
  { value: "car_rental",           label: "Car Rental"           },
  { value: "car_sales",            label: "Car Sales"            },
  { value: "barbershop",           label: "Barbershop / Salon"   },
  { value: "student_accommodation",label: "Student Accommodation"},
  { value: "restaurant",           label: "Restaurant / Café"    },
  { value: "clinic",               label: "Clinic / Medical"     },
  { value: "gym",                  label: "Gym / Fitness"        },
  { value: "hotel",                label: "Hotel / Guesthouse"   },
  { value: "other",                label: "Other"                },
];

const WIDGET_COLORS = [
  "#2563eb","#7c3aed","#0891b2","#059669","#dc2626","#d97706","#db2777","#1d4ed8",
];

interface SettingsState {
  businessName:          string;
  businessType:          string;
  whatsapp:              string;
  whatsappPhoneNumberId: string;
  website:               string;
  primaryColor:          string;
  aiInstructions:        string;
  pricingInfo:           string;
  commonQuestionsText:   string;
  additionalInfo:        string;
  customFaqs:            Array<{ question: string; answer: string }>;
}

interface Props {
  business:   Business;
  onSaved:    () => void;
  showToast:  (msg: string, tone: "success" | "error") => void;
}

export default function SettingsTab({ business, onSaved, showToast }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SettingsState>({
    businessName:          business.business_name ?? "",
    businessType:          business.business_type ?? "other",
    whatsapp:              business.whatsapp ?? "",
    whatsappPhoneNumberId: business.whatsapp_phone_number_id ?? "",
    website:               business.website ?? "",
    primaryColor:          business.widget_color ?? "#2563eb",
    aiInstructions:        (business as Business & { customInstructions?: string }).customInstructions ?? "",
    pricingInfo:           business.pricing_info ?? "",
    commonQuestionsText:   business.common_questions_text ?? "",
    additionalInfo:        business.additional_info ?? "",
    customFaqs:            business.custom_faqs?.length ? business.custom_faqs : [{ question: "", answer: "" }],
  });

  function set<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const addFaq = () => set("customFaqs", [...form.customFaqs, { question: "", answer: "" }]);
  const removeFaq = (i: number) => set("customFaqs", form.customFaqs.length === 1 ? [{ question: "", answer: "" }] : form.customFaqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: "question" | "answer", v: string) =>
    set("customFaqs", form.customFaqs.map((faq, idx) => idx === i ? { ...faq, [field]: v } : faq));

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId:            business.id,
          business_name:         form.businessName,
          business_type:         form.businessType,
          whatsapp:              form.whatsapp,
          whatsapp_phone_number_id: form.whatsappPhoneNumberId,
          website:               form.website,
          widget_color:          form.primaryColor,
          system_prompt:         form.aiInstructions || null,
          pricing_info:          form.pricingInfo || null,
          common_questions_text: form.commonQuestionsText || null,
          additional_info:       form.additionalInfo || null,
          custom_faqs:           form.customFaqs.filter(f => f.question.trim() || f.answer.trim()),
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

  const inputCls = "h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-blue-500 transition";
  const textareaCls = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-blue-500 transition resize-none";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5";

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-3xl">
      {/* Business details */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-5 text-base font-bold text-zinc-100">Business details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Business name</label>
            <input className={inputCls} value={form.businessName} onChange={e => set("businessName", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Business type</label>
            <select className={inputCls} value={form.businessType} onChange={e => set("businessType", e.target.value)}>
              {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>WhatsApp number</label>
            <input className={inputCls} value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="+905551234567" />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Phone ID <span className="normal-case text-zinc-600">(for Cloud API)</span></label>
            <input className={inputCls} value={form.whatsappPhoneNumberId} onChange={e => set("whatsappPhoneNumberId", e.target.value)} placeholder="1234567890" />
          </div>
          <div>
            <label className={labelCls}>Website URL</label>
            <input className={inputCls} value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourbusiness.com" />
          </div>
        </div>
      </section>

      {/* Widget appearance */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-5 text-base font-bold text-zinc-100">Widget colour</h2>
        <div className="flex flex-wrap gap-3">
          {WIDGET_COLORS.map(color => (
            <button key={color} type="button"
              onClick={() => set("primaryColor", color)}
              className={`h-10 w-10 rounded-full border-2 transition ${form.primaryColor === color ? "border-white scale-110" : "border-transparent"}`}
              style={{ background: color }}
            />
          ))}
          <input type="color" value={form.primaryColor} onChange={e => set("primaryColor", e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-full border-2 border-zinc-600 p-0.5" />
        </div>
      </section>

      {/* AI configuration */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-5 text-base font-bold text-zinc-100">AI configuration</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Custom AI instructions <span className="normal-case text-zinc-500">(optional — overrides the default niche prompt)</span></label>
            <textarea className={textareaCls} rows={4} value={form.aiInstructions} onChange={e => set("aiInstructions", e.target.value)} placeholder="You are a helpful assistant for…" />
          </div>
          <div>
            <label className={labelCls}>Pricing information</label>
            <textarea className={textareaCls} rows={3} value={form.pricingInfo} onChange={e => set("pricingInfo", e.target.value)} placeholder="Economy car: $25/day, SUV: $55/day…" />
          </div>
          <div>
            <label className={labelCls}>Common questions &amp; answers</label>
            <textarea className={textareaCls} rows={3} value={form.commonQuestionsText} onChange={e => set("commonQuestionsText", e.target.value)} placeholder="Q: Do you offer free delivery?\nA: Yes, within 10km." />
          </div>
          <div>
            <label className={labelCls}>Additional context</label>
            <textarea className={textareaCls} rows={2} value={form.additionalInfo} onChange={e => set("additionalInfo", e.target.value)} placeholder="Parking is available at the main entrance. We are closed on public holidays." />
          </div>
        </div>
      </section>

      {/* Custom FAQs */}
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100">Custom FAQs</h2>
          <button type="button" onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800">
            <Plus className="h-3 w-3" /> Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {form.customFaqs.map((faq, i) => (
            <div key={i} className="relative rounded-2xl border border-zinc-700 bg-zinc-950/50 p-4">
              <button type="button" onClick={() => removeFaq(i)}
                className="absolute right-3 top-3 text-zinc-600 hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
              <input className={`${inputCls} mb-2`} value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} placeholder={`Question ${i + 1}`} />
              <textarea className={textareaCls} rows={2} value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} placeholder="Answer…" />
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
