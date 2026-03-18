import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      {/* 404 Number */}
      <div className="text-9xl font-black text-[#1a1a2e] opacity-20">404</div>
      
      {/* Main Content */}
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">
          This page doesn't exist yet.
        </h1>
        <p className="mt-3 text-gray-600">
          But our AI is available 24/7 for your customers.
        </p>
      </div>

      {/* Robot/Emoji */}
      <div className="mt-8 text-6xl">🤖</div>

      {/* Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-[#e8a020] px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-all hover:-translate-y-0.5 hover:bg-[#d49020] hover:shadow-lg hover:shadow-[#e8a020]/25"
        >
          Go Home
        </Link>
        <Link
          href="/demo"
          className="rounded-lg border border-[#1a1a2e] bg-white px-6 py-3 text-sm font-semibold text-[#1a1a2e] transition-all hover:bg-gray-50"
        >
          Try the Demo
        </Link>
      </div>
    </div>
  );
}
