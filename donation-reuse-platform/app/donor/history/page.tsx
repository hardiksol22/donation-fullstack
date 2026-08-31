"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle2, Truck, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data (Jab API ready hogi toh ise replace kar denge)
const mockHistory = [
  { id: "DON-1029", category: "Clothes", quantity: 15, status: "Pending", date: "2026-08-31", address: "Alkapuri, Vadodara" },
  { id: "DON-0982", category: "Books", quantity: 40, status: "Scheduled", date: "2026-08-25", address: "Gotri, Vadodara" },
  { id: "DON-0844", category: "Toys", quantity: 5, status: "Collected", date: "2026-08-10", address: "Akota, Vadodara" },
]

export default function DonorHistoryPage() {
  const [loading, setLoading] = useState(true)

  // Simulate loading API data
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Pending": return <Clock className="h-5 w-5 text-amber-500" />
      case "Scheduled": return <Truck className="h-5 w-5 text-blue-500" />
      case "Collected": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "Scheduled": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "Collected": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Impact</h1>
          <p className="text-muted-foreground mt-2">Track your recent donations and see their journey.</p>
        </div>
        <Link href="/donor/donate">
          <Button className="rounded-full shadow-md">
            New Donation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse h-32 bg-muted/50 border-primary/5" />
            ))}
          </div>
        ) : (
          mockHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="overflow-hidden border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Details Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${getStatusColor(item.status)} bg-opacity-50`}>
                            {getStatusIcon(item.status)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{item.category}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{item.quantity} Items • Ref: {item.id}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md w-max">
                        <MapPin className="mr-2 h-3.5 w-3.5" /> {item.address}
                      </div>
                    </div>

                    {/* Right Tracking Section */}
                    <div className="bg-muted/20 p-6 md:w-64 border-t md:border-t-0 md:border-l flex flex-col justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                      <div className="relative z-10">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Requested On</p>
                        <p className="font-medium">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        
                        <div className="mt-4 pt-4 border-t border-primary/10">
                          {item.status === "Pending" && <p className="text-sm font-medium text-amber-600">Waiting for NGO approval</p>}
                          {item.status === "Scheduled" && <p className="text-sm font-medium text-blue-600">Pickup agent assigned</p>}
                          {item.status === "Collected" && <p className="text-sm font-medium text-emerald-600">Successfully delivered! ✨</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}