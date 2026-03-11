export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  const eventData = { event: eventName, ...payload };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventData);
  }

  // Keep this log in dev for quick analytics verification.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info('[analytics]', eventData);
  }
}
