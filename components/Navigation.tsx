'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { href: '/', label: '⛓️ Simulator', icon: '🔨' },
    { href: '/explorer', label: '🔍 Explorer', icon: '📊' },
    { href: '/dashboard', label: '📈 Dashboard', icon: '📊' },
    { href: '/learn', label: '📚 Learn', icon: '🎓' },
    { href: '/attack', label: '🎯 Attack Sim', icon: '⚔️' },
  ]

  const isActive = (href: string) => pathname === href

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧬</span>
              <h1 className="text-xl font-bold hidden sm:block">Joy&apos;s Blockchain Lab</h1>
              <h1 className="text-lg font-bold sm:hidden">Joy&apos;s Lab</h1>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
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

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-blue-600 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <span className="w-6 h-0.5 bg-white block"></span>
              <span className="w-6 h-0.5 bg-white block"></span>
              <span className="w-6 h-0.5 bg-white block"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden z-30 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-blue-700 to-indigo-900 text-white shadow-2xl md:hidden z-40 transform transition-transform duration-300 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Close Button */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 text-white text-2xl hover:bg-blue-600 rounded-lg p-1 transition-colors"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Sidebar Navigation Links */}
        <div className="flex flex-col gap-2 p-6 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 ${
                isActive(item.href)
                  ? 'bg-white text-blue-700 shadow-lg'
                  : 'text-blue-100 hover:text-white hover:bg-blue-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
