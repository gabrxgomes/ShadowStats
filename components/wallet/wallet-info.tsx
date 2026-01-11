'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export function WalletInfo(): JSX.Element | null {
  const { connected, publicKey, wallet } = useWallet()

  if (!connected || !publicKey) {
    return null
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {wallet?.adapter.icon && (
          <Image
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex-1">
          <p className="text-sm text-text-secondary">Connected Wallet</p>
          <p className="font-mono text-text-primary">{wallet?.adapter.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Address</p>
          <p className="font-mono text-sm text-text-primary">
            {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
          </p>
        </div>
      </div>
    </Card>
  )
}
