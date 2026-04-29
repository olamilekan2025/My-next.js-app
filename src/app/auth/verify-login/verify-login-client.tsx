"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Loader2, Shield, CheckCircle, ArrowLeft } from 'lucide-react'

export default function VerifyLoginClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [email, setEmail] = useState('') // Internal for API

  const maskedEmail = email ? email.replace(/^(.{2}).*@/, '$1***@') : ''

  useEffect(() => {
    const urlEmail = searchParams.get('email')
    if (urlEmail) setEmail(urlEmail)
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: token })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage('Login token verified! Redirecting...')
        setTimeout(() => router.push('/'), 2000)
      } else {
        setError(data.error || 'Verification failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    if (!email) return

    setResending(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/resend-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage('New token sent to your email.')
      } else {
        setError(data.error || 'Resend failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }

    setResending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-card/80 backdrop-blur-xl p-8">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl">Login Token</CardTitle>
          <CardDescription className="text-lg">
            Enter the 6-digit code to complete login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 text-center flex items-center gap-2 justify-center">
              <CheckCircle className="h-5 w-5" />
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Sent to:</p>
              <p className="font-mono text-sm">{maskedEmail}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-medium">
                Login Token
              </Label>
              <InputOTPGroup>
                <InputOTP maxLength={6} value={token} onChange={setToken}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={1} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={2} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={4} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </InputOTPGroup>
              <p className="text-xs text-muted-foreground text-center">
                Didn't receive token? <Button variant="link" size="sm" type="button" onClick={handleResend} disabled={resending || isLoading || !email} className="h-5 px-0 p-0 h-auto">Resend</Button>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading || token.length < 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Confirm Login
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

