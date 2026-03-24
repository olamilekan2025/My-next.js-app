"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,  } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {  Input} from '@/components/ui/input'
import {  Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', formData)
      setSubmitted(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
    <main className="flex-1 gap-30">
      <section className="bg-gradient-to-b from-[#3C83F6] to-white py-20 text-center">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl  leading-relaxed text-muted-foreground  max-w-2xl mx-auto">
            Ready to transform your business? Send us a message and we'll get back to you within 24 hours.
          </p>
        </div>

        </section>
        <section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto lg:px-17 lg:py-10">
          {/* Contact Info */}
          <Card className="group shadow-xl hover:shadow-2xl transition-all duration-500 lg:sticky lg:top-20 lg:h-fit lg:self-start">
            <CardHeader>
              <div className="w-13 h-13 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 mx-auto">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
              <CardDescription className="text-center">
                Fill out the form or reach us directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">hello@myproduct.com</p>
                  <p className="text-sm text-muted-foreground">Email us anytime</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Mon - Fri 9AM - 6PM EST</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-all">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">123 Product St.</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="shadow-xl lg:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription>
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {submitted ? (
                <div className="text-center py-12">
                  <Send className="h-16 w-16 text-primary mx-auto mb-6 opacity-75" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Thank you!</h3>
                  <p className="text-lg text-muted-foreground">
                    Your message has been sent. We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline" 
                    className="mt-8"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 rounded-xl"
                      placeholder="John Doe"
                    />

                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 rounded-xl"
                      placeholder="john@example.com"
                    />

                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="min-h-[120px] rounded-xl resize-vertical"
                      placeholder="Tell us about your project..."
                    />

                  </div>
                  <Button 
                    type="submit" 
                    // size="lg"
                    className="w-full h-12 text-lg "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

