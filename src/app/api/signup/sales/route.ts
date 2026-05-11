import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoDB'
import { sendWelcomeEmailWithDefaultPassword } from '@/lib/welcome-mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstname, lastname, email, phone, address } = body

    // Validate required fields (no password in request body)
    if (!firstname || !lastname || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Generate a default password for sales
    const defaultPassword = `Sales@${Math.random().toString(36).slice(2, 8)}`
    const hashedPassword = await bcrypt.hash(defaultPassword, 12)

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

    // Create sales user document (login verification is handled during login)
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
      loginVerificationCode: null,
      loginCodeExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(userDoc)

    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create sales user' },
        { status: 500 }
      )
    }

    // Send welcome email containing the default password
    const emailSent = await sendWelcomeEmailWithDefaultPassword({
      email,
      firstname,
      lastname,
      role: 'sales',
      defaultPassword,
    })

    if (!emailSent) {
      console.error('Failed to send welcome email with default password')
      // Don't fail signup if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Sales account created! Check your email for your default password.',
      email: email.toLowerCase(),
    })
  } catch (error) {
    console.error('Sales signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

