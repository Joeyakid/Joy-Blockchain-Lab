import { Block, Transaction } from '@/types/index'

/**
 * Generate SHA-256 hash of data using Web Crypto API
 */
export async function generateSHA256Hash(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Create the genesis block (first block in the chain)
 */
export async function createGenesisBlock(): Promise<Block> {
  const genesisBlock: Omit<Block, 'hash'> = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: '0',
    nonce: 0,
  }

  // Mine the genesis block
  const hash = await mineBlockWithPoW(genesisBlock, 2)

  return {
    ...genesisBlock,
    hash,
  }
}

/**
 * Perform proof-of-work mining for a block
 */
async function mineBlockWithPoW(
  blockData: Omit<Block, 'hash'>,
  difficulty: number = 2
): Promise<string> {
  let nonce = blockData.nonce || 0
  let hash = ''
  const target = '0'.repeat(difficulty)

  while (!hash.startsWith(target)) {
    const dataToHash = JSON.stringify({
      ...blockData,
      nonce,
    })

    hash = await generateSHA256Hash(dataToHash)
    nonce++
  }

  return hash
}

/**
 * Create a new block and mine it
 */
export async function createNewBlock(
  transactions: Transaction[],
  previousHash: string,
  index: number,
  difficulty: number = 2
): Promise<Block> {
  const newBlockData: Omit<Block, 'hash'> = {
    index,
    timestamp: Date.now(),
    transactions,
    previousHash,
    nonce: 0,
  }

  // Mine the block
  const hash = await mineBlockWithPoW(newBlockData, difficulty)

  return {
    ...newBlockData,
    hash,
  }
}

/**
 * Validate a single block
 */
export async function validateBlock(
  block: Block,
  previousHash: string,
  difficulty: number = 2
): Promise<boolean> {
  // Check previous hash
  if (block.previousHash !== previousHash) {
    return false
  }

  // Recalculate hash
  const blockDataToHash = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    previousHash: block.previousHash,
    nonce: block.nonce,
  })

  const recalculatedHash = await generateSHA256Hash(blockDataToHash)

  if (block.hash !== recalculatedHash) {
    return false
  }

  // Check proof of work
  const target = '0'.repeat(difficulty)
  if (!block.hash.startsWith(target)) {
    return false
  }

  return true
}

/**
 * Validate the entire blockchain
 */
export async function validateChain(
  chain: Block[],
  difficulty: number = 2
): Promise<{ isValid: boolean; invalidBlocks: number[] }> {
  const invalidBlocks: number[] = []

  // Empty chain is valid
  if (chain.length === 0) {
    return { isValid: true, invalidBlocks: [] }
  }

  // Validate genesis block
  const genesisIsValid = await validateBlock(chain[0], '0', difficulty)
  if (!genesisIsValid) {
    invalidBlocks.push(0)
  }

  // Validate remaining blocks
  for (let i = 1; i < chain.length; i++) {
    const isValid = await validateBlock(chain[i], chain[i - 1].hash, difficulty)
    if (!isValid) {
      invalidBlocks.push(i)
    }
  }

  return {
    isValid: invalidBlocks.length === 0,
    invalidBlocks,
  }
}

/**
 * Get blockchain statistics
 */
export function getBlockchainStats(chain: Block[]): {
  totalBlocks: number
  totalTransactions: number
  difficulty: number
} {
  const totalBlocks = chain.length
  const totalTransactions = chain.reduce((sum, block) => sum + block.transactions.length, 0)

  return {
    totalBlocks,
    totalTransactions,
    difficulty: 2, // Current difficulty
  }
}
