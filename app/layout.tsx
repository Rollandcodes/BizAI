import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'CypAI - AI Customer Service for Cyprus Businesses',
  description:
    'AI-powered 24/7 customer service for car rentals, hotels, barbershops and restaurants in Northern Cyprus. Handles WhatsApp + website chat in English, Turkish, Arabic, Russian and Greek.',
  keywords:
    'AI chatbot Cyprus, WhatsApp AI Northern Cyprus, TRNC AI assistant, Kyrenia business AI, AI customer service Cyprus, chatbot Arabic Turkish',
  openGraph: {
    title: 'CypAI - Never Miss a Customer Again',
    description: 'AI agent for Cyprus businesses. 5 languages, 24/7, WhatsApp + website. Setup in 15 minutes.',
    url: 'https://www.cypai.app',
    siteName: 'CypAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CypAI - AI for Cyprus Businesses',
    description: 'AI chat, CRM, bookings, and WhatsApp in one platform.',
  },
  alternates: {
    canonical: 'https://www.cypai.app',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CypAI',
  description: 'AI customer service platform for local businesses in Cyprus',
  url: 'https://www.cypai.app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '29', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pro', price: '79', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Business', price: '149', priceCurrency: 'USD' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'cypai.app@cypai.app',
    contactType: 'customer service',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${font.className} 
        bg-white text-gray-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
