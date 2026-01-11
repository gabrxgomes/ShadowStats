import { Card } from '@/components/ui/card'
import type { ParsedSwap } from '@/types/analytics'

interface RecentTradesProps {
  trades: ParsedSwap[]
}

export function RecentTrades({ trades }: RecentTradesProps): JSX.Element {
  if (trades.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
        <p className="text-text-tertiary text-sm">No recent trades found</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {trades.slice(0, 5).map((trade) => (
          <div
            key={trade.signature}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.type === 'buy'
                    ? 'bg-success/10 text-success'
                    : 'bg-error/10 text-error'
                }`}
              >
                {trade.type.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {trade.tokenIn.symbol} → {trade.tokenOut.symbol}
                </p>
                <p className="text-xs text-text-tertiary">
                  {new Date(trade.timestamp).toLocaleDateString()} via {trade.dex}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm text-text-primary">
                ${trade.valueUsd.toFixed(2)}
              </p>
              <a
                href={`https://solscan.io/tx/${trade.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:underline"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
