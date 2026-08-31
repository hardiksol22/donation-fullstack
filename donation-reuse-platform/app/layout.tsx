import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer'; // <-- Footer Import karein
import { ReactNode } from 'react';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'DaanSetu | Premium Fundraising & Donation OS',
  description: 'Advanced multi-tenant SaaS donation and fundraising platform.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* flex aur min-h-screen ensure karte hain ki footer hamesha bottom par rahe */}
      <body className={cn("min-h-screen flex flex-col bg-background font-sans text-foreground antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
          <Navbar />
          
          {/* flex-1 ensure karta hai ki main content bachi hui jagah le le */}
          <main className="flex-1 container mx-auto mt-8 px-4 pb-16">
            {children}
          </main>
          
          <Footer /> {/* <-- Footer yahan add kiya */}
          
          <Toaster position="top-center" richColors /> 
        </ThemeProvider>
      </body>
    </html>
  );
}