"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import api from "@/lib/api"
import { Loader2, MapPin, Clock, Package, CheckCircle, User, Phone } from "lucide-react"

// Types for TypeScript
interface Donor {
  _id: string;
  name: string;
  contactNumber: string;
  email: string;
}

interface Donation {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  quantity: number;
  pickupAddress: string;
  scheduledTime: string;
  imageUrl?: string;
  donorId: Donor;
  status: string;
  createdAt: string;
}

export default function NgoRequestsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch Available (Pending) Requests on Page Load
  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/donations/available')
      setDonations(res.data.data)
    } catch (error: any) {
      console.error("Failed to fetch donations:", error)
      toast.error("Failed to load active requests.")
    } finally {
      setLoading(false)
    }
  }

  // Handle Accepting a Donation
  const handleAccept = async (id: string) => {
    try {
      setActionLoading(id)
      await api.patch(`/api/donations/${id}/status`, { status: 'Accepted' })
      
      toast.success("🎉 Request Accepted! Donor has been notified via email.")
      
      // Remove the accepted donation from the current UI list
      setDonations((prev) => prev.filter((d) => d._id !== id))
    } catch (error: any) {
      console.error("Failed to accept:", error)
      toast.error(error.response?.data?.message || "Failed to accept request.")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg font-medium">Loading active requests...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center justify-center md:justify-start gap-3">
          <Package className="h-8 w-8" />
          Command Center
        </h1>
        <p className="text-muted-foreground mt-2">Manage and accept pending donation requests from donors in your area.</p>
      </div>

      {donations.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No active requests right now</h3>
            <p className="text-muted-foreground mt-2">Check back later for new donation requests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <Card key={donation._id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
              {/* Image Header */}
              {donation.imageUrl ? (
                <div className="w-full h-48 bg-muted relative">
                  <img 
                    src={donation.imageUrl} 
                    alt={donation.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-primary shadow">
                    {donation.category}
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-muted/30 flex items-center justify-center">
                  <Package className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-1">{donation.title}</CardTitle>
                <CardDescription className="flex gap-2 text-xs font-semibold mt-1">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">Qty: {donation.quantity}</span>
                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{donation.condition}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-grow">
                {donation.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{donation.description}</p>
                )}

                <div className="space-y-2 text-sm bg-muted/20 p-3 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-foreground">{donation.donorId?.name || "Anonymous Donor"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{donation.donorId?.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{donation.pickupAddress}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{new Date(donation.scheduledTime).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 border-t mt-auto">
                <Button 
                  onClick={() => handleAccept(donation._id)} 
                  className="w-full font-bold"
                  disabled={actionLoading === donation._id}
                >
                  {actionLoading === donation._id ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Accepting...</>
                  ) : (
                    "Accept & Schedule Pickup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}