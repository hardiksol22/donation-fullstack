"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  HeartHandshake, LogOut, LayoutDashboard, Menu, 
  PlusCircle, History, ShieldCheck, User, ChevronDown 
} from "lucide-react"
import { toast } from "sonner"
import { ModeToggle } from "@/components/ModeToggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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
    setIsSheetOpen(false)
    toast.success("Logged out successfully 👋")
    router.push("/login")
  }

  if (!isMounted) return <div className="h-16 border-b bg-background" />

  const isActive = (path: string) => pathname === path

  const renderNavLinks = (isMobile = false) => {
    const getLinkClass = (path: string) => 
      isMobile 
        ? `flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${isActive(path) ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`
        : `flex items-center gap-2 text-sm font-medium transition-colors ${isActive(path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`

    if (!isLoggedIn) {
      return (
        <div className={isMobile ? "flex flex-col gap-3 mt-4" : "flex items-center gap-4"}>
          <Link href="/login" onClick={() => setIsSheetOpen(false)}>
            <Button variant={isMobile ? "default" : "ghost"} className={isMobile ? "w-full font-medium" : "font-medium"}>
              Login
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className={isMobile ? "flex flex-col gap-2 mt-2" : "flex items-center gap-6"}>
        {userRole === 'donor' && (
          <>
            <Link href="/donor/donate" onClick={() => setIsSheetOpen(false)} className={getLinkClass('/donor/donate')}>
              <PlusCircle className="h-4 w-4" /> Schedule Pickup
            </Link>
            <Link href="/donor/history" onClick={() => setIsSheetOpen(false)} className={getLinkClass('/donor/history')}>
              <History className="h-4 w-4" /> My Impact
            </Link>
            {/* 🔥 YEH RAHA NAYA LINK 🔥 */}
            <Link href="/donor/ngos" onClick={() => setIsSheetOpen(false)} className={getLinkClass('/donor/ngos')}>
              <ShieldCheck className="h-4 w-4" /> Verified NGOs
            </Link>
          </>
        )}

        {userRole === 'ngo' && (
          <Link href="/ngo/requests" onClick={() => setIsSheetOpen(false)} className={getLinkClass('/ngo/requests')}>
            <LayoutDashboard className="h-4 w-4" /> Command Center
          </Link>
        )}

        {userRole === 'admin' && (
          <Link href="/admin/dashboard" onClick={() => setIsSheetOpen(false)} className={getLinkClass('/admin/dashboard')}>
            <ShieldCheck className="h-4 w-4" /> Admin Portal
          </Link>
        )}

        {isMobile && (
          <Button 
            variant="outline" 
            className="w-full mt-6 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="bg-primary p-1.5 rounded-xl shadow-sm">
            <HeartHandshake className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            DaanSetu
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav>
            {renderNavLinks()}
          </nav>
          
          <div className="flex items-center gap-4 pl-6 border-l">
            <ModeToggle />
            
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 pl-3 pr-2 h-9 rounded-full">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">{userRole}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ModeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] flex flex-col p-6">
              <SheetTitle className="text-left font-bold text-lg border-b pb-4 mb-2 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-primary" />
                DaanSetu
              </SheetTitle>
              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {renderNavLinks(true)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}