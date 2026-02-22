'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '@/types/index'
import { generateSHA256Hash } from '@/lib/blockchain'

export default function AttackSimulation() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [affectedBlocks, setAffectedBlocks] = useState<number[]>([])
  const [showAttackExplanation, setShowAttackExplanation] = useState(true)

  // Load blockchain from localStorage
  useEffect(() => {
    const savedBlocks = localStorage.getItem('blockchain')
    if (savedBlocks) {
      try {
        const parsedBlocks = JSON.parse(savedBlocks)
        setBlocks(parsedBlocks)
        if (parsedBlocks.length > 0) {
          setSelectedBlock(parsedBlocks[Math.floor(parsedBlocks.length / 2)])
        }
      } catch (error) {
        console.error('Error loading blockchain:', error)
      }
    }
  }, [])

  // Calculate affected blocks (cascade effect)
  const calculateAffectedBlocks = (blockIndex: number) => {
    const affected: number[] = []
    for (let i = blockIndex + 1; i < blocks.length; i++) {
      affected.push(i)
    }
    return affected
  }

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block)
    setEditingBlock(block)
    setAffectedBlocks(calculateAffectedBlocks(block.index))
  }

  const updateEditingBlock = (field: string, value: any) => {
    if (!editingBlock) return

    let updatedBlock = { ...editingBlock }

    if (field === 'amount' && selectedBlock && selectedBlock.transactions.length > 0) {
      updatedBlock.transactions[0] = {
        ...editingBlock.transactions[0],
        amount: value,
      }
    } else if (field === 'sender') {
      updatedBlock.transactions[0] = {
        ...editingBlock.transactions[0],
        sender: value,
      }
    }

    setEditingBlock(updatedBlock)
  }

  const recomputeHash = async () => {
    if (!editingBlock) return

    const hashInput = JSON.stringify({
      index: editingBlock.index,
      timestamp: editingBlock.timestamp,
      previousHash: editingBlock.previousHash,
      transactions: editingBlock.transactions,
      nonce: editingBlock.nonce,
    })

    const hash = await generateSHA256Hash(hashInput)
    const updatedBlock = {
      ...editingBlock,
      hash: hash,
    }
    setEditingBlock(updatedBlock)
  }

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">⚔️ Attack Simulation Laboratory</h1>
            <p className="text-gray-600">
              Learn about blockchain security by attempting attacks and seeing how the chain breaks
            </p>
          </div>

          {blocks.length === 0 ? (
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-xl">
                No blocks in blockchain yet. Go to the Simulator to mine some blocks, then come back to learn about attacks!
              </p>
            </div>
          ) : (
            <>
              {/* Educational Banner */}
              {showAttackExplanation && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-md p-6 mb-8 border-l-4 border-orange-500 relative">
                  <button
                    onClick={() => setShowAttackExplanation(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                  <h2 className="text-lg font-bold text-orange-900 mb-3">🎓 How This Simulation Works</h2>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>
                      <strong>1. Select a Block:</strong> Choose any block from your blockchain
                    </li>
                    <li>
                      <strong>2. Tamper with Data:</strong> Modify transaction amounts, sender names, or other fields
                    </li>
                    <li>
                      <strong>3. Recompute Hash:</strong> The system will recalculate the hash based on your changes
                    </li>
                    <li>
                      <strong>4. See the Cascading Failure:</strong> Watch as the chain breaks because all subsequent blocks will have invalid previousHash references
                    </li>
                    <li>
                      <strong>⚠️ Why This Matters:</strong> This demonstrates immutability - you CANNOT secretly change old transactions without breaking the entire chain!
                    </li>
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Block Selection */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20 bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Select Target Block</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {blocks.map((block) => (
                        <button
                          key={block.index}
                          onClick={() => handleBlockSelect(block)}
                          className={`w-full p-3 rounded-lg text-left transition ${
                            selectedBlock?.index === block.index
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <div className="font-semibold">Block #{block.index}</div>
                          <div className="text-xs opacity-75">{block.transactions.length} txs</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attack Interface */}
                {editingBlock && (
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {/* Block Editor */}
                      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-300">
                        <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Tampering Zone</h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-4 border-b">
                            <span className="font-semibold text-gray-700">Block Index</span>
                            <span className="font-mono text-gray-900">{editingBlock.index}</span>
                          </div>

                          {editingBlock.transactions.length > 0 && (
                            <>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  🚨 Edit Sender (First Transaction)
                                </label>
                                <input
                                  type="text"
                                  value={editingBlock.transactions[0].sender}
                                  onChange={(e) => updateEditingBlock('sender', e.target.value)}
                                  className="w-full px-3 py-2 border border-red-300 rounded-lg font-mono text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  🚨 Edit Amount (First Transaction)
                                </label>
                                <input
                                  type="number"
                                  value={editingBlock.transactions[0].amount}
                                  onChange={(e) => updateEditingBlock('amount', parseFloat(e.target.value))}
                                  className="w-full px-3 py-2 border border-red-300 rounded-lg font-mono text-sm"
                                />
                              </div>
                            </>
                          )}

                          <button
                            onClick={recomputeHash}
                            className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold hover:from-red-700 hover:to-pink-700 transition"
                          >
                            🔄 Recompute Block Hash
                          </button>
                        </div>
                      </div>

                      {/* What Happened Section */}
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg shadow-md p-6 border-2 border-red-300">
                        <h3 className="text-lg font-bold text-red-600 mb-4">🚨 What Happened?</h3>

                        <div className="space-y-4">
                          {/* Block Status */}
                          <div className="bg-white p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              This Block's Hash Changed:
                            </p>
                            <code className="block bg-gray-900 text-red-400 p-3 rounded text-xs font-mono break-all overflow-auto max-h-24 mb-3">
                              {editingBlock.hash}
                            </code>
                            <p className="text-xs text-gray-600">
                              ⚠️ <strong>Hash Mismatch!</strong> The hash no longer matches what&apos;s recorded in the blockchain
                            </p>
                          </div>

                          {/* Cascade Effect */}
                          {affectedBlocks.length > 0 && (
                            <div className="bg-white p-4 rounded-lg">
                              <p className="text-sm font-semibold text-gray-700 mb-3">
                                Cascade Effect: {affectedBlocks.length} block(s) now broken
                              </p>
                              <div className="space-y-2">
                                {affectedBlocks.map((blockIdx) => (
                                  <div key={blockIdx} className="p-2 bg-red-100 border-l-4 border-red-600 rounded flex items-center gap-2">
                                    <span className="text-red-600 font-bold text-lg">✗</span>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800">
                                        Block #{blockIdx} is Now Invalid
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        previousHash doesn&apos;t match Block #{blockIdx - 1}&apos;s new hash
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Insight */}
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                            <p className="text-sm font-bold text-blue-900 mb-2">💡 Key Insight</p>
                            <p className="text-sm text-gray-700">
                              To hide this tampering, someone would need to recalculate the hash of every subsequent block. In a real blockchain with Proof of Work, this becomes exponentially harder because they&apos;d need to redo all the mining work.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Security Lesson */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-l-4 border-green-600">
                        <h3 className="text-lg font-bold text-green-800 mb-3">🔒 Security Implications</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li>
                            <strong>✓ Immutability:</strong> Changing old blocks is immediately detected
                          </li>
                          <li>
                            <strong>✓ No Silent Attacks:</strong> You can&apos;t secretly modify history
                          </li>
                          <li>
                            <strong>✓ Tamper-Evidence:</strong> The chain visibly breaks, showing the attack
                          </li>
                          <li>
                            <strong>✓ No Silent Attacks:</strong> You can't secretly modify history
                          </li>
                          <li>
                            <strong>✓ Distributed Defense:</strong> In a real network, thousands of nodes would reject this broken chain
                          </li>
                          <li>
                            <strong>✓ PoW Protection:</strong> Proof of Work makes fixing the chain exponentially harder
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chain Visualization */}
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">⛓️ Chain Integrity Status</h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-2 pb-4">
                    {blocks.map((block, idx) => {
                      const isAffected = affectedBlocks.includes(block.index)
                      const isTarget = selectedBlock?.index === block.index
                      return (
                        <div key={block.index} className="flex items-center">
                          <div
                            className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                              isTarget
                                ? 'bg-red-500 text-white shadow-lg'
                                : isAffected
                                  ? 'bg-orange-400 text-white'
                                  : 'bg-green-500 text-white'
                            }`}
                          >
                            <div className="text-center">
                              <p>#{block.index}</p>
                              <p className="text-xs opacity-75">{isTarget ? '🎯' : isAffected ? '⚠️' : '✓'}</p>
                            </div>
                          </div>
                          {idx < blocks.length - 1 && (
                            <div
                              className={`w-8 h-1 ${
                                isAffected || (selectedBlock?.index === block.index)
                                  ? 'bg-red-400'
                                  : 'bg-green-400'
                              }`}
                            ></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex gap-6 mt-4 flex-wrap text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Valid Block</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span>Affected by Attack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Target Block</span>
                  </div>
                </div>
              </div>

              {/* Attack Types Educational */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">⚔️ 51% Attack</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    An attacker controls 51% of the mining power and can create a longer chain by re-mining blocks faster than the honest network.
                  </p>
                  <div className="text-xs bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-bold text-red-800 mb-1">Why It Fails Here:</p>
                    <p className="text-gray-600">
                      {"Learn about blockchain security by attempting attacks and seeing how the chain breaks"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">👻 Double Spending</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Attacker sends coins, waits for block confirmation, then tampers with earlier blocks to move the coins elsewhere.
                  </p>
                  <div className="text-xs bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-bold text-red-800 mb-1">Why It Fails Here:</p>
                    <p className="text-gray-700">
                      Tampering breaks the chain immediately. In a distributed network, every node would reject the broken chain.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Eclipse Attack</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Attacker isolates a node from the network then feeds it false blockchain data.
                  </p>
                  <div className="text-xs bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="font-bold text-red-800 mb-1">Why It Fails Here:</p>
                    <p className="text-gray-700">
                      Our simulator has no network, but real blockchains prevent this through peer diversity and cryptographic validation.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🔐 Cryptographic Strength</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    The security ultimately depends on the strength of SHA-256 and the difficulty of Proof of Work.
                  </p>
                  <div className="text-xs bg-green-50 p-3 rounded border-l-4 border-green-500">
                    <p className="font-bold text-green-800 mb-1">Why It Works:</p>
                    <p className="text-gray-700">
                      SHA-256 is mathematically proven to be collision-resistant, making it virtually impossible to forge blocks.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  )
}
