import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import PayPalProvider from '@/components/PayPalProvider';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';

import './globals.css';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CypAI — AI Business Platform for Cyprus',
  description: 'Complete AI platform for local businesses in Cyprus. AI chat, CRM, bookings, analytics in 5 languages. Setup in 15 minutes.',
  keywords: 'AI chatbot Cyprus, WhatsApp AI Northern Cyprus, AI agent TRNC, CypAI',
  openGraph: {
    title: 'CypAI — AI Business Platform for Cyprus',
    description: 'Never miss a lead again. 24/7 AI on WhatsApp + website for car rentals, hotels, barbershops in Cyprus.',
    url: 'https://www.cypai.app',
    siteName: 'CypAI',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${font.className} bg-white text-gray-900 antialiased`}>
        <PayPalProvider>
          {children}
        </PayPalProvider>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
