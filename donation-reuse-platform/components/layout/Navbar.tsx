"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HeartHandshake, LogOut, LayoutDashboard, Menu, PlusCircle, History, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { ModeToggle } from "@/components/ModeToggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  
  // State to handle client-side rendering (Hydration fix)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Check auth state on mount and every route change
  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    
    if (token) {
      setIsLoggedIn(true)
      setUserRole(role?.toLowerCase() || null)
    } else {
      setIsLoggedIn(false)
      setUserRole(null)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    setIsLoggedIn(false)
    setUserRole(null)
    toast.success("Logged out successfully 👋")
    router.push("/")
  }

  // Prevent hydration mismatch
  if (!isMounted) return <div className="h-16 border-b" />

  // Navigation Links based on Roles
  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile 
      ? "flex items-center gap-2 text-lg font-medium py-2" 
      : "flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"

    if (!isLoggedIn) {
      return (
        <>
          <Link href="/login" className={linkClass}>Login</Link>
          <Link href="/register">
            <Button className={isMobile ? "w-full mt-4" : ""}>Sign Up</Button>
          </Link>
        </>
      )
    }

    return (
      <>
        {/* Donor Links */}
        {userRole === 'donor' && (
          <>
            <Link href="/donor/donate" className={linkClass}>
              <PlusCircle className="h-4 w-4" /> Schedule Pickup
            </Link>
            <Link href="/donor/history" className={linkClass}>
              <History className="h-4 w-4" /> My Impact
            </Link>
          </>
        )}

        {/* NGO Links */}
        {userRole === 'ngo' && (
          <Link href="/ngo/requests" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" /> Command Center
          </Link>
        )}

        {/* Super Admin Links */}
        {userRole === 'admin' && (
          <Link href="/admin/dashboard" className={linkClass}>
            <ShieldCheck className="h-4 w-4" /> Super Admin Portal
          </Link>
        )}

        {/* Universal Logout Button */}
        <Button 
          variant={isMobile ? "outline" : "ghost"} 
          className={isMobile ? "w-full mt-4 flex items-center gap-2 text-red-500 hover:text-red-600" : "flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-primary p-1.5 rounded-lg">
            <HeartHandshake className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:inline-block">DaanSetu</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {renderNavLinks()}
          <ModeToggle />
        </nav>

        {/* Mobile Navigation (Hamburger Menu) */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col gap-6 pt-10">
              <nav className="flex flex-col gap-4">
                {renderNavLinks(true)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}