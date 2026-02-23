'use client'

import React from 'react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            ⛓️ Joy&apos;s Interactive Blockchain Simulator
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg">
            Learn blockchain technology with mining, transactions, and validation
          </p>
        </div>
      </div>
    </header>
  )
}
