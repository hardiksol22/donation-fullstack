"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LifeBuoy, Send, Mail, Phone, MapPin, Loader2, MessageSquare } from "lucide-react"
import { toast } from "sonner"

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending a support ticket
    setTimeout(() => {
      toast.success("Your message has been sent! Our support team will contact you soon. 📩")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <LifeBuoy className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Help & Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help! Browse our FAQs or reach out directly to the platform administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT COLUMN: FAQ SECTION */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" /> Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-6">Quick answers to common questions about the donation process.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-primary/10">
              <AccordionTrigger className="text-left font-semibold">How do I schedule a pickup?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Once you create a Donor account, navigate to the "Donate" dashboard. Fill in the item details and select your preferred pickup time. A verified local NGO will be notified and will accept your request.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-primary/10">
              <AccordionTrigger className="text-left font-semibold">What items can I donate?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                You can donate gently used clothes, electronics, books, furniture, and household appliances. Please ensure all items are in working or usable condition before listing them.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-primary/10">
              <AccordionTrigger className="text-left font-semibold">Are the NGOs verified?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, absolutely! Every NGO partner must go through a strict verification process and be manually approved by our Super Admin team before they can accept donations on the platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-primary/10">
              <AccordionTrigger className="text-left font-semibold">Is my personal data safe?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Your data is fully encrypted. We only share your pickup address and contact number with the specific NGO that accepts your donation request to facilitate the logistics.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-primary/10">
            <Card className="border-primary/10 shadow-sm bg-muted/20">
              <CardContent className="p-4 flex items-center gap-4">
                <Mail className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Email Us</p>
                  <p className="text-muted-foreground text-sm">support@daansetu.com</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/10 shadow-sm bg-muted/20">
              <CardContent className="p-4 flex items-center gap-4">
                <Phone className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-muted-foreground text-sm">+91 1800-123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div>
          <Card className="border-primary/10 shadow-lg h-full">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Describe your issue or question in detail..." className="min-h-[120px] resize-none" />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 p-6 border-t mt-2">
                <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}