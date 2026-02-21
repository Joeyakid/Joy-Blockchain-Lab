'use client'

import React, { useState } from 'react'

type Lesson = {
  id: number
  title: string
  summary: string
  content: string
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Blockchain Basics',
    summary: 'What a block is, chain linking, and immutability.',
    content: `
      <p>The blockchain is an append-only chain of blocks. Each block contains a set of transactions, a timestamp, a nonce, and a hash. Blocks are linked together using the previous block&apos;s hash so that tampering with an older block invalidates later blocks.</p>
    `,
  },
  {
    id: 2,
    title: 'Mining & Proof-of-Work',
    summary: 'How mining finds a nonce to satisfy difficulty.',
    content: `
      <p>Miners repeatedly hash a block's contents with different nonces until the resulting hash meets the difficulty target (e.g. starts with a number of zeros). This work makes creating blocks expensive and prevents trivial tampering.</p>
    `,
  },
  {
    id: 3,
    title: 'Attacks & Tampering',
    summary: 'Common attacks and how the chain resists them.',
    content: `
      <p>Changing a block requires re-mining not just that block but every subsequent block. In a distributed network this requires controlling a majority of mining power to present an alternate chain.</p>
    `,
  },
]

export default function Learn() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Learn: Blockchain Fundamentals</h1>
        <p className="text-gray-600 mb-6">Short interactive lessons to explore key concepts used by the simulator.</p>

        {/* Practical Guide Section */}
        <section className="mb-8 bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">How to Use Joy Blockchain Lab</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            <li>
              <b>Simulator:</b> Go to the Simulator page ("Home"). Here you can:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Create and submit new transactions (fill sender, receiver, amount, then click "Add Transaction").</li>
                <li>Mine a new block by clicking "Mine Block". This will bundle pending transactions, find a valid nonce, and add a new block to the chain.</li>
                <li>Adjust mining <b>difficulty</b> to see how it affects mining speed and block hashes.</li>
                <li>See the blockchain update in real time as you mine and add transactions.</li>
              </ul>
            </li>
            <li>
              <b>Explorer:</b> Visit the Explorer page to:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Browse all blocks in the chain. Click a block to view its details, transactions, and hashes.</li>
                <li>See how each block links to the previous one via the <b>previousHash</b> field.</li>
                <li>Toggle "Raw JSON" to inspect the full data structure of any block.</li>
              </ul>
            </li>
            <li>
              <b>Dashboard:</b> Check the Dashboard for:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Statistics about your blockchain: number of blocks, total transactions, current difficulty, and more.</li>
                <li>Monitor how your actions (mining, adding transactions) affect the chain's state.</li>
              </ul>
            </li>
            <li>
              <b>Attack:</b> Use the Attack page to:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Experiment with tampering: try to edit a block&apos;s data and see how it breaks the chain&apos;s validity.</li>
                <li>Learn why changing a block&apos;s data requires re-mining all subsequent blocks to restore validity.</li>
              </ul>
            </li>
            <li>
              <b>Learn:</b> Return to this page for interactive lessons and explanations of blockchain concepts.</li>
          </ol>
          <p className="mt-4 text-blue-700 font-semibold">Tip: All blockchain data is stored in your browser (localStorage), so you can refresh or revisit without losing your progress!</p>
        </section>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <article key={lesson.id} className="bg-white rounded-lg shadow">
              <button
                onClick={() => setOpenId(openId === lesson.id ? null : lesson.id)}
                className="w-full p-4 flex items-start justify-between"
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{lesson.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{lesson.summary}</p>
                </div>
                <div className="text-2xl text-gray-500 select-none">{openId === lesson.id ? '−' : '+'}</div>
              </button>

              {openId === lesson.id && (
                <div className="p-4 border-t text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
