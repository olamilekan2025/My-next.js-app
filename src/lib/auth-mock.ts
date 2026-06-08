import { sendLoginVerificationCode } from "./mailer"
import bcrypt from "bcryptjs"
import { users } from "./auth-mock-users"

declare module "next-auth" {
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

export const resetCodes: Record<
  string,
  {
    code: string
    expires: Date
  }
> = {}

export const loginTokens: Record<
  string,
  {
    email: string
    code: string
    expires: Date
  }
> = {}

function generateCode(): string {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString()
}

export function normalizeEmail(
  email: string
): string {
  return email.trim().toLowerCase()
}

export async function sendLoginCode(
  email: string
): Promise<string | null> {
  const normalizedEmail =
    normalizeEmail(email)

  const code = generateCode()

  const expires = new Date(
    Date.now() + 5 * 60 * 1000
  )

  loginTokens[normalizedEmail] = {
    email: normalizedEmail,
    code,
    expires,
  }

  const sent =
    await sendLoginVerificationCode(
      normalizedEmail,
      code
    )

  if (!sent) {
    delete loginTokens[normalizedEmail]
    return null
  }

  return normalizedEmail
}

export function verifyLoginToken(
  email: string,
  inputCode: string
): boolean {
  const normalizedEmail =
    normalizeEmail(email)

  const data =
    loginTokens[normalizedEmail]

  if (!data) {
    return false
  }

  if (new Date() > data.expires) {
    delete loginTokens[normalizedEmail]
    return false
  }

  if (data.code !== inputCode) {
    return false
  }

  delete loginTokens[normalizedEmail]

  return true
}

export async function resetPassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  const normalizedEmail =
    normalizeEmail(email)

  const user = users.find(
    (u) =>
      normalizeEmail(u.email) ===
      normalizedEmail
  )

  if (!user) {
    return false
  }

  user.password = await bcrypt.hash(
    newPassword,
    10
  )

  return true
}

export function cleanupExpiredResetCodes(): void {
  Object.keys(resetCodes).forEach(
    (email) => {
      const record =
        resetCodes[email]

      if (
        record &&
        new Date() > record.expires
      ) {
        delete resetCodes[email]
      }
    }
  )
}

export function cleanupExpiredTokens(): void {
  Object.keys(loginTokens).forEach(
    (email) => {
      const token =
        loginTokens[email]

      if (
        token &&
        new Date() > token.expires
      ) {
        delete loginTokens[email]
      }
    }
  )
}