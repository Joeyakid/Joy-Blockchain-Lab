'use client'

import React, { useState } from 'react'
import { Block } from '@/types/index'
import { validateBlock } from '@/lib/blockchain'

interface BlockTamperTesterProps {
  blocks: Block[]
}

export default function BlockTamperTester({ blocks }: BlockTamperTesterProps) {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    block: number
    originalValid: boolean
    tamperedValid: boolean
  } | null>(null)

  if (blocks.length === 0) {
    return null
  }

  const handleTamperTest = async () => {
    if (selectedBlockIndex === null) {
      alert('Please select a block to test')
      return
    }

    setIsTesting(true)
    try {
      const blockToTest = blocks[selectedBlockIndex]
      const previousHash = selectedBlockIndex === 0 ? '0' : blocks[selectedBlockIndex - 1].hash

      // Check original validity
      const originalValid = await validateBlock(blockToTest, previousHash, 2)

      // Create tampered copy
      const tamperedBlock = {
        ...blockToTest,
        transactions: blockToTest.transactions.length > 0
          ? [
              {
                ...blockToTest.transactions[0],
                amount: blockToTest.transactions[0].amount * 2,
              },
              ...blockToTest.transactions.slice(1),
            ]
          : [],
      }

      // Check tampered validity
      const tamperedValid = await validateBlock(tamperedBlock, previousHash, 2)

      setTestResult({
        block: selectedBlockIndex,
        originalValid,
        tamperedValid,
      })

      // Show the difference
      alert(
        `Block #${selectedBlockIndex} Tamper Test:\n\nOriginal: ${originalValid ? '✓ Valid' : '✗ Invalid'}\nTampered (doubled amount): ${tamperedValid ? '✓ Valid' : '✗ Invalid'}\n\nThis shows how blockchain detects tampering!`
      )
    } catch (error) {
      console.error('Error testing tamper:', error)
      alert('Error during tamper test')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3">🔬 Blockchain Security Tester</h3>

      <p className="text-sm text-gray-600 mb-4">
        Test how the blockchain detects tampering by attempting to modify transaction amounts.
      </p>
        <div className="text-xs text-gray-500 mt-2">
          Tampering with a block&apos;s data will break the chain&apos;s validity. Try to fix it by re-mining!
        </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Block to Test:</label>
          <select
            value={selectedBlockIndex ?? ''}
            onChange={(e) => setSelectedBlockIndex(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="">Choose a block...</option>
            {blocks.map((block) => (
              <option key={block.index} value={block.index}>
                Block #{block.index} ({block.transactions.length} transactions)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTamperTest}
          disabled={isTesting || selectedBlockIndex === null}
          className={`w-full py-3 px-4 font-semibold rounded-lg transition duration-200 ${
            isTesting || selectedBlockIndex === null
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 active:scale-95'
          }`}
        >
          {isTesting ? 'Testing...' : 'Test Tamper Detection'}
        </button>

        {testResult && (
          <div className="p-3 bg-white rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Test Result for Block #{testResult.block}:</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Original:</span>{' '}
                <span className={testResult.originalValid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {testResult.originalValid ? '✓ Valid' : '✗ Invalid'}
                </span>
              </p>
              <p>
                <span className="font-medium">After Tampering:</span>{' '}
                <span className={testResult.tamperedValid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {testResult.tamperedValid ? '✓ Valid' : '✗ Invalid'}
                </span>
              </p>
              <p className="text-xs text-gray-600 pt-2">
                ✓ This demonstrates blockchain&apos;s tamper detection capability!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
