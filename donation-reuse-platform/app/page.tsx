"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeartHandshake, ArrowRight, Recycle, MapPin } from "lucide-react"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // 1. Check local storage for existing session
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    
    if (token) {
      setIsLoggedIn(true)
      setUserRole(role?.toLowerCase() || null)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-primary/10 via-background to-background">
        <Badge className="mb-6 px-4 py-1.5 text-sm" variant="secondary">
          Empowering Communities 🌱
        </Badge>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Give Your Items a <span className="text-primary">Second Life.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Seamlessly connect with verified NGOs to donate clothes, electronics, and household items. Schedule a pickup from your doorstep and track your impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* 2. Smart Dynamic Routing Logic */}
          {isLoggedIn ? (
            <Link href={userRole === 'ngo' ? "/ngo/requests" : userRole === 'admin' ? "/admin/dashboard" : "/donor/donate"}>
              <Button size="lg" className="h-14 px-8 text-lg gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/donor/donate">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                  Start Donating <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/ngo/requests">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
                  I am an NGO
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-muted/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A streamlined, technology-driven process designed for maximum social impact with minimal effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border border-primary/10 hover:border-primary/40 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. List Your Items</h3>
              <p className="text-muted-foreground">Upload a quick photo and details of the gently used items you wish to donate.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border border-primary/10 hover:border-primary/40 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Smart Matching</h3>
              <p className="text-muted-foreground">Our geographic routing instantly alerts verified local NGOs about your available donation.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 bg-background rounded-2xl shadow-sm border border-primary/10 hover:border-primary/40 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Doorstep Pickup</h3>
              <p className="text-muted-foreground">An NGO representative will accept the request and pick up the item directly from your address.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}