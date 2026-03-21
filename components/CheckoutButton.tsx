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
    console.log('Opening checkout with:', { 
      plan, 
      priceId, 
      userEmail,
      allPrices: PADDLE_PRICES 
    });

    if (!priceId) {
      console.error('Price ID not found for plan:', plan, 'Available:', PADDLE_PRICES);
      alert('Configuration error: Price ID not set. Check environment variables.');
      return;
    }

    setLoading(true);
    try {
      const checkout = await paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: userEmail ? { email: userEmail } : undefined,
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
        }
      });
      console.log('Checkout opened:', checkout);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Check console for details.');
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
