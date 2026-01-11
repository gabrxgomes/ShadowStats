import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { verifyReportCommitment, isReportExpired } from '@/lib/utils/report'
import type { PrivacyReport, VerifyReportResponse } from '@/types/report'

const verifyReportSchema = z.object({
  reportId: z.string().uuid(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { reportId } = verifyReportSchema.parse(body)

    // Fetch report from Supabase
    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error || !data) {
      const response: VerifyReportResponse = {
        valid: false,
        report: null,
        verifiedAt: new Date().toISOString(),
        message: 'Report not found',
      }
      return NextResponse.json(response, { status: 404 })
    }

    const report = data.report_data as PrivacyReport

    // Verify commitment integrity
    const commitmentValid = verifyReportCommitment(report)

    if (!commitmentValid) {
      const response: VerifyReportResponse = {
        valid: false,
        report: null,
        verifiedAt: new Date().toISOString(),
        message: 'Report commitment verification failed',
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check expiration
    const expired = isReportExpired(report)

    if (expired) {
      const response: VerifyReportResponse = {
        valid: false,
        report,
        verifiedAt: new Date().toISOString(),
        message: 'Report has expired',
      }
      return NextResponse.json(response, { status: 410 })
    }

    // Increment view count
    await supabase
      .from('reports')
      .update({ view_count: data.view_count + 1 })
      .eq('id', reportId)

    const response: VerifyReportResponse = {
      valid: true,
      report,
      verifiedAt: new Date().toISOString(),
      message: 'Report verified successfully',
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Report verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
