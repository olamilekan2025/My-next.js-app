import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoDB'

export async function POST(request: NextRequest) {
  try {
    const { action, email, code } = await request.json()

    if (action === 'verify') {
      if (!email || !code || code.length !== 6) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
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

      // Check if user has login verification code
      if (!user.loginVerificationCode || !user.loginCodeExpires) {
        return NextResponse.json({ error: 'No verification code found. Please login first.' }, { status: 400 })
      }

      // Check if code expired
      if (new Date() > new Date(user.loginCodeExpires)) {
        return NextResponse.json({ error: 'Verification code expired. Please login again.' }, { status: 400 })
      }

      // Verify code matches
      if (user.loginVerificationCode !== code) {
        return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 })
      }

      // Code is valid - update isLoginVerified
      await usersCollection.updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            isLoginVerified: true,
            loginVerificationCode: null,
            loginCodeExpires: null,
            updatedAt: new Date()
          }
        }
      )

      console.log(`✅ Login verified for: ${email}, role: ${user.role}`)

      return NextResponse.json({ 
        success: true, 
        message: 'Login verified successfully!',
        role: user.role 
      })

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Verify login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
