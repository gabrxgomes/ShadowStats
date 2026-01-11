import { ConnectButton } from '@/components/wallet/connect-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-solana bg-clip-text text-transparent">
              ShadowStats
            </h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-solana bg-clip-text text-transparent">
            Privacy-First Trading Analytics
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Analyze your Solana trading performance and generate verifiable proof of your stats without exposing your wallet address
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <ConnectButton />
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-400">Private</h3>
              <p className="text-text-secondary text-sm">
                Analyze trading performance without exposing your wallet address or transaction details
              </p>
            </div>

            <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-400">Verifiable</h3>
              <p className="text-text-secondary text-sm">
                Generate ZK proofs of your performance using Light Protocol for trustless verification
              </p>
            </div>

            <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gradient-solana-subtle border border-primary-400/20 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-400">Powerful</h3>
              <p className="text-text-secondary text-sm">
                Comprehensive analytics powered by Helius Enhanced APIs with real-time data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-text-tertiary text-sm">
          Built for Solana Privacy Hack 2026
        </div>
      </footer>
    </main>
  )
}
