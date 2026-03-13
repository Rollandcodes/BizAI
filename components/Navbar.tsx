'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold text-gray-900">CypAI</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Pricing
            </a>
            <Link href="/demo" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Live Demo
            </Link>
            <a href="#contact" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:block"
            >
              Login
            </Link>
            <Link
              href="/signup?plan=pro"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => setIsMenuOpen((previous) => !previous)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="space-y-3 border-t border-gray-100 py-4 md:hidden">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Pricing
            </a>
            <Link
              href="/demo"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Live Demo
            </Link>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Contact
            </a>
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/signup?plan=pro"
              className="mx-4 block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Start Free Trial
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
