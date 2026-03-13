'use client';

import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl shadow-black/30">
        <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-3 text-sm text-zinc-400">
          We hit an unexpected issue. Please try again in a moment.
        </p>
        {error?.digest && (
          <p className="mt-2 font-mono text-xs text-zinc-600">Error ID: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}