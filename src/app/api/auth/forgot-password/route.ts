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
    resetTokens[email] = token

    // Mock email send
    console.log(`🔐 Password reset token for ${email}: ${token}`)
    console.log(`In production, send email with reset link: /auth/reset-password?token=${token}`)

    return NextResponse.json({ success: true, message: 'Reset link sent to email' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
