import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoDB'
import { sendLoginVerificationCode } from '@/lib/mailer'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
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
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const userRole = user.role || 'user'

    // Check role-based verification requirements
    if (userRole === 'user') {
      // Regular users must verify email first before login
      if (!user.isEmailVerified) {
        return NextResponse.json({ 
          error: 'Please verify your email before logging in.',
          needsEmailVerification: true 
        }, { status: 403 })
      }
    }

    // For admin and sales, send login verification code
    if (userRole === 'admin' || userRole === 'sales') {
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
        message: 'Login initiated. Check your email for verification code.',
        email,
        role: userRole
      })
    }

    // For regular users with verified email, allow direct login or send code
    // Following the requirement - only admin/sales verify login
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful!',
      email,
      role: userRole,
      isEmailVerified: user.isEmailVerified
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

