import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoDB'
import { sendEmailVerificationCode } from '@/lib/mailer'

// In-memory store for email verification codes
const verificationCodes: Record<string, { code: string; expires: Date }> = {}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store verification code (exported for use by signup route)
export function storeVerificationCode(email: string, code: string): void {
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  verificationCodes[email.toLowerCase()] = { code, expires }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, code } = body

    // Connect to MongoDB
    const connected = await connectDB()
    if (!connected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const { client } = global.mongo!
    const db = client.db()
    const usersCollection = db.collection('users')

if (action === 'verify') {
      if (!email || !code || code.length !== 6) {
        return NextResponse.json(
          { error: 'Invalid input. Email and 6-digit code required.' },
          { status: 400 }
        )
      }

      const data = verificationCodes[email.toLowerCase()]
      if (!data) {
        return NextResponse.json(
          { error: 'No verification code found. Please request a new code.' },
          { status: 400 }
        )
      }

      // Check if code expired
      if (new Date() > data.expires) {
        delete verificationCodes[email.toLowerCase()]
        return NextResponse.json(
          { error: 'Verification code expired. Please request a new code.' },
          { status: 400 }
        )
      }

      // Verify code
      if (data.code !== code) {
        return NextResponse.json(
          { error: 'Invalid verification code.' },
          { status: 400 }
        )
      }

      // Code is valid - mark email as verified in database
      const result = await usersCollection.updateOne(
        { email: email.toLowerCase() },
        { $set: { isEmailVerified: true, updatedAt: new Date() } }
      )

      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'User not found.' },
          { status: 404 }
        )
      }

      // Clean up used code
      delete verificationCodes[email.toLowerCase()]

      console.log(`✅ Email verified: ${email}`)

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully!'
      })

    } else if (action === 'resend') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required.' },
          { status: 400 }
        )
      }
      
      // Check if user exists
      const user = await usersCollection.findOne({ email: email.toLowerCase() })
      if (!user) {
        return NextResponse.json(
          { error: 'User not found.' },
          { status: 404 }
        )
      }

      // Check if already verified
      if (user.isEmailVerified) {
        return NextResponse.json(
          { error: 'Email is already verified.' },
          { status: 400 }
        )
      }

      // Generate new code
      const newCode = generateCode()
      const expires = new Date(Date.now() + 10 * 60 * 1000)

      // Store new verification code
      verificationCodes[email.toLowerCase()] = { code: newCode, expires }

      // Send verification email
      await sendEmailVerificationCode(email, newCode)

      console.log(`✅ New verification code sent to: ${email}`)

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email.'
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "verify" or "resend".' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export store function for external use
export { verificationCodes }
