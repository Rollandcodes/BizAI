import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { FloatingWhatsAppButton } from '@/components/ui/floating-whatsapp-button';

import { AppProviders } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BizAI - AI Customer Service Assistant',
  description: '24/7 AI assistant for local businesses',
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
