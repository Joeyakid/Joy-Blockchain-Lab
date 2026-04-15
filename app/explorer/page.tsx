'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '@/types/index'

export default function Explorer() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  // const [showRawJSON, setShowRawJSON] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('blockchain')
      if (saved) {
        const parsed: Block[] = JSON.parse(saved)
        setBlocks(parsed)
        if (parsed.length) setSelectedBlock(parsed[0])
      }
    } catch (err) {
      console.error('load blockchain', err)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 Blockchain Explorer</h1>
          <p className="text-gray-600">View detailed information about each block, including transactions, hashes, and chain linking</p>
        </div>

        {blocks.length === 0 ? (
          <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-xl">No blocks in blockchain yet. Go to the Simulator to mine some blocks!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Blocks ({blocks.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blocks.map((block) => (
                    <button
                      key={block.index}
                      onClick={() => setSelectedBlock(block)}
                      className={`w-full p-3 rounded-lg text-left transition ${selectedBlock?.index === block.index ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="font-semibold">Block #{block.index}</div>
                      <div className="text-xs opacity-75">{block.transactions.length} txs</div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="lg:col-span-2 space-y-4">
              {selectedBlock && (
                <section className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Block #{selectedBlock.index}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Timestamp</p>
                      <p className="text-sm text-gray-800">{new Date(selectedBlock.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Nonce</p>
                      <p className="text-sm font-mono text-indigo-600 font-bold">{selectedBlock.nonce.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border-2 border-purple-200 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">⛓️ Chain Linking</h3>
                    <p className="text-xs text-gray-600">Previous Hash</p>
                    <code className="block bg-white p-2 rounded border border-purple-300 text-xs font-mono break-all overflow-auto max-h-20">{selectedBlock.previousHash}</code>
                    <p className="text-xs text-gray-600 mt-3">This Block&apos;s Hash</p>
                    <code className="block bg-white p-2 rounded border border-purple-300 text-xs font-mono break-all overflow-auto max-h-20">{selectedBlock.hash}</code>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-bold mb-3">💰 Transactions ({selectedBlock.transactions.length})</h3>
                    {selectedBlock.transactions.length === 0 ? (
                      <p className="text-gray-500">No transactions in this block</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedBlock.transactions.map((tx) => (
                          <div key={tx.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">From</p>
                                <p className="text-gray-800 truncate">{tx.sender}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">To</p>
                                <p className="text-gray-800 truncate">{tx.receiver}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">Amount</p>
                                <p className="text-blue-600 font-bold">{tx.amount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">ID</p>
                                <p className="font-mono text-xs truncate">{tx.id}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
                    <button onClick={() => setShowRawJSON(!showRawJSON)} className="w-full px-6 py-4 bg-gray-800 text-white font-semibold hover:bg-gray-900 transition flex items-center justify-between">
                      {showRawJSON ? '▼' : '▶'} Raw JSON View
                    </button>
                    {showRawJSON && (
                      <div className="p-6 border-t border-gray-200">
                        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs font-mono break-words whitespace-pre-wrap">{JSON.stringify(selectedBlock, null, 2)}</pre>
                        <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedBlock, null, 2)); alert('Block JSON copied to clipboard!') }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm">Copy to Clipboard</button>
                      </div>
                    )}
                  </div> */}
                </section>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
 
