'use client'

import React from 'react'

interface DifficultyControlProps {
  difficulty: number
  onDifficultyChange: (difficulty: number) => void
  isMining: boolean
}

export default function DifficultyControl({
  difficulty,
  onDifficultyChange,
  isMining,
}: DifficultyControlProps) {
  const estimates: { [key: number]: string } = {
    1: '~1-5ms',
    2: '~50-500ms',
    3: '~1-5 seconds',
    4: '~10-60 seconds',
    5: '~1-10 minutes',
  }

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">⚙️ Mining Difficulty Control</h3>

      <div className="space-y-4">
        {/* Difficulty Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Proof-of-Work Difficulty:</label>
            <span className="text-2xl font-bold text-indigo-600">{difficulty}</span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={difficulty}
            onChange={(e) => onDifficultyChange(parseInt(e.target.value))}
            disabled={isMining}
            className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-indigo-600"
          />

          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Easy</span>
            <span>Hard</span>
          </div>
        </div>

        {/* Difficulty Explanation */}
        <div className="p-3 bg-white rounded-lg border border-indigo-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Difficulty Level {difficulty}:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              🔢 <span className="font-semibold">Required Leading Zeros:</span> {difficulty}
            </p>
            <p>
              ⏱️ <span className="font-semibold">Estimated Mining Time:</span> {estimates[difficulty]}
            </p>
            <p>
              ✔️ <span className="font-semibold">Hash Example:</span>{' '}
              <code className="bg-gray-100 px-1 rounded">{Array(difficulty).fill('0').join('')}a7f3e4d2c1b9...</code>
            </p>
          </div>
        </div>

        {/* Educational Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p className="font-semibold mb-1">💡 Why Difficulty Matters:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Higher difficulty = more hashing work required</li>
            <li>Each level increase exponentially increases time (2^difficulty)</li>
            <li>Bitcoin adjusts difficulty every 2016 blocks (~2 weeks)</li>
            <li>This keeps mining time consistent as network power changes</li>
          </ul>
        </div>

        {/* Mining Info Box */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs font-semibold text-green-800 mb-2">📊 Mining Statistics:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
            <div>
              <p className="font-medium">Target Hash Format:</p>
              <code className="text-xs bg-white px-1 py-0.5 rounded">{Array(difficulty).fill('0').join('')}.....</code>
            </div>
            <div>
              <p className="font-medium">Average Nonce:</p>
              <p className="text-lg font-bold">{Math.pow(2, difficulty * 4).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
