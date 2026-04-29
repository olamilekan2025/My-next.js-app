import { NextRequest, NextResponse } from 'next/server'
import { users, resetTokens } from '../../../../lib/auth-mock'
import { sendPasswordResetCode } from '@/lib/mailer'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove any existing reset tokens for this email to avoid stale tokens
    Object.keys(resetTokens).forEach((key) => {
      if (resetTokens[key] === email) {
        delete resetTokens[key]
      }
    })

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex')
    resetTokens[token] = email

    // Send email
    const sent = await sendPasswordResetCode(email, token)
    if (!sent) {
      console.error('Failed to send reset email')
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Reset code sent to email' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

