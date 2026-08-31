"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, CheckCircle, Clock, MapPin, ExternalLink } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

// Type definition for TypeScript
interface Donation {
  _id: string
  title: string
  category: string
  status: "Available" | "Requested" | "Completed"
  createdAt: string
  pickupAddress: string
}

export default function DonorHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyDonations()
  }, [])

  const fetchMyDonations = async () => {
    try {
      // Endpoint to fetch donations specific to the logged-in user
      const response = await api.get('/api/donations/my-donations')
      setDonations(response.data.data || [])
    } catch (error) {
      console.error("Failed to fetch donations", error)
      toast.error("Could not load your donation history.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case "Requested":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100"><MapPin className="w-3 h-3 mr-1" /> NGO Assigned</Badge>
      case "Completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Picked Up</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Impact</h1>
          <p className="text-muted-foreground mt-1">Track your contributions and their journey.</p>
        </div>
      </div>

      {/* Advanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items Donated</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful Pickups</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Data Table */}
      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>A complete log of your recent listings.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>You haven't made any donations yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{donation.title}</TableCell>
                      <TableCell>{donation.category}</TableCell>
                      <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}