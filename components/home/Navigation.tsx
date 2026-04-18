'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const industries = [
  { emoji: '🏥', title: 'Medical Tourism', href: '/for/medical-tourism/kyrenia', desc: 'Triage leads in 5 languages' },
  { emoji: '🏢', title: 'Real Estate & Residency', href: '/for/real-estate/nicosia', desc: 'Qualify investors faster' },
  { emoji: '🩺', title: 'Clinics', href: '/clinics', desc: 'Less admin, more patients' },
  { emoji: '🍽️', title: 'Restaurants', href: '/restaurants', desc: 'Full tables, zero missed reservations' },
  { emoji: '🏨', title: 'Hotels', href: '/hotels', desc: '24/7 guest service' },
  { emoji: '🎓', title: 'Student Housing', href: '/student-housing', desc: 'Fill rooms faster' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [industriesOpen, setIndustriesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#why-northern-cyprus', label: 'Why Northern Cyprus?' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/demo', label: 'Demo' },
  ]

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0a0f1e]/90 backdrop-blur-xl shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="CypAI Home">
          <Image
            src="/images/cypai-logo.png"
            alt="CypAI"
            width={200}
            height={60}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-[#e8a020]"
            >
              {link.label}
            </Link>
          ))}
          
          {/* Industries Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-[#e8a020]">
              Industries
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {industriesOpen && (
              <div className="absolute left-1/2 top-full mt-2 w-[400px] -translate-x-1/2 transform grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-[#16213e] p-4 shadow-2xl shadow-black/50 animate-fade-up">
                {industries.map((industry) => (
                  <Link
                    key={industry.href}
                    href={industry.href}
                    className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-white/10 hover:bg-white/5"
                  >
                    <span className="text-2xl">{industry.emoji}</span>
                    <div>
                      <div className="font-medium text-white group-hover:text-[#e8a020]">
                        {industry.title}
                      </div>
                      <div className="text-xs text-white/50">{industry.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="text-sm text-white/70 transition-colors hover:text-[#e8a020]"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/sign-in" 
            className="hidden text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 sm:block"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[#e8a020] px-5 py-2 text-sm font-semibold text-[#1a1a2e] shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all hover:bg-[#f59e0b] hover:shadow-[0_0_50px_rgba(232,160,32,0.7)] hover:scale-105"
          >
            Book a Demo
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/20 p-2 text-white/70 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0a0f1e]/95 backdrop-blur-xl px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="px-3 text-xs font-medium text-white/40">Industries</p>
            {industries.map((industry) => (
              <Link
                key={industry.href}
                href={industry.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                <span>{industry.emoji}</span>
                {industry.title}
              </Link>
            ))}
          </div>
          
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block rounded-lg border-t border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  )
}
