import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoDB'
import { sendEmailVerificationCode } from '@/lib/mailer'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstname, lastname, email, phone, address, password } = body


    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
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

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

// Create user document with role
    const userDoc = {
      firstname,
      lastname,
      email: email.toLowerCase(),
      phone: phone || '',
      address: address || '',
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      isLoginVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert user into database
    const result = await usersCollection.insertOne(userDoc)

    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Generate 6-digit verification code
    const code = generateCode()

    // Store verification token in the USER document (instead of in-memory)
    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          emailVerificationCode: code,
          emailVerificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
          updatedAt: new Date(),
        },
      }
    )

    // Send verification email
    const emailSent = await sendEmailVerificationCode(email, code)

    // Requirement: always redirect the user to email verification page after registration,
    // even if email sending fails (client will show correct status). Do NOT block creation.
    if (emailSent !== true) {
      console.error(
        `❌ Failed to send verification email to ${email.toLowerCase()}. sendEmailVerificationCode returned: ${emailSent}`
      )
      return NextResponse.json({
        success: true,
        message: 'Account created! Please verify your email (check inbox/spam).',
        email: email.toLowerCase(),
        emailSent: false,
      })
    }

    console.log(`✅ User signed up: ${email}. Verification code stored + email sent.`)

    return NextResponse.json({
      success: true,
      message: 'Account created! Please verify your email.',
      email: email.toLowerCase(),
      emailSent: true,
    })


  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
