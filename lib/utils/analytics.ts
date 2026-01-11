import type { AnalyticsData, ParsedSwap, TokenStat } from '@/types/analytics'

export function calculateAnalytics(swaps: ParsedSwap[]): AnalyticsData {
  if (swaps.length === 0) {
    return {
      totalVolume: 0,
      tradeCount: 0,
      winRate: 0,
      avgTradeSize: 0,
      profitLoss: 0,
      topTokens: [],
      tradingDays: 0,
      firstTradeDate: new Date().toISOString(),
      lastTradeDate: new Date().toISOString(),
      recentTrades: [],
    }
  }

  // Sort swaps by timestamp
  const sortedSwaps = [...swaps].sort((a, b) => a.timestamp - b.timestamp)

  // Calculate total volume
  const totalVolume = swaps.reduce((sum, swap) => sum + swap.valueUsd, 0)

  // Calculate trade count
  const tradeCount = swaps.length

  // Calculate average trade size
  const avgTradeSize = totalVolume / tradeCount

  // Calculate profit/loss (simplified - would need price data for accurate calculation)
  const profitLoss = calculateProfitLoss(swaps)

  // Calculate win rate
  const winRate = calculateWinRate(swaps)

  // Get top tokens
  const topTokens = calculateTopTokens(swaps)

  // Calculate trading days
  const firstTrade = sortedSwaps[0]
  const lastTrade = sortedSwaps[sortedSwaps.length - 1]
  const tradingDays = Math.ceil(
    (lastTrade.timestamp - firstTrade.timestamp) / (1000 * 60 * 60 * 24)
  )

  return {
    totalVolume,
    tradeCount,
    winRate,
    avgTradeSize,
    profitLoss,
    topTokens,
    tradingDays: tradingDays || 1,
    firstTradeDate: new Date(firstTrade.timestamp).toISOString(),
    lastTradeDate: new Date(lastTrade.timestamp).toISOString(),
    recentTrades: sortedSwaps.slice(-10).reverse(),
  }
}

function calculateProfitLoss(swaps: ParsedSwap[]): number {
  // Simplified P&L calculation
  // In production, would need historical price data
  let pnl = 0

  const positions: Record<string, { amount: number; costBasis: number }> = {}

  for (const swap of swaps) {
    if (swap.type === 'buy') {
      const token = swap.tokenIn.mint
      if (!positions[token]) {
        positions[token] = { amount: 0, costBasis: 0 }
      }
      positions[token].amount += swap.tokenIn.amount
      positions[token].costBasis += swap.valueUsd
    } else {
      const token = swap.tokenOut.mint
      if (positions[token]) {
        const sellRatio = swap.tokenOut.amount / positions[token].amount
        const costBasis = positions[token].costBasis * sellRatio
        pnl += swap.valueUsd - costBasis
        positions[token].amount -= swap.tokenOut.amount
        positions[token].costBasis -= costBasis
      }
    }
  }

  return pnl
}

function calculateWinRate(swaps: ParsedSwap[]): number {
  if (swaps.length === 0) return 0

  // Simplified win rate based on profit/loss
  // Would need actual price data for accurate calculation
  const trades = swaps.length
  const estimatedWins = Math.floor(trades * 0.6) // Placeholder logic

  return (estimatedWins / trades) * 100
}

function calculateTopTokens(swaps: ParsedSwap[]): TokenStat[] {
  const tokenMap: Record<string, TokenStat> = {}

  for (const swap of swaps) {
    const token = swap.type === 'buy' ? swap.tokenIn : swap.tokenOut
    const key = token.mint

    if (!tokenMap[key]) {
      tokenMap[key] = {
        mint: token.mint,
        symbol: token.symbol,
        name: token.symbol,
        volume: 0,
        trades: 0,
        profitLoss: 0,
      }
    }

    tokenMap[key].volume += swap.valueUsd
    tokenMap[key].trades += 1
  }

  return Object.values(tokenMap)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5)
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000) {
    return `$${(volume / 1_000_000).toFixed(2)}M`
  } else if (volume >= 1_000) {
    return `$${(volume / 1_000).toFixed(2)}K`
  } else {
    return `$${volume.toFixed(2)}`
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
