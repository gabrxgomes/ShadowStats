'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ReportView } from '@/components/report/report-view'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { VerifyReportResponse } from '@/types/report'

export default function ReportPage(): JSX.Element {
  const params = useParams()
  const reportId = params.id as string

  const [report, setReport] = useState<VerifyReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyReport() {
      try {
        const response = await fetch('/api/report/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reportId }),
        })

        const data: VerifyReportResponse = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to verify report')
          setIsLoading(false)
          return
        }

        setReport(data)
        setIsLoading(false)
      } catch {
        setError('Failed to load report')
        setIsLoading(false)
      }
    }

    if (reportId) {
      verifyReport()
    }
  }, [reportId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold bg-gradient-solana bg-clip-text text-transparent">
                ShadowStats
              </h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-6 mb-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !report || !report.valid) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold bg-gradient-solana bg-clip-text text-transparent">
                ShadowStats
              </h1>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
            <p className="text-text-secondary mb-6">
              {error || report?.message || 'This report could not be verified or has expired.'}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-solana rounded-lg font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
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
          <Link
            href="/dashboard"
            className="text-sm text-primary-400 hover:underline"
          >
            View My Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="container mx-auto max-w-4xl">
          <ReportView
            report={report.report!}
            verified={report.valid}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-text-tertiary mb-4">
              Want to create your own privacy report?
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-solana rounded-lg font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Connect Your Wallet
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
