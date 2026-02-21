'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import TransactionForm from '@/components/TransactionForm'
import PendingTransactions from '@/components/PendingTransactions'
import BlockchainDisplay from '@/components/BlockchainDisplay'
import BlockchainValidator from '@/components/BlockchainValidator'
import BlockTamperTester from '@/components/BlockTamperTester'
import BlockEditor from '@/components/BlockEditor'
import DifficultyControl from '@/components/DifficultyControl'
import BlockchainStatusBanner from '@/components/BlockchainStatusBanner'
import { Block, Transaction } from '@/types/index'
import { createNewBlock, validateBlock } from '@/lib/blockchain'

const DEFAULT_DIFFICULTY = 2

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [isMining, setIsMining] = useState(false)
  const [blockValidityMap, setBlockValidityMap] = useState<{ [key: number]: boolean }>({})
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY)

  // Load blockchain from localStorage on mount
  useEffect(() => {
    const loadBlockchain = async () => {
      const savedBlocks = localStorage.getItem('blockchain')
      if (savedBlocks) {
        try {
          const parsedBlocks = JSON.parse(savedBlocks)
          setBlocks(parsedBlocks)

          // Verify blockchain validity
          const validityMap: { [key: number]: boolean } = {}
          if (parsedBlocks.length > 0) {
            const genesisValid = await validateBlock(parsedBlocks[0], '0', DEFAULT_DIFFICULTY)
            validityMap[0] = genesisValid

            for (let i = 1; i < parsedBlocks.length; i++) {
              const isValid = await validateBlock(
                parsedBlocks[i],
                parsedBlocks[i - 1].hash,
                DEFAULT_DIFFICULTY
              )
              validityMap[i] = isValid
            }
          }
          setBlockValidityMap(validityMap)
        } catch (error) {
          console.error('Error loading blockchain:', error)
        }
      }

      const savedTransactions = localStorage.getItem('pendingTransactions')
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions)
          setPendingTransactions(parsedTransactions)
        } catch (error) {
          console.error('Error loading pending transactions:', error)
        }
      }
    }

    loadBlockchain()
  }, [])

  // Save blockchain to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('blockchain', JSON.stringify(blocks))
  }, [blocks])

  // Validate blockchain whenever blocks change
  useEffect(() => {
    const validateBlockchain = async () => {
      const validityMap: { [key: number]: boolean } = {}

      if (blocks.length > 0) {
        const genesisValid = await validateBlock(blocks[0], '0', difficulty)
        validityMap[0] = genesisValid

        for (let i = 1; i < blocks.length; i++) {
          const isValid = await validateBlock(blocks[i], blocks[i - 1].hash, difficulty)
          validityMap[i] = isValid
        }
      }

      setBlockValidityMap(validityMap)
    }

    validateBlockchain()
  }, [blocks, difficulty])

  // Save pending transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions))
  }, [pendingTransactions])

  const handleAddTransaction = (transaction: Transaction) => {
    setPendingTransactions((prev) => [...prev, transaction])
  }

  const handleRemoveTransaction = (id: string) => {
    setPendingTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const handleMineBlock = async () => {
    if (isMining) return

    setIsMining(true)

    try {
      const previousHash = blocks.length === 0 ? '0' : blocks[blocks.length - 1].hash
      const index = blocks.length

      // Create and mine the block with current difficulty
      const newBlock = await createNewBlock(
        pendingTransactions,
        previousHash,
        index,
        difficulty
      )

      // Update blocks
      const updatedBlocks = [...blocks, newBlock]
      setBlocks(updatedBlocks)

      // Verify validity
      const isValid = await validateBlock(newBlock, previousHash, difficulty)
      setBlockValidityMap((prev) => ({
        ...prev,
        [index]: isValid,
      }))

      // Clear pending transactions
      setPendingTransactions([])
    } catch (error) {
      console.error('Error mining block:', error)
      alert('Error mining block. Please try again.')
    } finally {
      setIsMining(false)
    }
  }

  const handleResetBlockchain = () => {
    if (confirm('Are you sure you want to reset the blockchain? This cannot be undone.')) {
      setBlocks([])
      setPendingTransactions([])
      setBlockValidityMap({})
      localStorage.removeItem('blockchain')
      localStorage.removeItem('pendingTransactions')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Blockchain Status Banner */}
        <div className="mb-8">
          <BlockchainStatusBanner
            blocks={blocks}
            blockValidityMap={blockValidityMap}
            pendingTransactions={pendingTransactions.length}
          />
        </div>

        {/* Difficulty Control */}
        <div className="mb-8">
          <DifficultyControl
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            isMining={isMining}
          />
        </div>
        {/* Top Section: Transaction Form and Pending Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
          <div className="lg:col-span-2">
            <PendingTransactions
              transactions={pendingTransactions}
              onRemoveTransaction={handleRemoveTransaction}
            />
          </div>
        </div>

        {/* Mine Block Button and Controls */}
        <div className="mb-8 space-y-4">
          <button
            onClick={handleMineBlock}
            disabled={isMining || pendingTransactions.length === 0}
            className={`w-full py-6 px-8 text-2xl font-bold rounded-lg transition duration-300 transform ${
              isMining || pendingTransactions.length === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isMining ? '⛏️ Mining Block...' : '⛏️ Mine Block'}
          </button>

          <button
            onClick={handleResetBlockchain}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Reset Blockchain
          </button>
        </div>

        {/* Blockchain Display */}
        <BlockchainDisplay blocks={blocks} blockValidityMap={blockValidityMap} />

        {/* Blockchain Validator */}
        <BlockchainValidator blocks={blocks} />

        {/* Block Tamper Tester */}
        <BlockTamperTester blocks={blocks} />

        {/* Block Editor */}
        <BlockEditor blocks={blocks} onBlocksChange={setBlocks} blockValidityMap={blockValidityMap} />
      </main>
    </div>
  )
}
