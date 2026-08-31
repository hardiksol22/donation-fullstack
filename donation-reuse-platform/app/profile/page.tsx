"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Shield, Phone, Loader2, Save, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/lib/api" // Import actual API instance

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    contactNumber: "",
    address: "",
  })

  useEffect(() => {
    fetchRealProfile()
  }, [])

  // 🔥 1. FETCH REAL DATA FROM BACKEND
  const fetchRealProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile')
      const user = response.data.data
      
      setUserData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Donor",
        contactNumber: user.contactNumber || "",
        address: user.address || "",
      })
    } catch (error) {
      console.error("Profile fetch error", error)
      toast.error("Failed to load your real profile data.")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 2. SAVE REAL DATA TO BACKEND
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put('/api/auth/profile', {
        name: userData.name,
        contactNumber: userData.contactNumber,
        address: userData.address
      })
      toast.success("Profile updated successfully in database! ✨")
    } catch (error) {
      toast.error("Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    toast.success("Logged out successfully")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading Live Profile Data...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{userData.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">{userData.email}</p>
                <Badge variant={userData.role.toLowerCase() === 'admin' ? 'destructive' : 'secondary'}>
                  {userData.role}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your contact details and default pickup location.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={userData.email} disabled className="bg-muted/50 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground">Email address is tied to your account and cannot be changed.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={userData.contactNumber} onChange={(e) => setUserData({...userData, contactNumber: e.target.value})} className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Default Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="address" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} className="pl-9" placeholder="Enter full address" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 p-6 border-t mt-2">
                  <Button type="submit" className="gap-2" disabled={saving}>
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Database...</> : <><Save className="w-4 h-4" /> Save Profile</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            {/* Security tab UI remains the same */}
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>We encrypt your data using bcrypt hashing in MongoDB.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="new-password" type="password" className="pl-9" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 p-6 border-t mt-2">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}