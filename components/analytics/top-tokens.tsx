import { Card } from '@/components/ui/card'
import { formatVolume } from '@/lib/utils/analytics'
import type { TokenStat } from '@/types/analytics'

interface TopTokensProps {
  tokens: TokenStat[]
}

export function TopTokens({ tokens }: TopTokensProps): JSX.Element {
  if (tokens.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Tokens</h3>
        <p className="text-text-tertiary text-sm">No trading activity found</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Tokens by Volume</h3>
      <div className="space-y-3">
        {tokens.map((token, index) => (
          <div key={token.mint} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-400">#{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-text-primary">{token.symbol}</p>
                <p className="text-xs text-text-tertiary">{token.trades} trades</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-text-primary">{formatVolume(token.volume)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
