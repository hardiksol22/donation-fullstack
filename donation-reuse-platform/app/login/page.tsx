"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/lib/api"
import { HeartHandshake, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post('/api/auth/login', formData)
      
      const resData = response.data;
      
      const token = resData.token || resData.data?.token;
      const user = resData.user || resData.data;

      if (token) {
        // Save credentials safely
        localStorage.setItem("token", token)
        localStorage.setItem("userId", user?._id || user?.id || "")
        localStorage.setItem("userRole", user?.role || "donor")

        toast.success("Logged in successfully! 🎉")

        // 🔥 FIX: Role-based redirection hata diya. Ab sab seedha Homepage par jayenge!
        router.push("/")
        
      } else {
        toast.error("Token missing from server response!")
        console.error("Full Backend Response:", resData)
      }

    } catch (error: any) {
      console.error("Login error:", error)
      const errorMsg = error.response?.data?.message || "Invalid email or password. Please try again."
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-primary/10 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <HeartHandshake className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your DaanSetu account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}