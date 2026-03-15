import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import { AppProviders } from './providers';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cypai.app'),
  title: 'CypAI - B2B SaaS Automation for Customer Service and Lead Recovery',
  description:
    'B2B SaaS platform for 24/7 customer service, lead capture, and recovery automation. Manage website chat, WhatsApp, CRM, and PayPal-based billing flows in one system.',
  keywords:
    'B2B SaaS automation, AI customer service, lead recovery automation, WhatsApp AI chatbot, CRM automation, PayPal SaaS billing, Cyprus business AI',
  openGraph: {
    title: 'CypAI - Never Miss a Customer Again',
    description: 'AI agent for Cyprus businesses. 5 languages, 24/7, WhatsApp + website. Setup in 15 minutes.',
    url: 'https://www.cypai.app',
    siteName: 'CypAI',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['tr_TR', 'ar_AR', 'ru_RU', 'el_GR'],
    images: [
      {
        url: '/images/cypai-logo.png',
        width: 512,
        height: 512,
        alt: 'CypAI logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cypai',
    title: 'CypAI - AI for Cyprus Businesses',
    description: 'AI chat, CRM, bookings, and WhatsApp in one platform.',
    images: ['/images/cypai-logo.png'],
  },
  alternates: {
    canonical: 'https://www.cypai.app',
    languages: {
      en: 'https://www.cypai.app',
      tr: 'https://www.cypai.app',
      ar: 'https://www.cypai.app',
      ru: 'https://www.cypai.app',
      el: 'https://www.cypai.app',
      'x-default': 'https://www.cypai.app',
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.cypai.app/#software',
      name: 'CypAI',
      description:
        'AI-powered customer service, lead generation, and booking automation for Cyprus and MENA businesses.',
      url: 'https://www.cypai.app',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '29', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro', price: '79', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Business', price: '149', priceCurrency: 'USD' },
      ],
      featureList: [
        'WhatsApp Integration',
        'Multilingual AI Chat (English, Turkish, Arabic, Russian, Greek)',
        'Booking System',
        'Lead CRM',
      ],
      areaServed: [
        { '@type': 'Country', name: 'Cyprus' },
        { '@type': 'DefinedRegion', name: 'Middle East and North Africa (MENA)' },
      ],
      knowsLanguage: ['en', 'tr', 'ar', 'ru', 'el'],
      softwareHelp: 'https://www.cypai.app/#faq',
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.cypai.app/#organization',
      name: 'CypAI',
      image: 'https://www.cypai.app/images/cypai-logo.png',
      url: 'https://www.cypai.app',
      telephone: '+905338425559',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kyrenia',
        addressCountry: 'CY',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 35.3414,
        longitude: 33.3186,
      },
      areaServed: [
        { '@type': 'Country', name: 'Cyprus' },
        { '@type': 'DefinedRegion', name: 'Middle East' },
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Customer Service Automation',
        'Lead generation',
        'Booking systems',
        'WhatsApp automation',
      ],
      sameAs: [
        'https://www.linkedin.com/company/cypai',
      ],
    },
  ],
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
      <body className={`${font.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
