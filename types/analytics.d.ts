export {};

declare global {
  interface Window {
    sa_event?: (
      eventName: string,
      metadata?: Record<string, string | number>
    ) => void;
  }
}
