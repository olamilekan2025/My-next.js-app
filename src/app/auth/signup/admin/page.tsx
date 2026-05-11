'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Check, Eye, EyeOff, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminSignupForm {
  firstname: string
  lastname: string
  email: string
  phone: string
  address: string
  // API doesn't require a password; this is just UX gating.
  termsAgreed: boolean
}

export default function AdminSignupAdminPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<AdminSignupForm>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    termsAgreed: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showInfo, setShowInfo] = useState(false)

  const updateFormData = (field: keyof AdminSignupForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error || success) {
      setError('')
      setSuccess('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!formData.termsAgreed) {
      setError('You must agree to the policy')
      return
    }

    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim()) {
      setError('First name, last name, and email are required')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/signup/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error || 'Admin signup failed')
        return
      }

      setSuccess(data?.message || 'Admin account created!')
      // Optional: go to login after a moment
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } catch {
      setError('Admin signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-3">
      <Card className="w-full max-w-md border-0 bg-card/80 backdrop-blur-xl p-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Admin registration</CardTitle>
          <CardDescription className="text-sm">Create an admin account (default password is emailed)</CardDescription>
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

          <div className="text-sm text-muted-foreground text-center">
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-primary hover:bg-transparent"
              onClick={() => setShowInfo((s) => !s)}
            >
              {showInfo ? (
                <>
                  Hide info <EyeOff className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  What happens next? <Eye className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {showInfo && (
              <p className="mt-2">
                The server creates the admin user and generates a default password (no password field needed here).
              </p>
            )}
          </div>

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
                placeholder="admin@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address (optional)
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAgreed}
                onCheckedChange={(checked) => updateFormData('termsAgreed', !!checked)}
              />
              <Label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the{' '}
                <Link href="/policy" className="text-primary hover:underline">
                  policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full h-10 text-lg" disabled={isLoading || !formData.termsAgreed}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating admin...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Create admin
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

