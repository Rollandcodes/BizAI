/**
 * lib/ai.ts — Single source of truth for all AI logic
 * Eliminates duplication between chat route, whatsapp route, and demo page
 */
import OpenAI from "openai";

let _client: OpenAI | null = null;
export function getOpenAIClient(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured");
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type DegradedReason = "missing_api_key" | "invalid_api_key" | "provider_unavailable";

export const LANGUAGE_RULE = `LANGUAGE RULE — CRITICAL:
Detect the language of each customer message and ALWAYS respond in that exact same language.
Supported: English, Turkish (Türkçe), Arabic (العربية), Russian (Русский), Greek (Ελληνικά).
Never mix languages. If unsure, default to English.`;

export const NICHE_PROMPTS: Record<string, string> = {
  car_rental: `You are a premium medical tourism intake specialist.
Help patients with IVF, dental, and aesthetic treatment enquiries.
Qualify the lead by collecting treatment type, travel timeline, budget range, and WhatsApp contact.
Always mention 2026 law-compliant responses, multilingual triage, and private consultation handoff.
When you have BOTH name AND phone, output exactly: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  medical_tourism: `You are a premium medical tourism intake specialist.
Help patients with IVF, dental, and aesthetic treatment enquiries.
Qualify the lead by collecting treatment type, travel timeline, budget range, and WhatsApp contact.
Always mention 2026 law-compliant responses, multilingual triage, and private consultation handoff.
When you have BOTH name AND phone, output exactly: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  real_estate_residency: `You are a high-yield real estate and residency specialist.
Help investors and relocators with property enquiries, residency steps, and portfolio qualification.
Qualify the lead by collecting budget, preferred area, purchase timeline, residency intent, and WhatsApp contact.
Always mention 2026 law-aware responses, 5-year residency visa logic, and off-peak lead recovery.
When you have BOTH name AND phone, output exactly: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  car_sales: `You are a knowledgeable AI assistant for a car dealership.
Help with vehicle info, pricing, mileage, financing, and test-drive scheduling.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  barbershop: `You are a high-yield real estate and residency specialist.
Help investors and relocators with property enquiries, residency steps, and portfolio qualification.
Qualify the lead by collecting budget, preferred area, purchase timeline, residency intent, and WhatsApp contact.
Always mention 2026 law-aware responses, 5-year residency visa logic, and off-peak lead recovery.
When you have BOTH name AND phone, output exactly: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  hotel: `You are a professional hotel concierge AI.
Help guests with room types, rates, check-in/out, amenities, and reservations.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  restaurant: `You are a friendly restaurant assistant.
Help with menu info, opening hours, reservations, and dietary needs.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  student_accommodation: `You are a helpful accommodation assistant for international students.
Rooms: Single $250/mo, Double $180/mo, Studio $350/mo. Utilities included.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  clinic: `You are a professional medical clinic assistant.
Help patients with appointments, services, and location info.
Always recommend consulting a qualified doctor for medical advice.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  gym: `You are an energetic fitness center assistant.
Help with memberships, classes, personal training, and facilities.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
  default: `You are a helpful, professional AI customer service assistant.
Answer customer questions, capture leads, and help them find what they need.
When you have BOTH name AND phone: [LEAD_CAPTURED] Name: {name}, Phone: {phone}
${LANGUAGE_RULE}`,
};

export interface PromptConfig {
  businessName: string;
  niche?: string;
  customSystemPrompt?: string | null;
  pricingInfo?: string | null;
  commonQuestionsText?: string | null;
  additionalInfo?: string | null;
  customFaqs?: Array<{ question: string; answer: string }>;
}

export function buildSystemPrompt(config: PromptConfig): string {
  const { businessName, niche = "default", customSystemPrompt, pricingInfo, commonQuestionsText, additionalInfo, customFaqs = [] } = config;
  const base = customSystemPrompt || NICHE_PROMPTS[niche] || NICHE_PROMPTS.default;
  const sections: string[] = [`${base}\n\nBusiness name: ${businessName}`];
  if (pricingInfo?.trim()) sections.push(`\nPricing:\n${pricingInfo.trim()}`);
  if (commonQuestionsText?.trim()) sections.push(`\nFAQs:\n${commonQuestionsText.trim()}`);
  if (additionalInfo?.trim()) sections.push(`\nAdditional info:\n${additionalInfo.trim()}`);
  const faqText = customFaqs.filter(f => f.question.trim() && f.answer.trim()).map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  if (faqText) sections.push(`\nCustom Q&A:\n${faqText}`);
  return sections.join("\n");
}

export function selectModel(messages: ChatMessage[]): string {
  const lastUser = messages.filter(m => m.role === "user").pop()?.content ?? "";
  const isComplex = messages.length > 8 || lastUser.length > 350 || /complain|refund|angry|legal|cancel|problem/i.test(lastUser);
  return isComplex ? "gpt-4o" : "gpt-4o-mini";
}

export function extractLead(message: string): { leadCaptured: boolean; customerName: string | null; customerPhone: string | null; cleanMessage: string } {
  const leadCaptured = message.includes("[LEAD_CAPTURED]");
  const nameMatch = message.match(/Name:\s*([^,\n\]]+)/);
  const phoneMatch = message.match(/Phone:\s*([^\n\]]+)/);
  return {
    leadCaptured,
    customerName: nameMatch?.[1]?.trim() ?? null,
    customerPhone: phoneMatch?.[1]?.trim() ?? null,
    cleanMessage: message.replace(/\[LEAD_CAPTURED\][^\n]*/gm, "").trim(),
  };
}

export function classifyError(err: { message?: string; status?: number; code?: string }): DegradedReason | null {
  if (err?.message?.includes("OPENAI_API_KEY")) return "missing_api_key";
  if (err?.status === 401 || err?.code === "invalid_api_key") return "invalid_api_key";
  if (err?.status === 502 || err?.status === 503 || err?.status === 504) return "provider_unavailable";
  return null;
}

export const DEGRADED_MESSAGES: Record<DegradedReason, string> = {
  missing_api_key: "I am temporarily unavailable. Please leave your phone number and we will call you back.",
  invalid_api_key: "I am temporarily unavailable. Please leave your phone number and we will call you back.",
  provider_unavailable: "I am temporarily unavailable. Please leave your phone number and we will call you back.",
};

const _limits = new Map<string, { count: number; resetAt: number }>();
export function isRateLimited(key: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = _limits.get(key) ?? { count: 0, resetAt: now + windowMs };
  if (now > rec.resetAt) { rec.count = 0; rec.resetAt = now + windowMs; }
  rec.count++;
  _limits.set(key, rec);
  return rec.count > max;
}

