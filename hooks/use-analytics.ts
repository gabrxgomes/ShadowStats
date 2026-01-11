'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { AnalyticsData } from '@/types/analytics'

interface UseAnalyticsState {
  data: AnalyticsData | null
  isLoading: boolean
  error: string | null
  cached: boolean
}

export function useAnalytics() {
  const { publicKey, connected } = useWallet()
  const [state, setState] = useState<UseAnalyticsState>({
    data: null,
    isLoading: false,
    error: null,
    cached: false,
  })

  const fetchAnalytics = async (refresh = false) => {
    if (!publicKey || !connected) {
      setState((prev) => ({
        ...prev,
        error: 'Wallet not connected',
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          limit: 100,
          refresh,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const data = await response.json()

      setState({
        data: data.analytics,
        isLoading: false,
        error: null,
        cached: data.cached,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics'
      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
        cached: false,
      })
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchAnalytics()
    }
  }, [connected, publicKey])

  return {
    ...state,
    refetch: () => fetchAnalytics(true),
  }
}
