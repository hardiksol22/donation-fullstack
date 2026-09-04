"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building2, Package, CheckCircle, Loader2, Activity, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, Tag, Plus, Trash2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface PendingNGO {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: { totalDonors: 0, totalNGOs: 0 },
    donations: { totalDonations: 0, completedPickups: 0 }
  })
  const [pendingNGOs, setPendingNGOs] = useState<PendingNGO[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  
  const [loading, setLoading] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [addingCategory, setAddingCategory] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // 1. Fetch Stats & NGOs
      const statsResponse = await api.get('/api/admin/stats')
      const { users, donations, pendingNGOs } = statsResponse.data.data
      setStats({ users, donations })
      setPendingNGOs(pendingNGOs)

      // 2. Fetch Categories
      const catResponse = await api.get('/api/categories')
      setCategories(catResponse.data.data)
      
    } catch (error: any) {
      console.error("Admin data error", error)
      toast.error("Failed to load platform data. Ensure you are an Admin.")
    } finally {
      setLoading(false)
    }
  }

  // Verify NGO Function
  const handleVerifyNGO = async (id: string) => {
    try {
      setVerifyingId(id)
      await api.patch(`/api/admin/verify-ngo/${id}`)
      toast.success("NGO Verified Successfully! ✅")
      setPendingNGOs((prev) => prev.filter((ngo) => ngo._id !== id))
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify NGO")
    } finally {
      setVerifyingId(null)
    }
  }

  // Add Category Function
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    
    try {
      setAddingCategory(true)
      const response = await api.post('/api/categories', { name: newCategory })
      setCategories([...categories, response.data.data])
      setNewCategory("")
      toast.success("Category added successfully! 🏷️")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add category. It might already exist.")
    } finally {
      setAddingCategory(false)
    }
  }

  // Delete Category Function
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    
    try {
      setDeletingId(id)
      await api.delete(`/api/categories/${id}`)
      setCategories((prev) => prev.filter((cat) => cat._id !== id))
      toast.success("Category removed!")
    } catch (error: any) {
      toast.error("Failed to delete category")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading Admin Command Center...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Admin Portal
          </h1>
          <p className="text-muted-foreground mt-2">Monitor platform activity and manage platform configurations.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW & VERIFICATIONS */}
          <TabsContent value="overview" className="space-y-8 animate-in fade-in-50">
            {/* 📊 PLATFORM STATISTICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-t-4 border-t-blue-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.users.totalDonors}</div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified NGOs</CardTitle>
                  <Building2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.users.totalNGOs}</div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-amber-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                  <Package className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.donations.totalDonations}</div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-green-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Pickups</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.donations.completedPickups}</div>
                </CardContent>
              </Card>
            </div>

            {/* 🛡️ PENDING NGO VERIFICATIONS */}
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  Pending NGO Verifications
                </CardTitle>
                <CardDescription>Review and approve new organizations wanting to join DaanSetu.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {pendingNGOs.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">There are no pending NGOs waiting for verification.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingNGOs.map((ngo) => (
                      <Card key={ngo._id} className="border border-warning/20 bg-warning/5 overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{ngo.name}</CardTitle>
                          <CardDescription>Applied: {new Date(ngo.createdAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm pb-4">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate">{ngo.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Phone className="h-4 w-4 shrink-0 text-primary" />
                            <span>{ngo.contactNumber || "Not provided"}</span>
                          </div>
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                            <span className="line-clamp-2">{ngo.address || "No address provided"}</span>
                          </div>
                        </CardContent>
                        <div className="p-4 bg-background border-t">
                          <Button 
                            onClick={() => handleVerifyNGO(ngo._id)} 
                            disabled={verifyingId === ngo._id}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {verifyingId === ngo._id ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
                            ) : (
                              <><ShieldCheck className="w-4 h-4 mr-2" /> Approve & Verify</>
                            )}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: CATEGORY MANAGEMENT */}
          <TabsContent value="categories" className="animate-in fade-in-50">
            <Card className="border-primary/10 shadow-md max-w-3xl mx-auto">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Tag className="h-6 w-6 text-primary" />
                  Donation Categories
                </CardTitle>
                <CardDescription>Manage the item types that donors can select from when scheduling a pickup.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                
                {/* Add New Category Form */}
                <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
                  <div className="flex-1">
                    <Input 
                      placeholder="e.g. Winter Clothes, Books, Furniture..." 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)} 
                      required
                    />
                  </div>
                  <Button type="submit" disabled={addingCategory} className="gap-2">
                    {addingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Category
                  </Button>
                </form>

                {/* Categories List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Active Categories</h3>
                  {categories.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                      No categories added yet.
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div key={category._id} className="flex items-center justify-between p-4 bg-muted/20 border rounded-xl hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-lg shadow-sm border">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-lg">{category.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={deletingId === category._id}
                        >
                          {deletingId === category._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))
                  )}
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}