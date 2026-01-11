import crypto from 'crypto'
import type { AnalyticsData } from '@/types/analytics'
import type { ReportStats, PrivacyReport, CreateReportRequest, ReportMetadata } from '@/types/report'

/**
 * Create a value range with variation for privacy
 */
export function createValueRange(
  value: number,
  variationPercent: number = 5
): { min: number; max: number } {
  const variation = value * (variationPercent / 100)
  return {
    min: Math.max(0, value - variation),
    max: value + variation,
  }
}

/**
 * Generate report stats from analytics data with privacy ranges
 */
export function generateReportStats(
  analytics: AnalyticsData,
  request: CreateReportRequest
): ReportStats {
  const variation = request.rangeVariation || 5

  // Calculate period
  const now = new Date()
  const periodStart = new Date(now.getTime() - analytics.tradingDays * 24 * 60 * 60 * 1000)

  const stats: ReportStats = {
    totalVolumeRange: request.includeVolume
      ? createValueRange(analytics.totalVolume, variation)
      : { min: 0, max: 0 },

    tradeCountRange: request.includeTradeCount
      ? createValueRange(analytics.tradeCount, variation)
      : { min: 0, max: 0 },

    winRate: request.includeWinRate ? analytics.winRate : 0,

    profitLossRange: request.includeProfitLoss
      ? createValueRange(analytics.profitLoss, variation)
      : { min: 0, max: 0 },

    tradingDays: analytics.tradingDays,

    avgTradeSizeRange: createValueRange(analytics.avgTradeSize, variation),

    topTokens: request.includeTopTokens
      ? analytics.topTokens.slice(0, 5).map((token) => ({
          symbol: token.symbol,
          tradeCount: token.trades,
        }))
      : [],

    periodStart: periodStart.toISOString(),
    periodEnd: now.toISOString(),
  }

  return stats
}

/**
 * Generate a cryptographic commitment hash for the report
 */
export function generateCommitment(report: PrivacyReport): string {
  // Create deterministic string from report data
  const data = JSON.stringify({
    stats: report.stats,
    metadata: {
      title: report.metadata.title,
      generatedAt: report.metadata.generatedAt,
      version: report.metadata.version,
    },
    privacy: report.privacy,
  })

  // Generate SHA-256 hash
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Create a complete privacy report
 */
export function createPrivacyReport(
  analytics: AnalyticsData,
  request: CreateReportRequest,
  walletAddress: string
): PrivacyReport {
  const reportId = crypto.randomBytes(16).toString('hex')
  const now = new Date()

  // Calculate expiration
  const expiresAt = request.expiresInDays
    ? new Date(now.getTime() + request.expiresInDays * 24 * 60 * 60 * 1000)
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // default 30 days

  const metadata: ReportMetadata = {
    id: reportId,
    title: request.title,
    description: request.description,
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    version: '1.0.0',
  }

  const stats = generateReportStats(analytics, request)

  const report: PrivacyReport = {
    metadata,
    stats,
    proof: {
      commitment: '', // Will be filled after generation
    },
    privacy: {
      walletRevealed: request.revealWallet,
      walletAddress: request.revealWallet ? walletAddress : undefined,
    },
  }

  // Generate commitment hash
  report.proof.commitment = generateCommitment(report)

  return report
}

/**
 * Verify report integrity
 */
export function verifyReportCommitment(report: PrivacyReport): boolean {
  const storedCommitment = report.proof.commitment
  const calculatedCommitment = generateCommitment({
    ...report,
    proof: { ...report.proof, commitment: '' },
  })

  return storedCommitment === calculatedCommitment
}

/**
 * Check if report has expired
 */
export function isReportExpired(report: PrivacyReport): boolean {
  if (!report.metadata.expiresAt) return false

  const expiresAt = new Date(report.metadata.expiresAt)
  return expiresAt < new Date()
}

/**
 * Format report stats for display
 */
export function formatReportStats(stats: ReportStats): Record<string, string> {
  return {
    totalVolume:
      stats.totalVolumeRange.min === 0 && stats.totalVolumeRange.max === 0
        ? 'Hidden'
        : `$${stats.totalVolumeRange.min.toLocaleString()} - $${stats.totalVolumeRange.max.toLocaleString()}`,

    tradeCount:
      stats.tradeCountRange.min === 0 && stats.tradeCountRange.max === 0
        ? 'Hidden'
        : `${Math.floor(stats.tradeCountRange.min)} - ${Math.ceil(stats.tradeCountRange.max)} trades`,

    winRate: stats.winRate > 0 ? `${stats.winRate.toFixed(1)}%` : 'Hidden',

    profitLoss:
      stats.profitLossRange.min === 0 && stats.profitLossRange.max === 0
        ? 'Hidden'
        : `$${stats.profitLossRange.min.toLocaleString()} - $${stats.profitLossRange.max.toLocaleString()}`,

    tradingDays: `${stats.tradingDays} days`,

    avgTradeSize: `$${stats.avgTradeSizeRange.min.toLocaleString()} - $${stats.avgTradeSizeRange.max.toLocaleString()}`,
  }
}
