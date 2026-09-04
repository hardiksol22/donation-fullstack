"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, MapPin, Mail, Phone, Building2, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface NGO {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  createdAt: string;
}

export default function VerifiedNGOsPage() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNGOs()
  }, [])

  const fetchNGOs = async () => {
    try {
      const response = await api.get('/api/users/ngos')
      setNgos(response.data.data)
    } catch (error) {
      console.error("Failed to fetch NGOs", error)
      toast.error("Could not load NGO directory.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg font-medium">Loading Verified Partners...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center justify-center md:justify-start gap-3">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
          Verified NGO Partners
        </h1>
        <p className="text-muted-foreground mt-2">
          Meet the trusted organizations working with DaanSetu to distribute your donations to those in need.
        </p>
      </div>

      {ngos.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No NGOs registered yet</h3>
            <p className="text-muted-foreground mt-2">Check back later as we partner with more organizations.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <Card key={ngo._id} className="overflow-hidden hover:shadow-md transition-shadow border-t-4 border-t-emerald-500">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{ngo.name}</CardTitle>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Verified
                  </Badge>
                </div>
                <CardDescription>Joined {new Date(ngo.createdAt).getFullYear()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{ngo.email}</span>
                </div>
                {ngo.contactNumber && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{ngo.contactNumber}</span>
                  </div>
                )}
                {ngo.address ? (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{ngo.address}</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Location details restricted</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}