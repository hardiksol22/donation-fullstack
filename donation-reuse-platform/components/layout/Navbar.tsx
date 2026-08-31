'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        
        {/* Left Side: Brand & Navigation */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              DaanSetu
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/donor/donate" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Donate Items
            </Link>
            <Link 
              href="/ngo/requests" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              NGO Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side: Auth Buttons & Dark Mode Toggle */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full font-semibold px-6">
                Sign Up
              </Button>
            </Link>
            
            {/* Dark/Light Mode Toggle */}
            <div className="pl-2 border-l">
              <ModeToggle />
            </div>
          </nav>
        </div>

      </div>
    </header>
  );
}