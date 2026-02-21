import { Block, Transaction } from '@/types/index'

/**
 * Calculate SHA-256 hash of a string using Web Crypto API
 */
export async function sha256(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Generate a unique transaction ID
 */
export function generateTransactionId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Hash a block's data
 */
export async function hashBlock(block: Omit<Block, 'hash' | 'isValid'>): Promise<string> {
  const blockData = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    previousHash: block.previousHash,
    nonce: block.nonce,
  })
  return sha256(blockData)
}

/**
 * Mine a block with proof of work
 */
export async function mineBlock(
  index: number,
  transactions: Transaction[],
  previousHash: string,
  difficulty: number = 2
): Promise<{ hash: string; nonce: number }> {
  let nonce = 0
  let hash = ''

  const target = '0'.repeat(difficulty)

  while (!hash.startsWith(target)) {
    const blockData = {
      index,
      timestamp: Date.now(),
      transactions,
      previousHash,
      nonce,
    }

    hash = await sha256(JSON.stringify(blockData))
    nonce++
  }

  return { hash, nonce: nonce - 1 }
}

/**
 * Verify block validity
 */
export async function isBlockValid(block: Block, previousHash: string, difficulty: number = 2): Promise<boolean> {
  // Check if previous hash matches
  if (block.previousHash !== previousHash) {
    return false
  }

  // Recalculate hash
  const blockData = {
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    previousHash: block.previousHash,
    nonce: block.nonce,
  }

  const recalculatedHash = await sha256(JSON.stringify(blockData))

  // Check if hash matches
  if (block.hash !== recalculatedHash) {
    return false
  }

  // Check difficulty (proof of work)
  const target = '0'.repeat(difficulty)
  if (!block.hash.startsWith(target)) {
    return false
  }

  return true
}

/**
 * Verify entire blockchain
 */
export async function isBlockchainValid(blocks: Block[], difficulty: number = 2): Promise<boolean> {
  // Genesis block validation
  if (blocks.length > 0) {
    const genesisBlock = blocks[0]
    if (genesisBlock.index !== 0 || genesisBlock.previousHash !== '0') {
      return false
    }

    const isGenesisValid = await isBlockValid(genesisBlock, '0', difficulty)
    if (!isGenesisValid) {
      return false
    }
  }

  // Validate remaining blocks
  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    const isValid = await isBlockValid(currentBlock, previousBlock.hash, difficulty)
    if (!isValid) {
      return false
    }
  }

  return true
}
