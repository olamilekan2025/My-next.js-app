import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#3C83F6] to-white py-2 lg:py-20 text-center lg:bg-red-400  ">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Welcome to My Product
          </h1>
          <p className="mx-auto max-w-2xl text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Transform your business with our innovative solutions. Powerful tools designed for modern teams.
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 h-12">
              Explore Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-0 lg:px-0 py-20 ">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Discover our top products that drive results
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Analytics Pro</CardTitle>
              <CardDescription>Advanced analytics for data-driven decisions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Real-time dashboards
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Team collaboration
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  AI insights
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-5 border-t">
              <Link href="/products">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details →
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Team CRM</CardTitle>
              <CardDescription>Manage customer relationships effortlessly.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Contact management
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Sales pipeline
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Automation workflows
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-5 border-t">
              <Link href="/products">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details →
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">Automation Hub</CardTitle>
              <CardDescription>Automate your workflows with ease.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  No-code builder
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  100+ integrations
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Enterprise ready
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-5 border-t">
              <Link href="/products">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details →
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}

