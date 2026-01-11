import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { createPrivacyReport } from '@/lib/utils/report'
import type { AnalyticsData } from '@/types/analytics'
import type { CreateReportRequest, CreateReportResponse } from '@/types/report'

const generateReportSchema = z.object({
  wallet: z.string().min(32).max(44),
  analytics: z.object({
    totalVolume: z.number(),
    tradeCount: z.number(),
    winRate: z.number(),
    profitLoss: z.number(),
    avgTradeSize: z.number(),
    tradingDays: z.number(),
    topTokens: z.array(
      z.object({
        mint: z.string(),
        symbol: z.string(),
        volume: z.number(),
        trades: z.number(),
      })
    ),
    recentTrades: z.array(z.any()),
  }),
  request: z.object({
    includeVolume: z.boolean(),
    includeTradeCount: z.boolean(),
    includeWinRate: z.boolean(),
    includeProfitLoss: z.boolean(),
    includeTopTokens: z.boolean(),
    revealWallet: z.boolean(),
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    expiresInDays: z.number().min(1).max(365).optional(),
    rangeVariation: z.number().min(0).max(50).optional(),
  }),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { wallet, analytics, request: reportRequest } = generateReportSchema.parse(body)

    // Create privacy report
    const report = createPrivacyReport(
      analytics as AnalyticsData,
      reportRequest as CreateReportRequest,
      wallet
    )

    // Store report in Supabase
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from('reports')
      .insert({
        user_id: wallet,
        report_data: report,
        commitment_hash: report.proof.commitment,
        expires_at: report.metadata.expiresAt,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 })
    }

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/report/${data.id}`

    const response: CreateReportResponse = {
      report,
      reportId: data.id,
      shareUrl,
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
