import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Zap, Users, Shield, BarChart3, Settings, Database, Activity, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

export default function Products() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gray-100 py-20 text-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-6">
            Our Products
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
            Powerful tools built for businesses that want to grow fast. Choose the perfect solution for your needs.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto lg:px-23">
          {/* Analytics Pro */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 h-full overflow-hidden bg-gradient-to-br from-card to-muted hover:shadow-primary/10">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 mb-6 mx-auto">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-center group-hover:text-primary transition-colors">Analytics Pro</CardTitle>
              <CardDescription className="text-center leading-relaxed">
                Unlock actionable insights from your data
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Real-time dashboards</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Activity className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Custom metrics & reports</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>AI-powered insights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full" asChild>
                <Link href="#pricing">
                  Get Started →
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Team CRM */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 h-full overflow-hidden bg-gradient-to-br from-card to-muted hover:shadow-primary/10">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 mb-6 mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-center group-hover:text-primary transition-colors">Team CRM</CardTitle>
              <CardDescription className="text-center leading-relaxed">
                Manage relationships at scale
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Package className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Centralized contacts</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Sales pipeline tracking</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Workflow automation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full" asChild>
                <Link href="#pricing">
                  Get Started →
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Automation Hub */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 h-full overflow-hidden bg-gradient-to-br from-card to-muted hover:shadow-primary/10">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 mb-6 mx-auto">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-center group-hover:text-primary transition-colors">Automation Hub</CardTitle>
              <CardDescription className="text-center leading-relaxed">
                No-code automation platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Drag & drop builder</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Database className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>100+ integrations</span>
                </li>
                <li className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                  <Star className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Enterprise security</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full" asChild>
                <Link href="#pricing">
                  Get Started →
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}

