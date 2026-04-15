"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, Home, Info, Package, Mail, UserCircle, LogOut, LogIn } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <header className="container mx-auto sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl px-4 lg:px-22">
      <div className="container mx-auto flex h-16 items-center justify-between md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-primary">
          MyProduct
        </Link>
        <nav className="hidden md:flex items-center">
          <Link
            href="/about"
            className={cn(
              "group/nav-item flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
              pathname === '/about' && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <Info className="h-4 w-4" aria-hidden />
            About
          </Link>
          <Link
            href="/products"
            className={cn(
              "group/nav-item flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
              pathname === '/products' && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <Package className="h-4 w-4" aria-hidden />
            Products
          </Link>
          <Link
            href="/contact"
            className={cn(
              "group/nav-item flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
              pathname === '/contact' && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact
          </Link>
          <div className="ml-4 flex items-center gap-2">
            {status === 'authenticated' ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="h-9 px-3">
                <UserCircle className="h-5 w-5 mr-2" />
                {session?.user?.firstname} {session?.user?.lastname?.slice(0,1)}.
              </Button>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-primary/5">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="h-9">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="h-screen">
            <DropdownMenuItem className={pathname === '/' ? 'bg-accent text-accent-foreground' : ''} asChild>
              <Link href="/" className="flex w-full items-center gap-2">
                <Home className="h-4 w-4 mr-2" aria-hidden />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={pathname === '/about' ? 'bg-accent text-accent-foreground' : ''} asChild>
              <Link href="/about" className="flex w-full items-center gap-2">
                <Info className="h-4 w-4 mr-2" aria-hidden />
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={pathname === '/about' ? 'bg-accent text-accent-foreground' : ''} asChild>
              <Link href="/products" className="flex w-full items-center gap-2">
                <Package className="h-4 w-4 mr-2" aria-hidden />
                Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className={pathname === '/contact' ? 'bg-accent text-accent-foreground' : ''} asChild>
              <Link href="/contact" className="flex w-full items-center gap-2">
                <Mail className="h-4 w-4 mr-2" aria-hidden />
                Contact
              </Link>
            </DropdownMenuItem>
            {status === 'authenticated' ? (
              <DropdownMenuItem className="bg-accent text-accent-foreground" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" aria-hidden />
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="flex w-full items-center gap-2">
                  <LogIn className="h-4 w-4 mr-2" aria-hidden />
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

