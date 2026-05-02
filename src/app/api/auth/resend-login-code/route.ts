import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoDB'
import { sendLoginVerificationCode } from '@/lib/mailer'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Connect to MongoDB
    const connected = await connectDB()
    if (!connected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { client } = global.mongo!
    const db = client.db()
    const usersCollection = db.collection('users')

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate new login verification code
    const code = generateCode()

    // Update user with new login code
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { 
        $set: { 
          loginVerificationCode: code,
          loginCodeExpires: new Date(Date.now() + 5 * 60 * 1000),
          updatedAt: new Date()
        }
      }
    )

    // Send login verification email
    const emailSent = await sendLoginVerificationCode(email, code)
    if (!emailSent) {
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

