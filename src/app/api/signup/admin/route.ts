import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoDB'
import { sendWelcomeEmailWithDefaultPassword } from '@/lib/welcome-mailer'

export async function POST(request: NextRequest) {
  try {
    // Parse body defensively (some clients may omit/incorrectly set content-type)
    let body: Record<string, unknown> = {}
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        throw new Error('Invalid JSON body')
      }
    }


    const { firstname, lastname, email, phone, address } = body

    const firstnameStr = typeof firstname === 'string' ? firstname : ''
    const lastnameStr = typeof lastname === 'string' ? lastname : ''
    const emailStr = typeof email === 'string' ? email : ''

    const phoneStr = typeof phone === 'string' ? phone : ''
    const addressStr = typeof address === 'string' ? address : ''

    const firstnameTrimmed = firstnameStr.trim()
    const lastnameTrimmed = lastnameStr.trim()
    const emailTrimmed = emailStr.trim()

    const normalizedEmail = emailTrimmed.toLowerCase()




    // Validate required fields (no password in request body)
    if (!firstnameTrimmed || !lastnameTrimmed || !emailTrimmed) {

      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }


    // Generate a default password for admin
    const defaultPassword = `Admin@${Math.random().toString(36).slice(2, 8)}`
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

    // Connect to MongoDB
    const connected = await connectDB()
    if (!connected) {
      // Avoid leaking secrets (we don't include MONGODB_URI), but provide actionable hints.
      const hasMongoUri = Boolean(process.env.MONGODB_URI)

      return NextResponse.json(
        {
          error: hasMongoUri
            ? 'Database connection failed (MongoDB Atlas unreachable). Check your Atlas IP allowlist and cluster credentials.'
            : 'Database connection failed: missing MONGODB_URI. Ensure your .env.local has a valid MONGODB_URI and restart the dev server.'
        },
        { status: 500 }
      )
    }

    const { client } = global.mongo!
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail })
    if (existingUser) {

      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create admin user document (login verification is handled during login)
    const userDoc = {
      firstname: firstnameTrimmed,
      lastname: lastnameTrimmed,
      email: normalizedEmail,
      phone: phoneStr,
      address: addressStr,

      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true, // Admin doesn't need email verification
      isLoginVerified: false,
      loginVerificationCode: null,
      loginCodeExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(userDoc)

    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    // Send welcome email containing the default password
    const emailSent = await sendWelcomeEmailWithDefaultPassword({
      email: normalizedEmail,
      firstname: firstnameTrimmed,
      lastname: lastnameTrimmed,
      role: 'admin',
      defaultPassword,
    })


    if (!emailSent) {
      console.error('Failed to send welcome email with default password')
      // Don't fail signup if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created! Check your email for your default password.',
      email: normalizedEmail,

    })
  } catch (error) {
    console.error('Admin signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

