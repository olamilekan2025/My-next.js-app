import { NextRequest, NextResponse } from 'next/server'
import { sendLoginCode, verifyLoginToken, cleanupExpiredTokens, loginTokens } from '@/lib/auth-mock'


export async function POST(request: NextRequest) {
  try {
    cleanupExpiredTokens()

    const { action, email, code } = await request.json()

    if (action === 'verify') {
      if (!email || !code || code.length !== 6) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
      }

      const isValid = verifyLoginToken(email, code)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
      }

      return NextResponse.json({ success: true, message: 'Login verified successfully' })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Verify login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
