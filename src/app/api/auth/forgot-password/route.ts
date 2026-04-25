import { NextRequest, NextResponse } from 'next/server'
import { MockUser } from '@/lib/auth-mock'
import { users, resetTokens } from '../../../../lib/auth-mock'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    const user = users.find((u: MockUser) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    resetTokens[token] = email

    // Send real reset email\n    const mailer = await import('@/lib/mailer');\n    const sent = await mailer.sendPasswordResetCode(email, token);\n    if (!sent) {\n      console.error('Failed to send reset email');\n      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });\n    }

    return NextResponse.json({ success: true, message: 'Reset link sent to email' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
