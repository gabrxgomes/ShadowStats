'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { ConnectButton } from '@/components/wallet/connect-button'
import { WalletInfo } from '@/components/wallet/wallet-info'
import { StatsCard } from '@/components/analytics/stats-card'
import { TopTokens } from '@/components/analytics/top-tokens'
import { RecentTrades } from '@/components/analytics/recent-trades'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '@/hooks/use-analytics'
import { formatVolume, formatPercentage, formatNumber } from '@/lib/utils/analytics'
import Link from 'next/link'

export default function Dashboard(): JSX.Element {
  const { connected } = useWallet()
  const { data, isLoading, error, cached, refetch } = useAnalytics()

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold bg-gradient-solana bg-clip-text text-transparent">
                ShadowStats
              </h1>
            </Link>
            <ConnectButton />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full text-center" padding="lg">
            <div className="w-16 h-16 rounded-full bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-text-secondary mb-6">
              Connect your Solana wallet to view your trading analytics
            </p>
            <ConnectButton />
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-solana bg-clip-text text-transparent">
              ShadowStats
            </h1>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-text-secondary">View your trading analytics and performance</p>
            </div>
            {!isLoading && data && (
              <button
                onClick={refetch}
                className="px-4 py-2 bg-bg-tertiary border border-border rounded-lg text-sm font-medium hover:border-primary-400 hover:text-primary-400 transition-colors"
              >
                {cached ? 'Refresh Data' : 'Reload'}
              </button>
            )}
          </div>

          <div className="space-y-6">
            <WalletInfo />

            {error && (
              <Card className="p-6 border-error/20 bg-error/5">
                <p className="text-error text-sm">{error}</p>
              </Card>
            )}

            {isLoading ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-6">
                      <Skeleton className="h-4 w-20 mb-3" />
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </Card>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-32 w-full" />
                  </Card>
                  <Card className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-32 w-full" />
                  </Card>
                </div>
              </>
            ) : data ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Volume"
                    value={formatVolume(data.totalVolume)}
                    subtitle={`${data.tradingDays} days active`}
                    icon={
                      <svg
                        className="w-5 h-5 text-primary-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Win Rate"
                    value={formatPercentage(data.winRate)}
                    subtitle="Estimated"
                    icon={
                      <svg
                        className="w-5 h-5 text-primary-400"
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
                    }
                  />
                  <StatsCard
                    title="Total Trades"
                    value={formatNumber(data.tradeCount)}
                    subtitle={`${formatVolume(data.avgTradeSize)} avg`}
                    icon={
                      <svg
                        className="w-5 h-5 text-primary-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    }
                  />
                  <StatsCard
                    title="Profit/Loss"
                    value={formatVolume(data.profitLoss)}
                    subtitle="Estimated"
                    icon={
                      <svg
                        className="w-5 h-5 text-primary-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TopTokens tokens={data.topTokens} />
                  <RecentTrades trades={data.recentTrades} />
                </div>

                {cached && (
                  <Card className="p-4 border-warning/20 bg-warning/5">
                    <p className="text-warning text-sm">
                      Showing cached data. Click &quot;Refresh Data&quot; to update.
                    </p>
                  </Card>
                )}
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
