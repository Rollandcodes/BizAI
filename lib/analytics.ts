export const trackEvent = (
  eventName: string,
  metadata?: Record<string, string | number>
) => {
  try {
    const attribution = getAttribution();
    const payload = {
      ...attribution,
      ...metadata,
    };

    if (typeof window !== 'undefined' && window.sa_event) {
      window.sa_event(eventName, payload);
    }
  } catch {
    // Silent fail - analytics should never break the app
  }
};

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function getAttribution(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const query = new URLSearchParams(window.location.search);
  const next: Record<string, string> = {};

  for (const key of ATTR_KEYS) {
    const fromQuery = query.get(key)?.trim();
    if (fromQuery) {
      next[key] = fromQuery;
      window.localStorage.setItem(`cypai_${key}`, fromQuery);
      continue;
    }

    const stored = window.localStorage.getItem(`cypai_${key}`)?.trim();
    if (stored) {
      next[key] = stored;
    }
  }

  return next;
}

export const Analytics = {
  heroCtaClicked: (plan: string) =>
    trackEvent('hero_cta_clicked', { plan }),

  pricingViewed: () =>
    trackEvent('pricing_viewed'),

  planSelected: (plan: string, price: number) =>
    trackEvent('plan_selected', { plan, price }),

  demoViewed: () =>
    trackEvent('demo_viewed'),

  signupStarted: (plan: string) =>
    trackEvent('signup_started', { plan }),

  signupAbandoned: (plan: string) =>
    trackEvent('signup_abandoned', { plan }),

  signupCompleted: (plan: string) =>
    trackEvent('signup_completed', { plan }),

  paymentStarted: (plan: string, amount: number) =>
    trackEvent('payment_started', { plan, amount }),

  paymentAbandoned: (plan: string, amount: number) =>
    trackEvent('payment_abandoned', { plan, amount }),

  paymentCompleted: (plan: string, amount: number) =>
    trackEvent('payment_completed', { plan, amount }),

  paymentFailed: (plan: string) =>
    trackEvent('payment_failed', { plan }),

  chatOpened: (businessType: string) =>
    trackEvent('chat_opened', { businessType }),

  leadCaptured: (businessType: string) =>
    trackEvent('lead_captured', { businessType }),

  whatsappClicked: (source: string) =>
    trackEvent('whatsapp_clicked', { source }),

  dashboardLogin: () =>
    trackEvent('dashboard_login'),

  dashboardTabViewed: (tab: string) =>
    trackEvent('dashboard_tab_viewed', { tab }),
};
