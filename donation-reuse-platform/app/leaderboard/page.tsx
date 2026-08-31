"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, Loader2, TrendingUp, Package } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"

// Interface for strictly typing our real API response
interface TopDonor {
  _id: string;
  name: string;
  totalItemsDonated: number;
  donationCount: number;
}

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      // Direct call to our real MongoDB Aggregation API
      const response = await api.get('/api/donations/leaderboard')
      setTopDonors(response.data.data)
    } catch (error) {
      console.error("Leaderboard fetch error", error)
      toast.error("Failed to load real-time leaderboard rankings.")
    } finally {
      setLoading(false)
    }
  }

  // Smart function to assign visual medals based on rank
  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-md" />
    if (index === 1) return <Medal className="w-6 h-6 text-slate-300 drop-shadow-md" />
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" />
    return <span className="font-bold text-muted-foreground text-lg w-6 text-center">#{index + 1}</span>
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Calculating Live Impact Scores...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 bg-primary/10 text-primary">
            <Star className="w-4 h-4 mr-2 inline-block" />
            Hall of Fame
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Impact Leaderboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating our top contributors who are giving items a second life and making a real difference in the community.
          </p>
        </div>

        <Card className="border-primary/10 shadow-xl overflow-hidden rounded-2xl bg-gradient-to-b from-background to-muted/20">
          <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6 pt-8 text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" /> Top Donors of All Time
            </CardTitle>
            <CardDescription className="text-base mt-2">Ranked by total quantity of items donated</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {topDonors.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No donations have been completed yet. Be the first!</p>
              </div>
            ) : (
              <div className="divide-y divide-primary/5">
                {topDonors.map((donor, index) => (
                  <div 
                    key={donor._id} 
                    className={`flex items-center justify-between p-6 transition-colors hover:bg-muted/50 ${index === 0 ? 'bg-yellow-500/5' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankBadge(index)}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${index === 0 ? 'text-primary' : ''}`}>
                          {donor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3" /> {donor.donationCount} separate pickups
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-base px-4 py-1.5 ${index === 0 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-secondary text-secondary-foreground'}`}>
                        <Package className="w-4 h-4 mr-2 inline-block" />
                        {donor.totalItemsDonated} Items
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}