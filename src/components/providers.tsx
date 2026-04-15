'use client'

import { SessionProvider } from 'next-auth/react'
import { Header } from './header-client'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <Header />
      {children}
    </SessionProvider>
  )
}
