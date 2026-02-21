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
      <p>The blockchain is an append-only chain of blocks. Each block contains a set of transactions, a timestamp, a nonce, and a hash. Blocks are linked together using the previous block's hash so that tampering with an older block invalidates later blocks.</p>
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
