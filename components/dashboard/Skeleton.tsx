"use client";

/**
 * Skeleton components for loading states
 */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="mt-4 h-9 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-3 w-1/4" />
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonBlock className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-1/3" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="mt-4 h-9 w-20" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-32 w-full" />
        </div>
        <SkeletonBlock className="h-12 w-32" />
      </div>
    </div>
  );
}

export function QRSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-4 w-48" />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
        <SkeletonBlock className="h-40 w-40 rounded-xl" />
        <div className="space-y-4">
          <SkeletonBlock className="h-16 w-64" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 w-24" />
            <SkeletonBlock className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e8a020] border-t-transparent" />
    </div>
  );
}

// Base skeleton block component
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export default function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="mt-2 h-5 w-64" />
      </div>
      <CardSkeleton />
    </div>
  );
}
