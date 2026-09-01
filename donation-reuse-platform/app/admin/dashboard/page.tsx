"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, Package, ShieldCheck, Activity, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/api/admin/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error("Failed to fetch admin stats", error)
      toast.error("Could not load dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyNGO = async (id: string) => {
    setProcessingId(id)
    try {
      await api.patch(`/api/admin/verify-ngo/${id}`)
      toast.success("NGO has been officially verified! ✅")
      setStats((prev: any) => ({
        ...prev,
        pendingNGOs: prev.pendingNGOs.filter((ngo: any) => ngo._id !== id)
      }))
    } catch (error) {
      toast.error("Verification failed. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Admin Workspace...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor platform health, active users, and verify NGO partners.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Live Metrics</TabsTrigger>
            <TabsTrigger value="ngos">
              Pending Approvals 
              {stats?.pendingNGOs?.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {stats.pendingNGOs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.users?.totalDonors || 0}</div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified NGOs</CardTitle>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.users?.totalNGOs || 0}</div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                  <Package className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.donations?.totalDonations || 0}</div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Pickups</CardTitle>
                  <Activity className="w-4 h-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.donations?.completedPickups || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ngos">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>NGO Verification Queue</CardTitle>
                <CardDescription>Review and authorize new organizations to participate on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.pendingNGOs?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/10 rounded-lg border border-dashed">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-muted-foreground">There are no pending NGOs awaiting verification.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Organization Name</TableHead>
                          <TableHead>Representative</TableHead>
                          <TableHead>Email Contact</TableHead>
                          <TableHead>Joined Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats?.pendingNGOs?.map((ngo: any) => (
                          <TableRow key={ngo._id} className="hover:bg-muted/30">
                            <TableCell className="font-semibold">{ngo.organizationName || 'N/A'}</TableCell>
                            <TableCell>{ngo.name}</TableCell>
                            <TableCell>{ngo.email}</TableCell>
                            <TableCell>{new Date(ngo.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                onClick={() => handleVerifyNGO(ngo._id)}
                                disabled={processingId === ngo._id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                              >
                                {processingId === ngo._id ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Approving...</>
                                ) : (
                                  <><CheckCircle2 className="w-4 h-4" /> Approve</>
                                )}
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
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}