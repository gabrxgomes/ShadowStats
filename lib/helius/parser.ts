import type { ParsedSwap, TransactionWithMetadata } from '@/types/analytics'

// Known DEX program IDs
const DEX_PROGRAMS = {
  JUPITER: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  RAYDIUM_V4: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  RAYDIUM_CLMM: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  ORCA_WHIRLPOOL: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
}

// Common token symbols mapping
const TOKEN_SYMBOLS: Record<string, { symbol: string; decimals: number; name: string }> = {
  'So11111111111111111111111111111111111111112': { symbol: 'SOL', decimals: 9, name: 'Solana' },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    symbol: 'mSOL',
    decimals: 9,
    name: 'Marinade SOL',
  },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': {
    symbol: 'JUP',
    decimals: 6,
    name: 'Jupiter',
  },
}

export function parseSwapTransaction(
  tx: TransactionWithMetadata,
  userWallet: string
): ParsedSwap | null {
  try {
    // Check if transaction involves a DEX
    const isDexTx = tx.instructions.some((instruction) =>
      Object.values(DEX_PROGRAMS).includes(instruction.programId)
    )

    if (!isDexTx) {
      return null
    }

    // Get token transfers involving the user
    const userTransfers = tx.tokenTransfers.filter(
      (transfer) =>
        transfer.fromUserAccount === userWallet || transfer.toUserAccount === userWallet
    )

    if (userTransfers.length < 2) {
      return null
    }

    // Determine input and output tokens
    const tokenOut = userTransfers.find((t) => t.fromUserAccount === userWallet)
    const tokenIn = userTransfers.find((t) => t.toUserAccount === userWallet)

    if (!tokenOut || !tokenIn) {
      return null
    }

    // Get token info
    const tokenOutInfo = getTokenInfo(tokenOut.mint)
    const tokenInInfo = getTokenInfo(tokenIn.mint)

    // Determine DEX
    let dex = 'Unknown'
    for (const instruction of tx.instructions) {
      if (instruction.programId === DEX_PROGRAMS.JUPITER) dex = 'Jupiter'
      else if (instruction.programId === DEX_PROGRAMS.RAYDIUM_V4) dex = 'Raydium'
      else if (instruction.programId === DEX_PROGRAMS.RAYDIUM_CLMM) dex = 'Raydium CLMM'
      else if (instruction.programId === DEX_PROGRAMS.ORCA_WHIRLPOOL) dex = 'Orca'
    }

    // Calculate actual amounts
    const amountOut = tokenOut.tokenAmount / Math.pow(10, tokenOutInfo.decimals)
    const amountIn = tokenIn.tokenAmount / Math.pow(10, tokenInInfo.decimals)

    // Determine if buy or sell (based on SOL or stablecoin)
    const isStablecoin = (symbol: string) => ['USDC', 'USDT', 'DAI'].includes(symbol)
    const isSol = (symbol: string) => symbol === 'SOL'

    let type: 'buy' | 'sell' = 'buy'
    let valueUsd = 0

    if (isSol(tokenOutInfo.symbol) || isStablecoin(tokenOutInfo.symbol)) {
      type = 'buy'
      valueUsd = isStablecoin(tokenOutInfo.symbol) ? amountOut : amountOut * 100 // Rough SOL price estimate
    } else if (isSol(tokenInInfo.symbol) || isStablecoin(tokenInInfo.symbol)) {
      type = 'sell'
      valueUsd = isStablecoin(tokenInInfo.symbol) ? amountIn : amountIn * 100 // Rough SOL price estimate
    }

    return {
      signature: tx.signature,
      timestamp: tx.timestamp,
      type,
      tokenIn: {
        mint: tokenIn.mint,
        symbol: tokenInInfo.symbol,
        amount: amountIn,
        decimals: tokenInInfo.decimals,
      },
      tokenOut: {
        mint: tokenOut.mint,
        symbol: tokenOutInfo.symbol,
        amount: amountOut,
        decimals: tokenOutInfo.decimals,
      },
      valueUsd,
      dex,
    }
  } catch (error) {
    console.error('Error parsing swap transaction:', error)
    return null
  }
}

function getTokenInfo(mint: string): { symbol: string; decimals: number; name: string } {
  if (TOKEN_SYMBOLS[mint]) {
    return TOKEN_SYMBOLS[mint]
  }

  // Default for unknown tokens
  return {
    symbol: mint.slice(0, 4).toUpperCase(),
    decimals: 9,
    name: 'Unknown Token',
  }
}

export function isSwapTransaction(tx: TransactionWithMetadata): boolean {
  return tx.instructions.some((instruction) =>
    Object.values(DEX_PROGRAMS).includes(instruction.programId)
  )
}
