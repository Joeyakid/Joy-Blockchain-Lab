'use client'

import React from 'react'
import { Transaction } from '@/types/index'

interface PendingTransactionsProps {
  transactions: Transaction[]
  onRemoveTransaction: (id: string) => void
}

export default function PendingTransactions({
  transactions,
  onRemoveTransaction,
}: PendingTransactionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Pending Transactions ({transactions.length})
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending transactions</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition"
            >
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">From:</span>
                  <p className="text-gray-600 truncate">{tx.sender}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">To:</span>
                  <p className="text-gray-600 truncate">{tx.receiver}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Amount:</span>
                  <p className="text-blue-600 font-semibold">{tx.amount.toFixed(2)} coins</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveTransaction(tx.id)}
                className="mt-2 w-full text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
