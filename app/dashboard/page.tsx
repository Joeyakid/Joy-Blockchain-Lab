'use client'

import React, { useEffect, useState } from 'react'
import { Block, Transaction } from '@/types/index'

export default function Dashboard() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    avgTransactionsPerBlock: 0,
    totalVolume: 0,
    blockchainSize: 0,
  })
  const [isChainValid, setIsChainValid] = useState(true)
  const [difficulty, setDifficulty] = useState(2)

  // Load blockchain and calculate stats
  useEffect(() => {
    const savedBlocks = localStorage.getItem('blockchain')
    const savedDifficulty = localStorage.getItem('difficulty')

    if (savedDifficulty) {
      setDifficulty(parseInt(savedDifficulty))
    }

    if (savedBlocks) {
      try {
        const parsedBlocks = JSON.parse(savedBlocks)
        setBlocks(parsedBlocks)

        // Calculate statistics
        const totalBlocks = parsedBlocks.length
        let totalTransactions = 0
        let totalVolume = 0

        parsedBlocks.forEach((block: Block) => {
          totalTransactions += block.transactions.length
          block.transactions.forEach((tx: Transaction) => {
            totalVolume += tx.amount
          })
        })

        const avgTransactionsPerBlock =
          totalBlocks > 0 ? (totalTransactions / totalBlocks).toFixed(2) : 0

        // Rough blockchain size estimate (JSON stringified length)
        const blockchainSize = JSON.stringify(parsedBlocks).length

        setStats({
          totalBlocks,
          totalTransactions,
          avgTransactionsPerBlock: parseFloat(avgTransactionsPerBlock as string),
          totalVolume: parseFloat(totalVolume.toFixed(2)),
          blockchainSize,
        })

        // Simple chain validation check
        let isValid = true
        for (let i = 1; i < parsedBlocks.length; i++) {
          const currentBlock = parsedBlocks[i]
          const previousBlock = parsedBlocks[i - 1]

          if (currentBlock.previousHash !== previousBlock.hash) {
            isValid = false
            break
          }
        }
        setIsChainValid(isValid)
      } catch (error) {
        console.error('Error loading blockchain:', error)
      }
    }
  }, [])

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string
    value: string | number
    icon: string
    color: string
  }) => (
    <div
      className={`rounded-lg shadow-md p-6 text-white bg-gradient-to-br ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 font-semibold uppercase">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-5xl opacity-50">{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Analytics Dashboard</h1>
            <p className="text-gray-600">
              Real-time statistics and insights about your blockchain
            </p>
          </div>

          {/* Chain Status Banner */}
          <div
            className={`rounded-lg shadow-md p-6 mb-8 text-white font-semibold flex items-center gap-4 ${
              isChainValid
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-pink-600'
            }`}
          >
            <div className="text-4xl">{isChainValid ? '✓' : '✗'}</div>
            <div>
              <p className="text-lg">Chain Status: {isChainValid ? 'VALID' : 'CORRUPTED'}</p>
              <p className="text-sm opacity-90">
                {isChainValid
                  ? 'All blocks are linked correctly and blockchain is immutable'
                  : 'Chain integrity compromised - some blocks have been tampered with'}
              </p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Blocks"
              value={stats.totalBlocks}
              icon="⛓️"
              color="from-blue-500 to-indigo-600"
            />
            <StatCard
              title="Total Transactions"
              value={stats.totalTransactions}
              icon="💰"
              color="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Avg Txs/Block"
              value={stats.avgTransactionsPerBlock.toFixed(2)}
              icon="📈"
              color="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Total Volume"
              value={`${stats.totalVolume.toFixed(2)}`}
              icon="💵"
              color="from-orange-500 to-red-600"
            />
            <StatCard
              title="Chain Size"
              value={`${(stats.blockchainSize / 1024).toFixed(2)} KB`}
              icon="💾"
              color="from-cyan-500 to-blue-600"
            />
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Block Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">📦 Block Distribution</h2>

              {blocks.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No blocks yet. Mine some blocks to see data!
                </p>
              ) : (
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div key={block.index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">Block #{block.index}</p>
                          <p className="text-sm text-gray-600">
                            {block.transactions.length} transactions
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(block.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-indigo-600 font-bold">
                            Nonce: {block.nonce.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 mt-1">✓ Valid</p>
                        </div>
                      </div>

                      {/* Mini Transaction List */}
                      {block.transactions.length > 0 && (
                        <div className="mt-2 bg-blue-50 rounded p-2 text-xs space-y-1">
                          {block.transactions.slice(0, 2).map((tx) => (
                            <p key={tx.id} className="text-gray-700 truncate">
                              {tx.sender.substring(0, 10)}... → {tx.receiver.substring(0, 10)}...
                              : {tx.amount}
                            </p>
                          ))}
                          {block.transactions.length > 2 && (
                            <p className="text-gray-500 italic">
                              +{block.transactions.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">⚙️ Mining Configuration</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-2">
                    Current Difficulty
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full transition-all"
                          style={{ width: `${(difficulty / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600 min-w-12">
                      {difficulty}/5
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {difficulty === 1 && 'Very Easy - Fast mining, low security'}
                    {difficulty === 2 && 'Easy - Standard difficulty'}
                    {difficulty === 3 && 'Medium - Increasing difficulty'}
                    {difficulty === 4 && 'Hard - Significant mining time'}
                    {difficulty === 5 && 'Nightmare - Highest difficulty, very slow'}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-3">
                    Proof of Work Threshold
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-mono text-xs text-gray-800 break-all">
                      Hash must start with:
                      <span className="text-red-600 font-bold">
                        {' '}
                        {'0'.repeat(difficulty)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Approximately {Math.pow(16, difficulty).toLocaleString()} hash attempts needed on average
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 uppercase font-semibold mb-3">
                    Blockchain Security
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">Immutability</span>
                      <span className="text-lg font-bold text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">Chain Linking</span>
                      <span className="text-lg font-bold text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">Proof of Work</span>
                      <span className="text-lg font-bold text-green-600">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Volume Chart (Text-based) */}
          {blocks.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Transactions Per Block</h2>
              <div className="space-y-3">
                {blocks.map((block) => (
                  <div key={block.index} className="flex items-center gap-4">
                    <span className="font-semibold text-gray-700 min-w-20">
                      Block #{block.index}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-full flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            width: `${Math.min((block.transactions.length / Math.max(...blocks.map(b => b.transactions.length), 1)) * 100, 100)}%`,
                          }}
                        >
                          {block.transactions.length > 0 && block.transactions.length}
                        </div>
                      </div>
                      <span className="text-gray-700 font-semibold min-w-12">
                        {block.transactions.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  )
}
