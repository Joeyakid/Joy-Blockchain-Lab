'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '⛓️ Simulator', icon: '🔨' },
    { href: '/explorer', label: '🔍 Explorer', icon: '📊' },
    { href: '/dashboard', label: '📈 Dashboard', icon: '📊' },
    { href: '/learn', label: '📚 Learn', icon: '🎓' },
    { href: '/attack', label: '🎯 Attack Sim', icon: '⚔️' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <h1 className="text-xl font-bold">Blockchain Lab</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 flex-wrap">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-white text-blue-700 shadow-lg'
                    : 'text-blue-100 hover:text-white hover:bg-blue-600'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
