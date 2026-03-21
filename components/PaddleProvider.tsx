'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { PADDLE_CONFIG } from '@/lib/paddle';

let paddleInstance: Paddle | null = null;

export function usePaddle() {
  return paddleInstance;
}

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paddleInstance) return;

    // Debug: Log environment config
    console.log('Paddle initializing with:', {
      environment: PADDLE_CONFIG.environment,
      hasToken: !!PADDLE_CONFIG.clientToken,
      tokenPrefix: PADDLE_CONFIG.clientToken?.substring(0, 5),
      tokenLength: PADDLE_CONFIG.clientToken?.length,
    });

    initializePaddle({
      environment: PADDLE_CONFIG.environment,
      token: PADDLE_CONFIG.clientToken,
    }).then((paddle) => {
      if (paddle) {
        paddleInstance = paddle;
        console.log('Paddle initialized successfully');
      }
    }).catch((err) => {
      console.error('Paddle initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Paddle');
    });
  }, []);

  if (error) {
    console.error('Paddle Error:', error);
  }

  return <>{children}</>;
}
