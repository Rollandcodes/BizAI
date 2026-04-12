'use client';

import { PaddleProvider } from '@/components/PaddleProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PaddleProvider>
      {children}
    </PaddleProvider>
  );
}

