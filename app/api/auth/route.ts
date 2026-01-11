import { NextRequest, NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'

const authSchema = z.object({
  wallet: z.string().min(32).max(44),
  signature: z.string(),
  message: z.string(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { wallet, signature, message } = authSchema.parse(body)

    // Verify the wallet address format
    let publicKey: PublicKey
    try {
      publicKey = new PublicKey(wallet)
    } catch {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Decode signature and message
    const signatureUint8 = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    )
    const messageUint8 = new TextEncoder().encode(message)

    // Verify signature
    const verified = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKey.toBytes()
    )

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const supabase = getSupabaseServer()

    // Check if user exists, create if not
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', wallet)
      .single()

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          wallet_address: wallet,
          settings: {},
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        isNewUser: true,
      })
    }

    // Update last analysis timestamp
    await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', existingUser.id)

    return NextResponse.json({
      success: true,
      user: existingUser,
      isNewUser: false,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
