'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { ConnectButton } from '@/components/wallet/connect-button'
import { WalletInfo } from '@/components/wallet/wallet-info'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Dashboard(): JSX.Element {
  const { connected } = useWallet()

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
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-text-secondary">View your trading analytics and performance</p>
          </div>

          <div className="space-y-6">
            <WalletInfo />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center" padding="lg">
                <p className="text-text-secondary text-sm mb-2">Total Volume</p>
                <p className="text-3xl font-bold text-primary-400">Coming Soon</p>
              </Card>
              <Card className="text-center" padding="lg">
                <p className="text-text-secondary text-sm mb-2">Win Rate</p>
                <p className="text-3xl font-bold text-primary-400">Coming Soon</p>
              </Card>
              <Card className="text-center" padding="lg">
                <p className="text-text-secondary text-sm mb-2">Total Trades</p>
                <p className="text-3xl font-bold text-primary-400">Coming Soon</p>
              </Card>
            </div>

            <Card padding="lg">
              <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Phase 3: Analytics engine with Helius integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Phase 4: Privacy reports with Light Protocol</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Phase 5: Testing and polish</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
