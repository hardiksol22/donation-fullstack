"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-24 pb-16 px-4">
      
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 inline-block border border-primary/20 shadow-sm">
          ✨ DaanSetu OS is Live
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        The Operating System for <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          Modern Fundraising
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        A powerful, AI-driven platform connecting donors with verified organizations. Experience seamless donations, transparent tracking, and real-time impact.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button size="lg" className="rounded-full px-8 h-12 text-md transition-transform hover:scale-105">
          Start a Campaign <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-md transition-transform hover:scale-105">
          <Heart className="mr-2 h-4 w-4 text-rose-500" /> Explore Causes
        </Button>
      </motion.div>
      
    </div>
  )
}