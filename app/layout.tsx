import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { cookies } from 'next/headers';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';
import PayPalProvider from '@/components/PayPalProvider';

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
    '24/7 AI customer service for local businesses in Northern Cyprus. Auto-capture leads, handle WhatsApp, speak English, Turkish, Arabic, Russian & Greek. Setup in 15 minutes.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('cypai-locale')?.value;
  const locale = cookieLocale === 'tr' || cookieLocale === 'ar' || cookieLocale === 'ru' || cookieLocale === 'el' || cookieLocale === 'en'
    ? cookieLocale
    : 'en';
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CypAI" />
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
      <body className={`${jakarta.variable} bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-white`}>
        <PayPalProvider>
          <AppProviders>{children}</AppProviders>
        </PayPalProvider>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
