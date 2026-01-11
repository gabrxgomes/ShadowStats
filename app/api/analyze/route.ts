import { NextRequest, NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { z } from 'zod'
import { parseSwapTransaction } from '@/lib/helius/parser'
import { calculateAnalytics } from '@/lib/utils/analytics'
import { getSupabaseServer } from '@/lib/supabase/server'
import type { ParsedSwap, TransactionWithMetadata } from '@/types/analytics'

const analyzeSchema = z.object({
  wallet: z.string().min(32).max(44),
  limit: z.number().min(1).max(1000).default(100),
  refresh: z.boolean().default(false),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { wallet, limit, refresh } = analyzeSchema.parse(body)

    // Verify wallet address format
    try {
      new PublicKey(wallet)
    } catch {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Check cache first if not refresh
    if (!refresh) {
      const supabase = getSupabaseServer()
      const { data: cachedData } = await supabase
        .from('analytics_cache')
        .select('*')
        .eq('user_id', wallet)
        .gte('valid_until', new Date().toISOString())
        .single()

      if (cachedData) {
        return NextResponse.json({
          analytics: cachedData.analytics_data,
          cached: true,
          analyzedAt: cachedData.cached_at,
        })
      }
    }

    // Fetch transactions from Helius Enhanced API
    const apiKey = process.env.HELIUS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Helius API key not configured' }, { status: 500 })
    }

    let allTransactions: TransactionWithMetadata[] = []

    try {
      // Call Helius Enhanced Transactions API directly
      const url = `https://api-mainnet.helius-rpc.com/v0/addresses/${wallet}/transactions?api-key=${apiKey}&limit=${limit}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        allTransactions = data as TransactionWithMetadata[]
      }
    } catch (error) {
      console.error('Helius API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch transaction data' },
        { status: 500 }
      )
    }

    // Parse swap transactions
    const swaps: ParsedSwap[] = []
    for (const tx of allTransactions) {
      const swap = parseSwapTransaction(tx, wallet)
      if (swap) {
        swaps.push(swap)
      }
    }

    // Calculate analytics
    const analytics = calculateAnalytics(swaps)

    // Cache the results
    const supabase = getSupabaseServer()
    const validUntil = new Date()
    validUntil.setHours(validUntil.getHours() + 1) // Cache for 1 hour

    await supabase.from('analytics_cache').upsert({
      user_id: wallet,
      cached_at: new Date().toISOString(),
      valid_until: validUntil.toISOString(),
      tx_count: allTransactions.length,
      last_tx_signature: allTransactions[0]?.signature || '',
      analytics_data: analytics,
    })

    return NextResponse.json({
      analytics,
      cached: false,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
