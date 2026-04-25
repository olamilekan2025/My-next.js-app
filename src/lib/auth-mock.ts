import bcrypt from 'bcryptjs'
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

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  const user = users.find((u): u is MockUser => u.email === email)
  if (!user) return false

  user.password = await bcrypt.hash(newPassword, 10)
  return true
}
