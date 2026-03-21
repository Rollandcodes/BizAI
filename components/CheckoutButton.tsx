'use client';

import { useState } from 'react';
import { usePaddle } from '@/components/PaddleProvider';
import { PADDLE_PRICES, PaddlePlan } from '@/lib/paddle';

interface CheckoutButtonProps {
  plan: PaddlePlan;
  userEmail?: string;
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({
  plan,
  userEmail,
  className,
  children,
}: CheckoutButtonProps) {
  const paddle = usePaddle();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!paddle) {
      console.error('Paddle not initialized');
      return;
    }

    const priceId = PADDLE_PRICES[plan];
    console.log('Opening checkout with:', { plan, priceId, userEmail });

    if (!priceId) {
      console.error('Price ID not found for plan:', plan);
      alert('Configuration error: Price ID not set. Check environment variables.');
      return;
    }

    setLoading(true);
    try {
      await paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: userEmail ? { email: userEmail } : undefined,
      });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? 'Loading...' : children}
    </button>
  );
}
