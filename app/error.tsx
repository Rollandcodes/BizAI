'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050510] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold font-display">Something went wrong</h1>
          <p className="text-white/50 text-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-full bg-electric-lime text-space-black text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
            >
              Go Home
            </Link>
          </div>
          {error.digest && (
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
