import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredTokens, sendLoginCode, loginTokens } from '@/lib/auth-mock'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    cleanupExpiredTokens()

    // Clean any existing login token for this email
    if (loginTokens[email]) {
      delete loginTokens[email]
    }

    const token = await sendLoginCode(email)
    if (!token) {
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'New verification code sent to your email' 
    })

  } catch (error) {
    console.error('Resend login code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

