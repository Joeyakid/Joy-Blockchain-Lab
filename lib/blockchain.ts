import { Block, Transaction } from '@/types/index'

/**
 * Utility: generate SHA-256 hash of a string
 */
export async function generateSHA256Hash(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Blockchain class encapsulates chain state, mining and validation logic.
 * Use `Blockchain.initFromLocalStorage()` to obtain an initialized instance
 * (ensures genesis block is mined immediately when no chain exists).
 */
export class Blockchain {
  public chain: Block[]
  public difficulty: number

  private constructor(chain: Block[], difficulty = 2) {
    this.chain = chain
    this.difficulty = difficulty
  }

  /**
   * Initialize blockchain instance from localStorage or create a new chain.
   * Ensures genesis is mined immediately if no chain exists.
   */
  public static async initFromLocalStorage(difficulty = 2): Promise<Blockchain> {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('blockchain') : null
    let chain: Block[] = []

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Block[]
        // if parsed is non-empty, use it as-is (do not recreate genesis)
        if (Array.isArray(parsed) && parsed.length > 0) {
          chain = parsed
        }
      } catch (e) {
        console.error('Failed to parse blockchain from storage, recreating genesis.', e)
      }
    }

    // If no valid chain found, create and mine genesis immediately
    if (chain.length === 0) {
      const genesis = await Blockchain.createGenesisBlock(difficulty)
      chain = [genesis]
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('blockchain', JSON.stringify(chain))
      }
    }

    return new Blockchain(chain, difficulty)
  }

  /**
   * Creates and mines the genesis block (index 0). Always uses previousHash '0'.
   */
  public static async createGenesisBlock(difficulty = 2): Promise<Block> {
    const base: Omit<Block, 'hash'> = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      nonce: 0,
    }

    const { hash, nonce } = await Blockchain.mineBlockWithPoW(base, difficulty)
    return { ...base, hash, nonce }
  }

  /**
   * Mine a block using proof-of-work. Uses the provided block data's timestamp
   * (does NOT refresh timestamp every loop) so mining is deterministic with
   * respect to the block fields and nonce.
   */
  public static async mineBlockWithPoW(blockData: Omit<Block, 'hash'>, difficulty = 2): Promise<{ hash: string; nonce: number }> {
    let nonce = blockData.nonce || 0
    let hash = ''
    const target = '0'.repeat(difficulty)

    // Keep timestamp fixed from blockData (important)
    const fixedData = {
      index: blockData.index,
      timestamp: blockData.timestamp,
      transactions: blockData.transactions,
      previousHash: blockData.previousHash,
    }

    while (true) {
      const dataToHash = JSON.stringify({ ...fixedData, nonce })
      hash = await generateSHA256Hash(dataToHash)
      if (hash.startsWith(target)) {
        return { hash, nonce }
      }
      nonce++
    }
  }

  /**
   * Add a new block (mined) to the chain using current chain tip as previousHash.
   */
  public async addBlock(transactions: Transaction[]): Promise<Block> {
    const last = this.chain[this.chain.length - 1]
    const index = last.index + 1
    const previousHash = last.hash
    const blockData: Omit<Block, 'hash'> = {
      index,
      timestamp: Date.now(),
      transactions,
      previousHash,
      nonce: 0,
    }

    const { hash, nonce } = await Blockchain.mineBlockWithPoW(blockData, this.difficulty)
    const newBlock: Block = { ...blockData, hash, nonce }
    this.chain.push(newBlock)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('blockchain', JSON.stringify(this.chain))
    }
    return newBlock
  }

  /**
   * Recalculate a block's hash from its canonical fields.
   */
  public static async recalculateHash(block: Block): Promise<string> {
    const dataToHash = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      previousHash: block.previousHash,
      nonce: block.nonce,
    })
    return generateSHA256Hash(dataToHash)
  }

  /**
   * Validate a single block. NOTE: previousHash check is skipped for index 0
   * (genesis) because it deliberately uses '0'.
   */
  public static async validateBlock(block: Block, previousHash: string | null, difficulty = 2): Promise<boolean> {
    // For index > 0 ensure previousHash matches. For index === 0 skip check or
    // ensure it equals '0'. This avoids invalidating the chain on initial load
    // when previousHash isn't meaningful for genesis.
    if (block.index > 0) {
      if (previousHash === null) return false
      if (block.previousHash !== previousHash) return false
    } else {
      // genesis should reference '0'
      if (block.previousHash !== '0') return false
    }

    // Recalculate hash
    const recalculatedHash = await Blockchain.recalculateHash(block)
    if (block.hash !== recalculatedHash) return false

    // Check proof of work
    const target = '0'.repeat(difficulty)
    if (!block.hash.startsWith(target)) return false

    return true
  }

  /**
   * Validate whole chain and return list of invalid block indices.
   */
  public static async validateChain(chain: Block[], difficulty = 2): Promise<{ isValid: boolean; invalidBlocks: number[] }> {
    const invalidBlocks: number[] = []

    if (chain.length === 0) {
      return { isValid: true, invalidBlocks }
    }

    for (let i = 0; i < chain.length; i++) {
      const block = chain[i]
      const prevHash = i === 0 ? '0' : chain[i - 1].hash
      const ok = await Blockchain.validateBlock(block, prevHash, difficulty)
      if (!ok) invalidBlocks.push(i)
    }

    return { isValid: invalidBlocks.length === 0, invalidBlocks }
  }

  /**
   * Save current chain to localStorage (if available).
   */
  public saveToLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('blockchain', JSON.stringify(this.chain))
    }
  }

  /**
   * Return a deep copy of chain to avoid accidental mutation from external code.
   */
  public getChainCopy(): Block[] {
    return JSON.parse(JSON.stringify(this.chain)) as Block[]
  }
}

export default Blockchain

/**
 * Backwards-compatible function exports used elsewhere in the app.
 */
export async function createNewBlock(
  transactions: Transaction[],
  previousHash: string,
  index: number,
  difficulty = 2
): Promise<Block> {
  const blockData: Omit<Block, 'hash'> = {
    index,
    timestamp: Date.now(),
    transactions,
    previousHash,
    nonce: 0,
  }

  const { hash, nonce } = await Blockchain.mineBlockWithPoW(blockData, difficulty)
  return { ...blockData, hash, nonce }
}

export async function validateBlock(block: Block, previousHash: string | null, difficulty = 2): Promise<boolean> {
  return Blockchain.validateBlock(block, previousHash, difficulty)
}

/**
 * Validate entire blockchain and return validation result with list of invalid block indices.
 */
export async function validateChain(chain: Block[], difficulty = 2): Promise<{ isValid: boolean; invalidBlocks: number[] }> {
  return Blockchain.validateChain(chain, difficulty)
}

/**
 * Get blockchain statistics (total blocks, transactions, difficulty).
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
