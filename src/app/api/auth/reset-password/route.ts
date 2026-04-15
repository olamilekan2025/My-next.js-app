import { NextRequest, NextResponse } from 'next/server'
import {  resetTokens , resetPassword,} from '../../../../lib/auth-mock'

export async function POST(request: NextRequest) {
  try {
    const { token, email, newPassword } = await request.json()

    const savedToken = resetTokens[email]
    if (!savedToken || savedToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const success = await resetPassword(email, newPassword)
    if (success) {
      // Clear token
      delete resetTokens[email]
      return NextResponse.json({ success: true, message: 'Password reset successful' })
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
