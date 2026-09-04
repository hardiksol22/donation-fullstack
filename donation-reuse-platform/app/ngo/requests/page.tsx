"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import api from "@/lib/api"
import { Loader2, MapPin, Clock, Package, CheckCircle, User, Phone, CheckSquare } from "lucide-react"

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
  const [pendingDonations, setPendingDonations] = useState<Donation[]>([])
  const [acceptedDonations, setAcceptedDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      // Fetch both pending and accepted tasks
      const [pendingRes, acceptedRes] = await Promise.all([
        api.get('/api/donations/available'),
        api.get('/api/donations/my-tasks')
      ])
      setPendingDonations(pendingRes.data.data)
      setAcceptedDonations(acceptedRes.data.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id: string) => {
    try {
      setActionLoading(id)
      await api.patch(`/api/donations/${id}/status`, { status: 'Accepted' })
      toast.success("Request Accepted! Moved to My Tasks.")
      // Move from Pending to Accepted tab in UI instantly
      const acceptedItem = pendingDonations.find(d => d._id === id)
      if (acceptedItem) {
        setPendingDonations(prev => prev.filter(d => d._id !== id))
        setAcceptedDonations(prev => [{ ...acceptedItem, status: 'Accepted' }, ...prev])
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to accept request.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      setActionLoading(id)
      await api.patch(`/api/donations/${id}/status`, { status: 'Completed' })
      toast.success("🎉 Pickup Successful! Donor's impact updated.")
      // Remove from Accepted tab
      setAcceptedDonations(prev => prev.filter(d => d._id !== id))
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete pickup.")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg font-medium">Loading Command Center...</span>
      </div>
    )
  }

  // Reusable component for Donation Cards to keep code clean
  const DonationCard = ({ donation, isAccepted }: { donation: Donation, isAccepted: boolean }) => (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col">
      {donation.imageUrl ? (
        <div className="w-full h-48 bg-muted relative">
          <img src={donation.imageUrl} alt={donation.title} className="w-full h-full object-cover" />
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
        {donation.description && <p className="text-sm text-muted-foreground line-clamp-2">{donation.description}</p>}
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
            <span>
              {new Date(donation.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t mt-auto">
        {isAccepted ? (
          <Button 
            onClick={() => handleComplete(donation._id)} 
            className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={actionLoading === donation._id}
          >
            {actionLoading === donation._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><CheckSquare className="mr-2 h-4 w-4" /> Mark as Picked Up</>}
          </Button>
        ) : (
          <Button 
            onClick={() => handleAccept(donation._id)} 
            className="w-full font-bold"
            disabled={actionLoading === donation._id}
          >
            {actionLoading === donation._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Accept & Schedule Pickup"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary flex items-center justify-center md:justify-start gap-3">
          <Package className="h-8 w-8" />
          Command Center
        </h1>
        <p className="text-muted-foreground mt-2">Manage pending requests and update status of your scheduled pickups.</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">New Requests ({pendingDonations.length})</TabsTrigger>
          <TabsTrigger value="accepted">My Tasks ({acceptedDonations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingDonations.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold">No new requests right now</h3>
                <p className="text-muted-foreground mt-2">Check back later for new donations in your area.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingDonations.map(donation => <DonationCard key={donation._id} donation={donation} isAccepted={false} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-6">
          {acceptedDonations.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold">No active tasks</h3>
                <p className="text-muted-foreground mt-2">Accept a new request to see it here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedDonations.map(donation => <DonationCard key={donation._id} donation={donation} isAccepted={true} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}