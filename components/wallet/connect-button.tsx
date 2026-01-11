'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function ConnectButton(): JSX.Element {
  const { connected, publicKey } = useWallet()

  if (!connected) {
    return (
      <div className="wallet-adapter-button-trigger">
        <WalletMultiButton className="!bg-gradient-solana !text-bg-primary !font-semibold !rounded-lg !px-6 !py-3 hover:!shadow-glow-green hover:!-translate-y-0.5 !transition-all !duration-200" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border rounded-lg">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-sm text-text-secondary font-mono">
          {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
        </span>
      </div>
      <WalletMultiButton className="!bg-bg-tertiary !text-text-primary !border !border-border !font-medium !rounded-lg !px-4 !py-2 hover:!border-primary-400 hover:!text-primary-400 !transition-all !duration-200" />
    </div>
  )
}
