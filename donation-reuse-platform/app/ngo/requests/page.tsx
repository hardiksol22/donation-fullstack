"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "../../../lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, MapPin, XCircle, Loader2, Search, Package, TrendingUp, AlertCircle } from "lucide-react"

interface DonationRequest {
  _id: string;
  category: string;
  quantity: number;
  condition: string;
  pickupAddress: string;
  status: string;
  createdAt: string;
}

export default function AdvancedNGODashboard() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real data
  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/donations') 
      setRequests(response.data.data || response.data)
    } catch (error) {
      console.error("Failed to fetch donation requests", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Status Update Handler
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/api/donations/${id}`, { status: newStatus })
      setRequests(prev => prev.map(req => 
        req._id === id ? { ...req, status: newStatus } : req
      ))
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}`, error)
      alert("Failed to update status. Please check your backend connection.")
    }
  }

  // 1. Dynamic Analytics Calculations
  const pendingCount = requests.filter(r => (r.status?.toLowerCase() || 'pending') === 'pending').length;
  const acceptedCount = requests.filter(r => (r.status?.toLowerCase()) === 'accepted').length;
  const totalItems = requests.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  // 2. Advanced Multi-level Filtering (Tab + Search)
  const filteredRequests = requests.filter(req => {
    const status = req.status?.toLowerCase() || 'pending'
    
    // Tab Match
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && status === "pending") || 
      (activeTab === "accepted" && (status === "accepted" || status === "scheduled"))

    // Search Query Match (By ID, Address, or Category)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      req._id.toLowerCase().includes(searchLower) ||
      req.pickupAddress.toLowerCase().includes(searchLower) ||
      req.category.toLowerCase().includes(searchLower)

    return matchesTab && matchesSearch
  })

  return (
    <div className="container mx-auto py-10 max-w-7xl px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">Advanced overview of all incoming operations and impact.</p>
        </div>
        <Button onClick={fetchRequests} variant="outline" className="h-10">
          Refresh Data
        </Button>
      </div>

      {/* Advanced Analytics Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Pickups</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successfully Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{acceptedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total requests processed</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Items Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative items collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Section */}
      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="h-11">
            <TabsTrigger value="pending" className="text-md px-6">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="accepted" className="text-md px-6">Accepted</TabsTrigger>
            <TabsTrigger value="all" className="text-md px-6">All History</TabsTrigger>
          </TabsList>
          
          {/* Advanced Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, Address or Category..." 
              className="pl-9 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[100px] pl-6 text-xs uppercase tracking-wider">Ref ID</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Donation Details</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Condition</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Pickup Location</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-right pr-6 text-xs uppercase tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                          <p className="font-medium">Syncing live data from DaanSetu servers...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <TableRow key={req._id} className="transition-colors hover:bg-muted/30">
                        <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                          {req._id.substring(0, 6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-md hidden sm:block">
                              <Package className="h-4 w-4 text-secondary-foreground" />
                            </div>
                            <div>
                              <div className="font-bold">{req.category}</div>
                              <div className="text-xs text-muted-foreground font-medium">Quantity: {req.quantity} Items</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{req.condition}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm font-medium max-w-[220px] truncate">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground shrink-0" /> 
                            {req.pickupAddress}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={req.status?.toLowerCase() === "pending" ? "outline" : "default"} 
                                 className={req.status?.toLowerCase() === "pending" 
                                  ? "text-amber-600 border-amber-500/30 bg-amber-500/10" 
                                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"}>
                            {req.status?.toLowerCase() === "pending" ? <Clock className="mr-1.5 h-3 w-3" /> : <CheckCircle2 className="mr-1.5 h-3 w-3" />}
                            {req.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {req.status?.toLowerCase() === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                title="Reject Request"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                                className="h-8 px-4 font-semibold shadow-sm transition-transform hover:scale-105"
                              >
                                Accept
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="ghost" className="h-8 font-medium">View Details</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-10 w-10 text-muted/50 mb-3" />
                          <p className="font-medium text-lg">No requests found</p>
                          <p className="text-sm">Try adjusting your search filters or check a different tab.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}