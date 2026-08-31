"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, ShieldAlert, CheckCircle, Loader2, Users, Building2, PackageCheck, Target } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface NGO {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  contactNumber?: string;
  isVerified: boolean;
  createdAt: string;
}

interface PlatformStats {
  totalDonors: number;
  verifiedNgos: number;
  totalDonations: number;
  completedCollections: number;
}

export default function SuperAdminDashboard() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch both NGOs and Platform Stats
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Promise.all se dono APIs ek saath parallel mein fetch hongi (Faster loading)
      const [ngoRes, statsRes] = await Promise.all([
        api.get('/api/admin/ngos'),
        api.get('/api/admin/stats')
      ])

      setNgos(ngoRes.data.data)
      setStats(statsRes.data.data)
    } catch (error) {
      console.error("Failed to fetch admin data", error)
      toast.error("Failed to load dashboard data. Are you logged in as Admin?")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // NGO Verification Handler (Updated to match your new backend API)
  const handleVerify = async (id: string, orgName: string | undefined, currentStatus: boolean) => {
    try {
      // API call matching your: router.patch('/ngo/:id/verify', ...)
      await api.patch(`/api/admin/ngo/${id}/verify`, { 
        isVerified: !currentStatus // true to approve, false to revoke
      })
      
      // Update local state instantly without page reload
      setNgos(prev => prev.map(ngo => 
        ngo._id === id ? { ...ngo, isVerified: !currentStatus } : ngo
      ))
      
      if (!currentStatus) {
        toast.success(`${orgName || 'NGO'} has been successfully verified! 🛡️`)
        // Update live stats card slightly to reflect new verification
        if (stats) setStats({ ...stats, verifiedNgos: stats.verifiedNgos + 1 })
      } else {
        toast.error(`Verification revoked for ${orgName || 'NGO'}.`)
        if (stats) setStats({ ...stats, verifiedNgos: stats.verifiedNgos - 1 })
      }

    } catch (error) {
      toast.error("Failed to update verification status.")
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-7xl px-4">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Super Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Platform overview and user verification management.</p>
        </div>
      </div>

      {/* KPI Stats Section (From your /stats API) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats?.totalDonors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered individuals</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified NGOs</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats?.verifiedNgos || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved partners</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : stats?.totalDonations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform-wide requests</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Completed Collections</CardTitle>
            <PackageCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{loading ? "..." : stats?.completedCollections || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered items</p>
          </CardContent>
        </Card>
      </div>

      {/* NGO Management Table */}
      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle>Registered Organizations</CardTitle>
          <CardDescription>Review and approve new NGO registrations below.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-6">Organization Details</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Joined On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-muted-foreground">Loading platform data...</p>
                  </TableCell>
                </TableRow>
              ) : ngos.length > 0 ? (
                ngos.map((ngo) => (
                  <TableRow key={ngo._id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <div className="font-bold text-md">{ngo.organizationName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{ngo.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ngo.name}</div>
                      <div className="text-sm text-muted-foreground">{ngo.contactNumber || 'No contact provided'}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(ngo.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {ngo.isVerified ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          <CheckCircle className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10">
                          <ShieldAlert className="mr-1 h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {!ngo.isVerified ? (
                        <Button 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleVerify(ngo._id, ngo.organizationName, ngo.isVerified)}
                        >
                          Approve Access
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => handleVerify(ngo._id, ngo.organizationName, ngo.isVerified)}
                        >
                          Revoke Access
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    <ShieldCheck className="h-10 w-10 text-muted/50 mb-3 mx-auto" />
                    <p className="font-medium text-lg">No NGOs found</p>
                    <p className="text-sm">There are no NGO accounts registered on the platform yet.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}