import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoDB'
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

    // Check if user exists
    const user = await usersCollection.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Store the new code and expiry
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          emailVerificationCode: newCode,
          emailVerificationExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      }
    )

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
