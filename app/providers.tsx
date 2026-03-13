'use client';

import PayPalProvider from '@/components/PayPalProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <PayPalProvider>{children}</PayPalProvider>;
}