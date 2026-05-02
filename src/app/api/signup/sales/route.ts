import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoDB'
import { sendLoginVerificationCode } from '@/lib/mailer'

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

    // Generate 6-digit login verification code
    const code = generateCode()

    // Create user document with sales role
    const userDoc = {
      firstname,
      lastname,
      email: email.toLowerCase(),
      phone: phone || '',
      address: address || '',
      password: hashedPassword,
      role: 'sales',
      isEmailVerified: true, // Sales doesn't need email verification
      isLoginVerified: false,
      loginVerificationCode: code,
      loginCodeExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert user into database
    const result = await usersCollection.insertOne(userDoc)

    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create sales user' },
        { status: 500 }
      )
    }

    // Send login verification email
    const emailSent = await sendLoginVerificationCode(email, code)
    if (!emailSent) {
      console.error('Failed to send login verification email')
      // Don't fail signup if email fails, just log error
    }

    console.log(`✅ Sales signed up: ${email}, login code: ${code}`)

    return NextResponse.json({
      success: true,
      message: 'Sales account created! Please verify your login.',
      email: email.toLowerCase()
    })

  } catch (error) {
    console.error('Sales signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
