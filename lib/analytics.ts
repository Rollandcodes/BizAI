export const trackEvent = (
  eventName: string,
  metadata?: Record<string, string | number>
) => {
  try {
    if (typeof window !== 'undefined' && window.sa_event) {
      window.sa_event(eventName, metadata);
    }
  } catch {
    // Silent fail - analytics should never break the app
  }
};

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

  signupCompleted: (plan: string) =>
    trackEvent('signup_completed', { plan }),

  paymentStarted: (plan: string, amount: number) =>
    trackEvent('payment_started', { plan, amount }),

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
