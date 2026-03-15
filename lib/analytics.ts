// lib/analytics.ts — client-side event tracking (Simple Analytics compatible)
declare global {
  interface Window {
    sa_event?: (name: string, metadata?: Record<string, string | number>) => void;
  }
}

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const query = new URLSearchParams(window.location.search);
  const attrs: Record<string, string> = {};
  for (const key of ATTR_KEYS) {
    const fromQuery = query.get(key)?.trim();
    if (fromQuery) {
      attrs[key] = fromQuery;
      localStorage.setItem(`cypai_${key}`, fromQuery);
    } else {
      const stored = localStorage.getItem(`cypai_${key}`)?.trim();
      if (stored) attrs[key] = stored;
    }
  }
  return attrs;
}

function track(event: string, meta?: Record<string, string | number>) {
  try {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(event, { ...getAttribution(), ...meta });
    }
  } catch {
    // Analytics must never crash the app
  }
}

export const Analytics = {
  // Funnel events
  heroCtaClicked:     (plan: string)               => track("hero_cta_clicked",     { plan }),
  pricingViewed:      ()                            => track("pricing_viewed"),
  planSelected:       (plan: string, price: number) => track("plan_selected",        { plan, price }),
  demoViewed:         ()                            => track("demo_viewed"),
  signupStarted:      (plan: string)               => track("signup_started",        { plan }),
  signupAbandoned:    (plan: string)               => track("signup_abandoned",      { plan }),
  signupCompleted:    (plan: string)               => track("signup_completed",      { plan }),
  paymentStarted:     (plan: string, amount: number) => track("payment_started",     { plan, amount }),
  paymentAbandoned:   (plan: string, amount: number) => track("payment_abandoned",   { plan, amount }),
  paymentCompleted:   (plan: string, amount: number) => track("payment_completed",   { plan, amount }),
  paymentFailed:      (plan: string)               => track("payment_failed",        { plan }),

  // Product events
  chatOpened:         (businessType: string)       => track("chat_opened",           { businessType }),
  leadCaptured:       (businessType: string)       => track("lead_captured",         { businessType }),
  whatsappClicked:    (source: string)             => track("whatsapp_clicked",      { source }),
  dashboardLogin:     ()                            => track("dashboard_login"),
  dashboardTabViewed: (tab: string)                => track("dashboard_tab_viewed",  { tab }),
  agencyAccessDenied: (email: string)              => track("agency_access_denied",  { email }),
};

export { track as trackEvent };
