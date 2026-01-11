'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { AnalyticsData } from '@/types/analytics'
import type {
  CreateReportRequest,
  CreateReportResponse,
  VerifyReportResponse,
} from '@/types/report'

interface UseReportState {
  isGenerating: boolean
  isVerifying: boolean
  error: string | null
  generatedReport: CreateReportResponse | null
  verifiedReport: VerifyReportResponse | null
}

export function useReport() {
  const { publicKey } = useWallet()
  const [state, setState] = useState<UseReportState>({
    isGenerating: false,
    isVerifying: false,
    error: null,
    generatedReport: null,
    verifiedReport: null,
  })

  const generateReport = async (
    analytics: AnalyticsData,
    request: CreateReportRequest
  ): Promise<CreateReportResponse | null> => {
    if (!publicKey) {
      setState((prev) => ({ ...prev, error: 'Wallet not connected' }))
      return null
    }

    setState((prev) => ({ ...prev, isGenerating: true, error: null }))

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          analytics,
          request,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate report')
      }

      const data: CreateReportResponse = await response.json()

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedReport: data,
        error: null,
      }))

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report'
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }))
      return null
    }
  }

  const verifyReport = async (reportId: string): Promise<VerifyReportResponse | null> => {
    setState((prev) => ({ ...prev, isVerifying: true, error: null }))

    try {
      const response = await fetch('/api/report/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to verify report')
      }

      const data: VerifyReportResponse = await response.json()

      setState((prev) => ({
        ...prev,
        isVerifying: false,
        verifiedReport: data,
        error: null,
      }))

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify report'
      setState((prev) => ({
        ...prev,
        isVerifying: false,
        error: errorMessage,
      }))
      return null
    }
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  return {
    ...state,
    generateReport,
    verifyReport,
    clearError,
  }
}
