import { Card } from '@/components/ui/card'
import { formatReportStats } from '@/lib/utils/report'
import type { PrivacyReport } from '@/types/report'

interface ReportViewProps {
  report: PrivacyReport
  verified: boolean
  viewCount?: number
}

export function ReportView({ report, verified, viewCount }: ReportViewProps) {
  const formattedStats = formatReportStats(report.stats)

  const periodStart = new Date(report.stats.periodStart)
  const periodEnd = new Date(report.stats.periodEnd)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{report.metadata.title}</h1>
            {report.metadata.description && (
              <p className="text-text-secondary">{report.metadata.description}</p>
            )}
          </div>
          {verified && (
            <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
              <svg
                className="w-4 h-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium text-success">Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-text-tertiary">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {periodStart.toLocaleDateString()} - {periodEnd.toLocaleDateString()}
            </span>
          </div>
          {viewCount !== undefined && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{viewCount} views</span>
            </div>
          )}
        </div>
      </Card>

      {/* Privacy Info */}
      {report.privacy.walletRevealed && report.privacy.walletAddress && (
        <Card className="p-4 bg-warning/5 border-warning/20">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-warning mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-warning mb-1">Wallet Address Revealed</p>
              <p className="text-xs text-text-tertiary font-mono">
                {report.privacy.walletAddress}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Total Volume</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.totalVolume}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Trade Count</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.tradeCount}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Win Rate</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.winRate}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Profit/Loss</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.profitLoss}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Avg Trade Size</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.avgTradeSize}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Trading Days</h3>
          <p className="text-2xl font-bold text-text-primary">{formattedStats.tradingDays}</p>
        </Card>
      </div>

      {/* Top Tokens */}
      {report.stats.topTokens.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Traded Tokens</h3>
          <div className="space-y-3">
            {report.stats.topTokens.map((token, index) => (
              <div key={token.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-400">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-text-primary">{token.symbol}</span>
                </div>
                <span className="text-sm text-text-tertiary">{token.tradeCount} trades</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Verification Info */}
      <Card className="p-6 bg-bg-tertiary">
        <h3 className="text-lg font-semibold mb-4">Verification</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Commitment Hash:</span>
            <span className="font-mono text-xs text-text-primary break-all">
              {report.proof.commitment.slice(0, 16)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Generated:</span>
            <span className="text-text-primary">
              {new Date(report.metadata.generatedAt).toLocaleString()}
            </span>
          </div>
          {report.metadata.expiresAt && (
            <div className="flex justify-between">
              <span className="text-text-secondary">Expires:</span>
              <span className="text-text-primary">
                {new Date(report.metadata.expiresAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
