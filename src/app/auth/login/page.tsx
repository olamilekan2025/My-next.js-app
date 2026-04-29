"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = `/auth/verify-login?email=${encodeURIComponent(email)}`;
      } else {
        setError(data.error || 'Login failed');
        window.location.href = '/';
      }
    } catch (err) {
      setError('Network error. Please try again.');
      window.location.href = '/';
    }

    setIsLoading(false);
  };

  return (
    <div className=" bg-gradient-to-br from-background to-muted/50 flex items-state justify-center p-5  ">
      <Card className=" w-full px-10 py-5  max-w-md  border-0 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl">Welcome back</CardTitle>
          <CardDescription className="text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="text-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-10 "
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-2 w-2  " />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-lg uppercase">
              <span className="bg-background px-4 text-xs">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            variant="outline"
            className="w-full h-10 gap-3 border-2 hover:bg-accent/50"
            disabled={isLoading}
          >
            <FcGoogle className="h-5 w-5" />
            Google
          </Button>

          <div className="text-center text-sm text-muted-foreground pt-4 ">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
