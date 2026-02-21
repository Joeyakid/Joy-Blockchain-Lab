'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '@/types/index'
import { validateChain, getBlockchainStats } from '@/lib/blockchain'

interface BlockchainValidatorProps {
  blocks: Block[]
}

export default function BlockchainValidator({ blocks }: BlockchainValidatorProps) {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    invalidBlocks: number[]
  } | null>(null)
  const [stats, setStats] = useState<{
    totalBlocks: number
    totalTransactions: number
    difficulty: number
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    const validateBlockchain = async () => {
      if (blocks.length === 0) {
        setValidationResult(null)
        setStats(null)
        return
      }

      setIsValidating(true)
      try {
        const result = await validateChain(blocks, 2)
        setValidationResult(result)
        setStats(getBlockchainStats(blocks))
      } catch (error) {
        console.error('Error validating blockchain:', error)
      } finally {
        setIsValidating(false)
      }
    }

    validateBlockchain()
  }, [blocks])

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">Chain Validation</h3>
        {isValidating && <span className="text-sm text-gray-600">Validating...</span>}
      </div>

      {validationResult && stats && (
        <div className="space-y-3">
          {/* Overall Status */}
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${
                validationResult.isValid ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className={`font-semibold ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
              {validationResult.isValid ? '✓ Chain is Valid' : '✗ Chain is Invalid'}
            </span>
          </div>

          {/* Invalid Blocks Alert */}
          {validationResult.invalidBlocks.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-700 mb-1">Tampered Blocks Detected:</p>
              <p className="text-sm text-red-600">
                Blocks {validationResult.invalidBlocks.join(', ')} have been modified!
              </p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-600">Total Blocks</p>
              <p className="text-lg font-bold text-blue-600">{stats.totalBlocks}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Transactions</p>
              <p className="text-lg font-bold text-blue-600">{stats.totalTransactions}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Difficulty</p>
              <p className="text-lg font-bold text-blue-600">{stats.difficulty}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Valid Blocks</p>
              <p className="text-lg font-bold text-green-600">
                {stats.totalBlocks - validationResult.invalidBlocks.length}/{stats.totalBlocks}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
