'use client'

import React, { useState } from 'react'
import { Block, Transaction } from '@/types/index'
import { generateSHA256Hash } from '@/lib/blockchain'

interface BlockEditorProps {
  blocks: Block[]
  onBlocksChange: (blocks: Block[]) => void
  blockValidityMap: { [key: number]: boolean }
}

export default function BlockEditor({ blocks, onBlocksChange, blockValidityMap }: BlockEditorProps) {
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [newAmount, setNewAmount] = useState<string>('')
  const [showWarning, setShowWarning] = useState(false)

  if (blocks.length === 0) {
    return null
  }

  const handleEditBlock = (blockIndex: number) => {
    setEditingBlockIndex(blockIndex)
    setEditingTransaction(null)
    setShowWarning(false)
  }

  const handleSelectTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setNewAmount(transaction.amount.toString())
  }

  const handleConfirmEdit = async () => {
    if (!editingTransaction || editingBlockIndex === null) return

    const updatedBlocks = [...blocks]
    const blockToUpdate = updatedBlocks[editingBlockIndex]

    // Update the transaction amount
    blockToUpdate.transactions = blockToUpdate.transactions.map((tx) =>
      tx.id === editingTransaction.id ? { ...tx, amount: parseFloat(newAmount) } : tx
    )

    // Recalculate hash of the edited block
    const blockDataToHash = JSON.stringify({
      index: blockToUpdate.index,
      timestamp: blockToUpdate.timestamp,
      transactions: blockToUpdate.transactions,
      previousHash: blockToUpdate.previousHash,
      nonce: blockToUpdate.nonce,
    })

    const newHash = await generateSHA256Hash(blockDataToHash)
    blockToUpdate.hash = newHash

    // Update blocks and validate chain
    onBlocksChange(updatedBlocks)
    setShowWarning(true)

    // Clear editing state
    setEditingBlockIndex(null)
    setEditingTransaction(null)
    setNewAmount('')

    setTimeout(() => setShowWarning(false), 5000)
  }

  const editingBlock = editingBlockIndex !== null ? blocks[editingBlockIndex] : null
  const isEditing = editingBlockIndex !== null

  return (
    <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3">🛠️ Block Editor (Educational)</h3>

      <p className="text-sm text-gray-600 mb-4">
        Edit transactions in blocks to see how blockchain detects tampering. Modified blocks will become invalid.
      </p>

      {!isEditing ? (
        // Block Selection View
        <div className="space-y-2">
          {blocks.map((block) => (
            <div
              key={block.index}
              className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                blockValidityMap[block.index]
                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                  : 'border-red-400 bg-red-50 hover:bg-red-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Block #{block.index}</p>
                  <p className="text-xs text-gray-600">{block.transactions.length} transaction(s)</p>
                </div>
                <button
                  onClick={() => handleEditBlock(block.index)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : editingBlock ? (
        // Block Editing View
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-lg border border-orange-300">
            <h4 className="font-bold text-gray-800 mb-3">Editing Block #{editingBlockIndex}</h4>

            {!editingTransaction ? (
              // Transaction List
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Select transaction to edit:</p>
                {editingBlock.transactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions in this block</p>
                ) : (
                  editingBlock.transactions.map((tx) => (
                    <button
                      key={tx.id}
                      onClick={() => handleSelectTransaction(tx)}
                      className="w-full p-2 text-left bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition text-sm"
                    >
                      <span className="font-medium text-gray-700">{tx.sender}</span> →{' '}
                      <span className="font-medium text-gray-700">{tx.receiver}</span>:{' '}
                      <span className="text-blue-600 font-semibold">{tx.amount}</span>
                    </button>
                  ))
                )}
              </div>
            ) : (
              // Transaction Amount Editor
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Edit transaction: <span className="font-bold">{editingTransaction.sender}</span> →{' '}
                  <span className="font-bold">{editingTransaction.receiver}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Amount (current: {editingTransaction.amount})
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmEdit}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition"
                  >
                    Apply Change
                  </button>
                  <button
                    onClick={() => setEditingTransaction(null)}
                    className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setEditingBlockIndex(null)}
            className="w-full py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded transition"
          >
            Close Editor
          </button>
        </div>
      ) : null}

      {showWarning && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg animate-pulse">
          <p className="text-sm font-bold text-red-700">
            ⚠️ Block #{editingBlockIndex} has been modified! The blockchain chain is now invalid.
          </p>
          <p className="text-xs text-red-600 mt-1">
            The block hash no longer matches the proof-of-work requirement. This demonstrates blockchain&apos;s tamper detection!
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
        <p className="font-semibold mb-1">💡 Why Editing Breaks the Chain:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>When you change a transaction amount, the block&apos;s hash changes</li>
          <li>The changed hash no longer meets the proof-of-work difficulty requirement</li>
          <li>The next block&apos;s previousHash no longer matches this block&apos;s new hash</li>
          <li>The entire chain from this point becomes invalid</li>
          <li>This is why blockchain is tamper-proof!</li>
        </ol>
      </div>
    </div>
  )
}
