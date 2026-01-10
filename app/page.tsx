export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-solana bg-clip-text text-transparent">
          ShadowStats
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Privacy-First Trading Analytics for Solana
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Private</h3>
            <p className="text-text-secondary text-sm">
              Analyze trading performance without exposing your wallet address
            </p>
          </div>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Verifiable</h3>
            <p className="text-text-secondary text-sm">
              Generate ZK proofs of your performance using Light Protocol
            </p>
          </div>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-primary-400">Powerful</h3>
            <p className="text-text-secondary text-sm">
              Comprehensive analytics powered by Helius Enhanced APIs
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
