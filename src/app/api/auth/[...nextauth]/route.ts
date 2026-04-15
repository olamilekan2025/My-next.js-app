import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import type { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { MockUser } from '@/lib/auth-mock'
import { users, resetTokens } from '../../../../lib/auth-mock'


// Extend User type for module augmentation (moved to mock-data.ts)
declare module 'next-auth/jwt' {
  interface JWT {
    firstname?: string
    lastname?: string
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = users.find((u): u is MockUser => u.email === credentials.email as string)
        if (!user) return null

        const isValidPassword = await bcrypt.compare(credentials.password as string, user.password)
        if (!isValidPassword) return null

        // Return only User type properties
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      }
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstname = (user as any).firstname as string
        token.lastname = (user as any).lastname as string
      }
      return token
    },
    async session({ session, token }) {
      if (token?.firstname && token?.lastname) {
        session.user.id = token.sub as string
        ;(session.user as any).firstname = token.firstname
        ;(session.user as any).lastname = token.lastname
      }
      return session
    }
  }
} satisfies NextAuthOptions)

export { handler as GET, handler as POST }

