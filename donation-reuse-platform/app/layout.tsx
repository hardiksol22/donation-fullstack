// app/layout.tsx
import './globals.css';
import Navbar from '../components/layout/Navbar';
import { ReactNode } from 'react';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"; // <-- Naya Import

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'DaanSetu | Premium Fundraising & Donation OS',
  description: 'Advanced multi-tenant SaaS donation and fundraising platform.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans text-foreground antialiased",
        inter.variable
      )}>
        {/* ThemeProvider se poori app ko wrap karein */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}