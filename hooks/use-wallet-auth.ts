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
      const messageText = `Sign this message to authenticate with ShadowStats.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      const message = new TextEncoder().encode(messageText)

      // Request signature from wallet
      const signature = await signMessage(message)

      // Convert signature to hex string
      const signatureHex = Array.from(signature)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      // Send to backend for verification
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          signature: signatureHex,
          message: messageText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Authentication failed')
      }

      const data = await response.json()

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })

      return data.success
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
