'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '@/types/index'

interface BlockchainStatusBannerProps {
  blocks: Block[]
  blockValidityMap: { [key: number]: boolean }
  pendingTransactions: number
}

export default function BlockchainStatusBanner({
  blocks,
  blockValidityMap,
  pendingTransactions,
}: BlockchainStatusBannerProps) {
  const [validCount, setValidCount] = useState(0)

  useEffect(() => {
    const count = Math.max(0, Object.values(blockValidityMap).filter(Boolean).length)
    setValidCount(count)
  }, [blockValidityMap])

  if (blocks.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⛓️</span>
          <div>
            <h2 className="font-bold text-gray-800">Blockchain Status</h2>
            <p className="text-sm text-gray-600">
              Create some transactions and mine the first block to get started!
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isValid = validCount === blocks.length
  const invalidCount = blocks.length - validCount

  return (
    <div
      className={`p-4 border-l-4 rounded transition-all ${
        isValid
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
          : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400 animate-pulse'
      }`}
    >
      <div className="space-y-3">
        {/* Main Status Line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isValid ? '✅' : '⚠️'}</span>
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                {isValid ? 'Blockchain Valid' : 'Blockchain Compromised'}
              </h2>
              <p className="text-sm text-gray-600">
                {isValid
                  ? 'All blocks are valid and properly linked'
                  : `${invalidCount} block(s) have been tampered with or are invalid`}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-300">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Total Blocks</p>
            <p className="text-2xl font-bold text-gray-800">{blocks.length}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Valid Blocks</p>
            <p className={`text-2xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validCount}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Pending Transactions</p>
            <p className="text-2xl font-bold text-blue-600">{pendingTransactions}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-indigo-600">
              {blocks.reduce((sum, block) => sum + block.transactions.length, 0)}
            </p>
          </div>
        </div>

        {/* Detailed Status */}
        {!isValid && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg mt-2">
            <p className="text-sm font-bold text-red-800 mb-2">🚨 Invalid Blocks Detected:</p>
            <div className="flex flex-wrap gap-2">
              {blocks.map((block) => {
                if (!blockValidityMap[block.index]) {
                  return (
                    <span
                      key={block.index}
                      className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-semibold"
                    >
                      Block #{block.index}
                    </span>
                  )
                }
                return null
              })}
            </div>
            <p className="text-xs text-red-700 mt-2">
              This indicates tampering. In a real blockchain, invalid blocks would be rejected by the network.
            </p>
          </div>
        )}

        {/* Success Message */}
        {isValid && blocks.length > 0 && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-xs font-semibold text-green-800">
              ✓ Chain integrity verified. All {blocks.length} blocks are properly linked and valid.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
