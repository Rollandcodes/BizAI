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
  title: 'BizAI — AI Agents for Local Businesses in Cyprus',
  description:
    'Deploy a 24/7 AI assistant that answers customers, captures leads, and books appointments on your website and WhatsApp. Live in 24 hours.',
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
      </head>
      <body className={`${jakarta.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
