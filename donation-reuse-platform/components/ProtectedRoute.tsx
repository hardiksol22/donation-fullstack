"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[] // Optional: restrict to specific roles like ['admin'] or ['ngo']
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Read auth data from localStorage
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")?.toLowerCase()

    if (!token) {
      // 1. No token found? Bounce to login
      router.push("/login")
    } else if (allowedRoles && userRole && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      // 2. Token exists but role doesn't match? Bounce to home page
      router.push("/")
    } else {
      // 3. Authorized! Render the page
      setIsAuthorized(true)
    }
  }, [router, allowedRoles])

  // Show a premium loading state while verifying
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse tracking-wide">
          Securing your workspace...
        </p>
      </div>
    )
  }

  // If authorized, render the actual page content
  return <>{children}</>
}