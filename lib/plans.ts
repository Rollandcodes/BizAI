// lib/plans.ts — single source of truth for all plan configuration

export interface Plan {
  id:          string;
  name:        string;
  price:       string;
  description: string;
  features:    string[];
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id:          "starter",
    name:        "Starter",
    price:       "29.00",
    description: "Perfect for small local businesses just getting started",
    features: [
      "500 messages/month",
      "Website chat widget",
      "Lead capture (name + phone)",
      "Basic analytics",
      "Email support",
      "QR code for walk-in customers",
      "Mobile-friendly chat",
      "5 language support",
    ],
  },
  pro: {
    id:          "pro",
    name:        "Pro",
    price:       "79.00",
    description: "For growing businesses that need full control",
    features: [
      "Unlimited messages",
      "Website chat widget",
      "WhatsApp integration",
      "Advanced analytics & reports",
      "Custom AI training & FAQs",
      "QR code + booking system",
      "Customer satisfaction ratings",
      "Broadcast messages to leads",
      "Priority support (24h response)",
      "7-day free trial",
    ],
  },
  business: {
    id:          "business",
    name:        "Business",
    price:       "149.00",
    description: "Full suite for serious businesses",
    features: [
      "Everything in Pro",
      "Agent Audit & compliance reports",
      "AI safety scoring per conversation",
      "Sensitive data detection",
      "Weekly PDF compliance report",
      "Multi-location support",
      "Phone support",
      "Dedicated onboarding call",
      "SLA guarantee",
    ],
  },
};

// Keep "basic" as an alias for "starter" (DB compatibility)
PLANS.basic = { ...PLANS.starter, id: "basic" };

export function getPlan(planId: string): Plan | null {
  return PLANS[planId] ?? null;
}

export function getAllPlans(): Plan[] {
  return [PLANS.starter, PLANS.pro, PLANS.business];
}

export function isValidPlanId(planId: string): boolean {
  return planId in PLANS;
}

/** Message limit per plan per month. null = unlimited. */
export const PLAN_MESSAGE_LIMITS: Record<string, number | null> = {
  trial:    100,
  basic:    500,
  starter:  500,
  pro:      null,
  business: null,
};

export function planDisplayName(plan: string): string {
  const names: Record<string, string> = {
    trial: "Trial", basic: "Starter", starter: "Starter", pro: "Pro", business: "Business",
  };
  return names[plan] ?? "Trial";
}

export function planBadgeClass(plan: string): string {
  const classes: Record<string, string> = {
    trial:    "bg-zinc-800 text-zinc-300",
    basic:    "bg-green-100 text-green-700",
    starter:  "bg-green-100 text-green-700",
    pro:      "bg-blue-100 text-blue-700",
    business: "bg-purple-100 text-purple-700",
  };
  return classes[plan] ?? classes.trial;
}
