export interface AnalyticsData {
  totalVolume: number
  tradeCount: number
  winRate: number
  avgTradeSize: number
  profitLoss: number
  topTokens: TokenStat[]
  tradingDays: number
  firstTradeDate: string
  lastTradeDate: string
  recentTrades: ParsedSwap[]
}

export interface TokenStat {
  mint: string
  symbol: string
  name: string
  volume: number
  trades: number
  profitLoss: number
}

export interface ParsedSwap {
  signature: string
  timestamp: number
  type: 'buy' | 'sell'
  tokenIn: {
    mint: string
    symbol: string
    amount: number
    decimals: number
  }
  tokenOut: {
    mint: string
    symbol: string
    amount: number
    decimals: number
  }
  valueUsd: number
  dex: string
  profitLoss?: number
}

export interface TransactionWithMetadata {
  signature: string
  timestamp: number
  type: string
  source: string
  fee: number
  feePayer: string
  accounts: string[]
  instructions: Instruction[]
  nativeTransfers: NativeTransfer[]
  tokenTransfers: TokenTransfer[]
}

export interface Instruction {
  programId: string
  accounts: string[]
  data: string
}

export interface NativeTransfer {
  fromUserAccount: string
  toUserAccount: string
  amount: number
}

export interface TokenTransfer {
  fromUserAccount: string
  toUserAccount: string
  fromTokenAccount: string
  toTokenAccount: string
  tokenAmount: number
  mint: string
  tokenStandard: string
}

export interface AnalyzeRequest {
  wallet: string
  limit?: number
  refresh?: boolean
}

export interface AnalyzeResponse {
  analytics: AnalyticsData
  cached: boolean
  analyzedAt: string
}
