'use client'

import React from 'react'
import { Block } from '@/types/index'

interface BlockVisualizationProps {
  block: Block
  isValid: boolean
}

export default function BlockVisualization({ block, isValid }: BlockVisualizationProps) {
  return (
    <div
      className={`p-6 rounded-lg shadow-md border-4 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in ${
        isValid
          ? 'border-green-500 bg-green-50'
          : 'border-red-500 bg-red-50 animate-pulse-red'
      }`}
    >
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Block #{block.index}</h3>
          <p className="text-sm text-gray-500">
            {new Date(block.timestamp).toLocaleString()}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-white font-semibold ${
            isValid ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isValid ? '✓ Valid' : '✗ Invalid'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Nonce Display - Prominent */}
        <div className="p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg border-2 border-indigo-300">
          <div className="text-center">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Proof-of-Work</p>
            <p className="text-4xl font-bold text-indigo-600 font-mono">{block.nonce.toLocaleString()}</p>
            <p className="text-xs text-indigo-600 mt-1">Nonce (Hash Attempts)</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <label className="font-semibold text-gray-700">Transactions:</label>
          <p className="text-gray-600">{block.transactions.length} transaction(s)</p>
          {block.transactions.length > 0 && (
            <div className="mt-2 space-y-1 bg-gray-100 p-3 rounded">
              {block.transactions.map((tx) => (
                <div key={tx.id} className="text-xs">
                  <span className="font-medium">{tx.sender}</span> → <span className="font-medium">{tx.receiver}</span>:{' '}
                  <span className="text-blue-600 font-semibold">{tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hashing Details */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="font-semibold text-gray-700 text-sm">Previous Hash (Link):</label>
            <p className="text-gray-600 font-mono break-all text-xs bg-gray-100 p-2 rounded mt-1">
              {block.previousHash}
            </p>
          </div>

          <div>
            <label className="font-semibold text-gray-700 text-sm">Block Hash (This Block):</label>
            <p className="text-gray-600 font-mono break-all text-xs bg-gray-100 p-2 rounded mt-1">
              {block.hash}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
