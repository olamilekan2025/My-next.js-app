import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendLoginVerificationCode } from './mailer'
import type { User } from 'next-auth'

// Extend User type for module augmentation
declare module 'next-auth' {
  interface User {
    firstname: string
    lastname: string
    phone?: string
    address?: string
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      firstname: string
      lastname: string
    }
  }
}

export interface MockUser {
  id: string
  firstname: string
  lastname: string
  email: string
  phone?: string
  address?: string
  password: string
  termsAgreed: boolean
}

// Shared state: token -> email mapping
export const resetTokens: Record<string, string> = {}

const hashedPassword = bcrypt.hashSync('password123', 10)
export const users: MockUser[] = [
  {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    password: hashedPassword,
    termsAgreed: true
  }
]

export const loginTokens: Record<string, {email: string, code: string, expires: Date}> = {}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generateToken(): string {
  return require('crypto').randomBytes(32).toString('hex')
}

export async function sendLoginCode(email: string): Promise<string | null> {
  const user = users.find((u): u is MockUser => u.email === email)
  if (!user) return null

  const code = generateCode()
  const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  loginTokens[email] = { email, code, expires }

  const sent = await sendLoginVerificationCode(email, code)
  if (!sent) {
    delete loginTokens[email]
    return null
  }

  return email // Return email as 'token' for consistency, though not used

}

export function verifyLoginToken(email: string, inputCode: string): boolean {
  const data = loginTokens[email]
  if (!data) return false

  if (new Date() > data.expires) {
    delete loginTokens[email]
    return false
  }

  if (data.code !== inputCode) return false

  delete loginTokens[email]
  return true
}

export function cleanupExpiredTokens() {
  for (const email in loginTokens) {
    if (new Date() > loginTokens[email].expires) {
      delete loginTokens[email]
    }
  }
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  const user = users.find((u): u is MockUser => u.email === email)
  if (!user) return false

  user.password = await bcrypt.hash(newPassword, 10)
  return true
}
