'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface WalletAuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useWalletAuth() {
  const { connected, publicKey, signMessage } = useWallet()
  const [authState, setAuthState] = useState<WalletAuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (connected && publicKey) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [connected, publicKey])

  const authenticate = async (): Promise<boolean> => {
    if (!publicKey || !signMessage) {
      setAuthState((prev) => ({
        ...prev,
        error: 'Wallet not connected',
      }))
      return false
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Create message to sign
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with ShadowStats.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      )

      // Request signature
      const signature = await signMessage(message)

      // TODO: Send signature to backend for verification
      // For now, just return true
      console.log('Signature:', signature)

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      })
      return false
    }
  }

  return {
    ...authState,
    authenticate,
    walletAddress: publicKey?.toBase58() || null,
  }
}
