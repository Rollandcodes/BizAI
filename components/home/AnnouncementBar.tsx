'use client'

import { useState } from 'react'
import Link from 'next/link'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative flex h-11 w-full items-center justify-center bg-[#e8a020] px-4 text-center text-sm font-medium text-[#1a1a2e]">
      <span>🎉 7-day free trial — No credit card required.</span>
      <Link 
        href="/signup?plan=pro" 
        className="ml-2 underline hover:text-[#1a1a2e]/80"
      >
        Start free today →
      </Link>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full text-[#1a1a2e]/60 hover:bg-[#1a1a2e]/10"
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  )
}
