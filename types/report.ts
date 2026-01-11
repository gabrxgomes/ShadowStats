/**
 * Report types for privacy-preserving analytics sharing
 */

export interface ReportStats {
  // Volume metrics (using ranges for privacy)
  totalVolumeRange: {
    min: number
    max: number
  }
  tradeCountRange: {
    min: number
    max: number
  }

  // Performance metrics
  winRate: number // percentage
  profitLossRange: {
    min: number
    max: number
  }

  // Trading activity
  tradingDays: number
  avgTradeSizeRange: {
    min: number
    max: number
  }

  // Top tokens (without revealing exact amounts)
  topTokens: Array<{
    symbol: string
    tradeCount: number
  }>

  // Time period
  periodStart: string // ISO date
  periodEnd: string // ISO date
}

export interface ReportMetadata {
  id: string
  title: string
  description?: string
  generatedAt: string // ISO date
  expiresAt?: string // ISO date (optional expiration)
  version: string // report format version
}

export interface PrivacyReport {
  metadata: ReportMetadata
  stats: ReportStats
  proof: {
    commitment: string // Hash of the report data
    merkleRoot?: string // Optional: Light Protocol merkle root
    signature?: string // Optional: Wallet signature
  }
  privacy: {
    walletRevealed: boolean
    walletAddress?: string // Only if walletRevealed is true
  }
}

export interface CreateReportRequest {
  // Selected stats to include
  includeVolume: boolean
  includeTradeCount: boolean
  includeWinRate: boolean
  includeProfitLoss: boolean
  includeTopTokens: boolean

  // Privacy settings
  revealWallet: boolean

  // Report metadata
  title: string
  description?: string
  expiresInDays?: number // Report expiration (default: 30 days)

  // Range obfuscation (%)
  rangeVariation?: number // e.g., 10 means ±10% range (default: 5)
}

export interface CreateReportResponse {
  report: PrivacyReport
  reportId: string
  shareUrl: string
}

export interface VerifyReportRequest {
  reportId: string
}

export interface VerifyReportResponse {
  valid: boolean
  report: PrivacyReport | null
  verifiedAt: string
  message?: string
}

export interface StoredReport {
  id: string
  user_id: string
  report_data: PrivacyReport
  commitment_hash: string
  created_at: string
  expires_at: string | null
  view_count: number
}
