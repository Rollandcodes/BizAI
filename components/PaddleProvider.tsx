'use client';

import { useEffect } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { PADDLE_CONFIG } from '@/lib/paddle';

let paddleInstance: Paddle | null = null;

export function usePaddle() {
  return paddleInstance;
}

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (paddleInstance) return;

    initializePaddle({
      environment: PADDLE_CONFIG.environment,
      token: PADDLE_CONFIG.clientToken,
    }).then((paddle) => {
      if (paddle) {
        paddleInstance = paddle;
      }
    });
  }, []);

  return <>{children}</>;
}
