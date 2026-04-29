import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { users } from '@/lib/auth-mock'
import { sendLoginCode } from '@/lib/auth-mock'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Send verification code
    const token = await sendLoginCode(email)
    if (!token) {
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Login initiated. Check your email for verification code.',
      email 
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

