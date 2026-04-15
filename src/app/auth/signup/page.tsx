'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User, Mail, Phone, MapPin, Lock, Check, Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface SignupForm {
  firstname: string
  lastname: string
  email: string
  phone: string
  address: string
  password: string
  termsAgreed: boolean
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupForm>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    termsAgreed: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.termsAgreed) {
      setError('You must agree to the terms and policy')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Mock signup - in real app, POST to /api/signup
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess('Account created! Please sign in.')
        // Auto sign in
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })
        window.location.href = '/'
      } else {
        setError('Signup failed. Email may already exist.')
      }
    } catch (err) {
      setError('Signup failed. Please try again.')
    }

    setIsLoading(false)
  }

  const updateFormData = (field: keyof SignupForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error || success) {
      setError('')
      setSuccess('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-3">
      <Card className="w-full max-w-md  border-0 bg-card/80 backdrop-blur-xl p-10">
        <CardHeader className="text-center space-y-2">
          {/* <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div> */}
          <CardTitle className="text-3xl">Create account</CardTitle>
          <CardDescription className="text-sm">
            Join us today with your details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={(e) => updateFormData('firstname', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => updateFormData('lastname', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className={!showPassword ? "h-5 w-5" : "hidden"} />
                  <EyeOff className={showPassword ? "h-5 w-5" : "hidden"} />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAgreed}
                onCheckedChange={(checked) => updateFormData('termsAgreed', !!checked)}
              />
              <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full h-10 text-lg" disabled={isLoading || !formData.termsAgreed}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

