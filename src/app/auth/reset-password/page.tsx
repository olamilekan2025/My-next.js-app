import ResetPasswordClient from "./reset-password-client"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading reset password form...
        </div>
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  )
}

