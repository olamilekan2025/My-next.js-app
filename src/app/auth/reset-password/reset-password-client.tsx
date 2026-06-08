"use client";

import { useState, useEffect } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Loader2,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

function ResetPasswordPage() {
  const searchParams =
    useSearchParams()

  const router = useRouter()

  const [email, setEmail] =
    useState("")

  const [code, setCode] =
    useState("")

  const [
    newPassword,
    setNewPassword,
  ] = useState("")

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  const [resending, setResending] =
    useState(false)

  const [
    resendCooldown,
    setResendCooldown,
  ] = useState(0)

  useEffect(() => {
    const urlEmail =
      searchParams.get("email") || ""

    if (urlEmail) {
      setEmail(urlEmail)
    }
  }, [searchParams])

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setError("")
    setMessage("")

    try {
      setIsLoading(true)

      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            newPassword,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.error ||
            "Reset failed"
        )

        return
      }

      setMessage(data.message)

      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      console.log(error)

      setError(
        "Network error. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)

      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.error ||
            "Failed to resend"
        )

        return
      }

      setMessage(
        "New reset code sent"
      )

      setResendCooldown(60)
    } catch (error) {
      console.log(error)

      setError("Network error")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/50">
      <Card className="w-full max-w-md p-8 border-0 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl">
            Reset Password
          </CardTitle>

          <CardDescription className="space-y-2">
            <p>
              Enter your reset code
              and new password
            </p>

            {email && (
              <div className="bg-primary/10 text-primary rounded-xl px-4 py-3 text-sm break-all">
                Reset code sent to:
                <br />
                <span className="font-semibold">
                  {email}
                </span>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-center">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="code">
                Reset Code
              </Label>

              <Input
                id="code"
                inputMode="numeric"
                pattern="\d{6}"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                maxLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                New Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="pr-12"
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm underline"
              disabled={
                resending ||
                resendCooldown > 0
              }
              onClick={handleResend}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend reset code"
              )}
            </Button>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Reset Password
                </>
              )}
            </Button>

            <Link
              href="/auth/login"
              className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage