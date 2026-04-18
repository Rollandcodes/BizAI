'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import CalendarTab from '@/components/dashboard/CalendarTab'
import { Loader } from 'lucide-react'

export default function CalendarPage() {
  const { userId } = useAuth()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    async function fetchBusinessId() {
      try {
        const res = await fetch('/api/business')
        if (res.ok) {
          const data = await res.json() as { id?: string }
          setBusinessId(data.id || null)
        }
      } catch (err) {
        console.error('Failed to fetch business:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessId()
  }, [userId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-electric-lime" />
      </div>
    )
  }

  if (!businessId) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-50/5 p-6 text-center text-red-400">
        <p>Failed to load calendar. Please refresh.</p>
      </div>
    )
  }

  return <CalendarTab businessId={businessId} />
}
