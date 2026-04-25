import { Suspense } from 'react'
import VerifyLoginClient from './verify-login-client'

export default function VerifyLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading login verification...
        </div>
      </div>
    }>
      <VerifyLoginClient />
    </Suspense>
  )
}

