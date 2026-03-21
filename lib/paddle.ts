// lib/paddle.ts
// Central Paddle configuration and helpers

export const PADDLE_CONFIG = {
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  apiKey: process.env.PADDLE_API_KEY!,
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET!,
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as 'sandbox' | 'production',
  // Backend environment (defaults to sandbox if not set)
  env: (process.env.PADDLE_ENV || 'sandbox') as 'sandbox' | 'production',
};

export const PADDLE_PRICES = {
  starter: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER!,
  pro: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO!,
  business: process.env.NEXT_PUBLIC_PADDLE_PRICE_BUSINESS!,
} as const;

export type PaddlePlan = keyof typeof PADDLE_PRICES;
