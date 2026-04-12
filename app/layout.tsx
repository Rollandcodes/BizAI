import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CypAI — AI-Powered Customer Service for Cyprus & MENA',
  description: 'Automate your customer conversations 24/7 with the smartest AI agents in English, Arabic, and Turkish. Free forever for SMBs.',
  keywords: ['AI Chatbot', 'Customer Service Automation', 'Cyprus Business', 'MENA AI', 'WhatsApp Business AI'],
  metadataBase: new URL('https://cypai.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans selection:bg-primary/30 selection:text-white`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  )
}

