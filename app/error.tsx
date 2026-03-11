'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We hit an unexpected issue. Please try again in a moment.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}