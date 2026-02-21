export interface Transaction {
  id: string
  sender: string
  receiver: string
  amount: number
  timestamp: number
}

export interface Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  hash: string
  nonce: number
  isValid?: boolean
}

export interface Blockchain {
  chain: Block[]
  pendingTransactions: Transaction[]
  difficulty: number
}
