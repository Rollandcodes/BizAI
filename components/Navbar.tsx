'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const industries = [
  { name: 'Medical Tourism', href: '/car-rentals' },
  { name: 'Real Estate & Residency', href: '/barbershops' },
  { name: 'Clinics', href: '/clinics' },
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Hotels', href: '/hotels' },
  { name: 'Student Housing', href: '/student-housing' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false)
  const industriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (industriesRef.current && !industriesRef.current.contains(event.target as Node)) {
        setIsIndustriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><span className="text-2xl">🤖</span><span className="text-xl font-bold text-gray-900">CypAI</span></Link>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">How It Works</a>
            <div className="relative" ref={industriesRef}>
              <button onClick={() => setIsIndustriesOpen(!isIndustriesOpen)} className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Industries<svg className={`h-4 w-4 transition-transform ${isIndustriesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
              {isIndustriesOpen && (<div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">{industries.map((industry) => (<Link key={industry.href} href={industry.href} onClick={() => setIsIndustriesOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#e8a020]">{industry.name}</Link>))}</div>)}
            </div>
            <a href="#pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Pricing</a>
            <Link href="/demo" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Demo</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Docs</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e8a020]">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:block">Log In</Link>
            <Link href="/sign-up" className="rounded-full bg-[#e8a020] px-5 py-2 text-sm font-semibold text-[#1a1a2e] shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all hover:bg-[#f59e0b] hover:shadow-[0_0_50px_rgba(232,160,32,0.7)] hover:scale-105">Book a Demo</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}