import { NextRequest, NextResponse } from 'next/server'
import { storeVerificationCode } from '../../verify-email/route'
import { sendEmailVerificationCode } from '@/lib/mailer'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate new code
    const newCode = generateCode()
    
    // Store the code using the verify-email route's function (shared store)
    storeVerificationCode(email, newCode)

    // Send verification email directly
    await sendEmailVerificationCode(email, newCode)

    console.log(`✅ New verification code sent to: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email'
    })

  } catch (error) {
    console.error('Resend email verification code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
