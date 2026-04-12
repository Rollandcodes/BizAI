'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white">Failed to load this page</h2>
          <p className="text-white/40 text-sm">
            Something went wrong. Try refreshing or contact support if this persists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-full bg-electric-lime text-space-black text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm font-medium hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
        {error.digest && (
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
