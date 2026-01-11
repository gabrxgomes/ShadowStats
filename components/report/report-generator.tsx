'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { useReport } from '@/hooks/use-report'
import type { AnalyticsData } from '@/types/analytics'
import type { CreateReportRequest } from '@/types/report'

interface ReportGeneratorProps {
  analytics: AnalyticsData
  onReportGenerated?: (reportId: string, shareUrl: string) => void
}

export function ReportGenerator({ analytics, onReportGenerated }: ReportGeneratorProps) {
  const { generateReport, isGenerating, error } = useReport()

  const [formData, setFormData] = useState<CreateReportRequest>({
    includeVolume: true,
    includeTradeCount: true,
    includeWinRate: true,
    includeProfitLoss: true,
    includeTopTokens: true,
    revealWallet: false,
    title: 'My Trading Performance',
    description: '',
    expiresInDays: 30,
    rangeVariation: 5,
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await generateReport(analytics, formData)

    if (result) {
      setShareUrl(result.shareUrl)
      setShowSuccess(true)
      if (onReportGenerated) {
        onReportGenerated(result.reportId, result.shareUrl)
      }
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  if (showSuccess) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Report Generated!</h3>
          <p className="text-text-secondary mb-6">
            Your privacy report has been created and is ready to share.
          </p>

          <div className="bg-bg-tertiary border border-border rounded-lg p-4 mb-4">
            <p className="text-sm text-text-tertiary mb-2">Share URL:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-text-primary"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-primary-400 text-bg-primary rounded font-medium hover:bg-primary-500 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowSuccess(false)}
            className="text-primary-400 hover:underline text-sm"
          >
            Generate Another Report
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Generate Privacy Report</h3>
      <p className="text-text-secondary text-sm mb-6">
        Create a shareable report with privacy-preserving ranges. Others can verify your
        performance without seeing your exact wallet.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Details */}
        <div>
          <label className="block text-sm font-medium mb-2">Report Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
            rows={3}
          />
        </div>

        {/* Stats Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Include Stats:</label>
          <div className="space-y-2">
            {[
              { key: 'includeVolume', label: 'Total Volume' },
              { key: 'includeTradeCount', label: 'Trade Count' },
              { key: 'includeWinRate', label: 'Win Rate' },
              { key: 'includeProfitLoss', label: 'Profit/Loss' },
              { key: 'includeTopTokens', label: 'Top Tokens' },
            ].map((stat) => (
              <label key={stat.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[stat.key as keyof CreateReportRequest] as boolean}
                  onChange={(e) =>
                    setFormData({ ...formData, [stat.key]: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-400"
                />
                <span className="text-sm">{stat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <label className="block text-sm font-medium mb-3">Privacy Settings:</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.revealWallet}
              onChange={(e) => setFormData({ ...formData, revealWallet: e.target.checked })}
              className="w-4 h-4 text-primary-400"
            />
            <span className="text-sm">Reveal my wallet address</span>
          </label>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Range Variation: {formData.rangeVariation}%
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={formData.rangeVariation}
              onChange={(e) =>
                setFormData({ ...formData, rangeVariation: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Stats will be shown as ranges (±{formData.rangeVariation}%)
            </p>
          </div>
        </div>

        {/* Expiration */}
        <div>
          <label className="block text-sm font-medium mb-2">Expires In (days)</label>
          <input
            type="number"
            min="1"
            max="365"
            value={formData.expiresInDays}
            onChange={(e) =>
              setFormData({ ...formData, expiresInDays: parseInt(e.target.value) })
            }
            className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
            required
          />
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded p-3 text-error text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-solana rounded-lg font-medium text-bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </button>
      </form>
    </Card>
  )
}
