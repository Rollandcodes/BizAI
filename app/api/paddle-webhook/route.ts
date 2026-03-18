// app/api/paddle-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Paddle } from '@paddle/paddle-node-sdk';

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature') ?? '';
  const rawBody = await req.text();

  try {
    const event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );

    switch (event.eventType) {
      case 'subscription.activated': {
        const customerEmail = (event.data as any).customer?.email;
        const priceId = (event.data as any).items?.[0]?.price?.id;
        console.log(`New subscriber: ${customerEmail} on ${priceId}`);
        break;
      }
      case 'subscription.canceled': {
        const customerEmail = (event.data as any).customer?.email;
        console.log(`Cancelled: ${customerEmail}`);
        break;
      }
      case 'transaction.payment_failed': {
        const customerEmail = (event.data as any).customer?.email;
        console.log(`Payment failed: ${customerEmail}`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    );
  }
}
