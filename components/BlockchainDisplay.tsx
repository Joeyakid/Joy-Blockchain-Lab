'use client'

import React from 'react'
import { Block } from '@/types/index'
import BlockVisualization from './BlockVisualization'

interface BlockchainDisplayProps {
  blocks: Block[]
  blockValidityMap: { [key: number]: boolean }
}

export default function BlockchainDisplay({ blocks, blockValidityMap }: BlockchainDisplayProps) {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Blockchain</h2>

      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Genesis block will be created when you mine the first block</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {blocks.map((block) => (
            <div key={block.index} className="relative">
              <BlockVisualization
                block={block}
                isValid={blockValidityMap[block.index] ?? true}
              />
              {block.index < blocks.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="border-l-2 border-gray-400 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Total Blocks:</span> {blocks.length}
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <span className="font-semibold">Valid Blocks:</span>{' '}
          {Object.values(blockValidityMap).filter(Boolean).length}
        </p>
      </div>
    </div>
  )
}
