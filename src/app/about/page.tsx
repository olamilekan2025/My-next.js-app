import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, Target, Award } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gray-100 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl text-blue-500 font-bold mb-6">
            About MyProduct
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            We build innovative software solutions that empower businesses to
            achieve more. Our passion for technology drives everything we do.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-0 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto lg:px-30">
          
          {/* Card 1 */}
          <Card className="group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition">
                <Target className="h-6 w-6 text-primary" />
              </div>

              <CardTitle className="text-2xl group-hover:text-primary transition">
                Our Story
              </CardTitle>

              <CardDescription>
                Founded in 2023, MyProduct started with a simple mission: make
                powerful tools accessible to every business.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center flex-1">
              <p className="text-lg leading-relaxed">
                From a small team of innovators to serving thousands of
                customers worldwide, our journey has been incredible.
              </p>
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <Button className='bg-red-400 p-4 w-full bg-blue-400 text-white'  variant="ghost" size="lg" asChild>
                <Link href="/products">See Our Products →</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition">
                <Users className="h-6 w-6 text-primary" />
              </div>

              <CardTitle className="text-2xl group-hover:text-primary transition">
                Our Team
              </CardTitle>

              <CardDescription>
                50+ passionate experts in engineering, design, and product.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center flex-1">
              <p className="text-lg leading-relaxed">
                Diverse backgrounds united by a shared vision to create
                exceptional software experiences.
              </p>
            </CardContent>

            <CardFooter className="justify-center pt-6">
              <Button className='bg-red-400 p-4 w-full bg-blue-400 text-white' variant="ghost" size="lg" asChild>
                <Link href="/contact">Meet the Team →</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="group flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition">
                <Award className="h-6 w-6 text-primary" />
              </div>

              <CardTitle className="text-2xl group-hover:text-primary transition">
                Our Values
              </CardTitle>

              <CardDescription>
                Innovation, integrity, customer success.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="grid gap-3 max-w-md mx-auto">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition">
                  <Award className="h-5 w-5 mt-1 text-primary" />
                  <span>Innovation drives our DNA</span>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition">
                  <Award className="h-5 w-5 mt-1 text-primary" />
                  <span>Integrity in every decision</span>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 group-hover:bg-muted/50 transition">
                  <Award className="h-5 w-5 mt-1 text-primary" />
                  <span>Your success is our priority</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter className="justify-center ">
              <Button className='bg-red-400 p-4 w-full bg-blue-400 text-white' variant="outline" size="lg" asChild>
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}