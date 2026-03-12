import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';

import { AppProviders } from './providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'CypAI — AI Agents for Cyprus Businesses',
  description:
    '24/7 AI customer service for local businesses in Northern Cyprus. Auto-capture leads, handle WhatsApp, speak English, Turkish, Arabic & Russian. Setup in 15 minutes.',
  keywords: 'AI chatbot Cyprus, WhatsApp AI Northern Cyprus, AI agent TRNC, customer service automation Cyprus, CypAI',
  openGraph: {
    title: 'CypAI — AI Agents for Cyprus Businesses',
    description: 'Never miss a lead again. 24/7 AI on WhatsApp + website for car rentals, hotels, barbershops in Cyprus.',
    url: 'https://biz-ai-u4n3.vercel.app',
    siteName: 'CypAI',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        {/* SimpleAnalytics - Privacy friendly analytics */}
        <script
          data-collect-dnt="true"
          async
          defer
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        />
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </head>
      <body className={`${jakarta.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
