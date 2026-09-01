"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Filter, Package, Heart, Clock } from "lucide-react"

// Real-world mock data for the public gallery to show platform activity
const MOCK_ITEMS = [
  {
    _id: "1",
    title: "Men's Winter Jacket",
    category: "Clothes",
    condition: "Gently Used",
    location: "Mumbai, MH",
    timeAgo: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
  },
  {
    _id: "2",
    title: "Study Table & Chair",
    category: "Furniture",
    condition: "Heavily Used",
    location: "Pune, MH",
    timeAgo: "5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
  },
  {
    _id: "3",
    title: "College Engineering Books",
    category: "Books",
    condition: "Gently Used",
    location: "Ahmedabad, GJ",
    timeAgo: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
  },
  {
    _id: "4",
    title: "Working Microwave Oven",
    category: "Electronics",
    condition: "Gently Used",
    location: "Delhi, DL",
    timeAgo: "2 days ago",
    imageUrl: "https://images.unsplash.com/photo-1585223140590-0080824b2166?w=500&q=80",
  },
  {
    _id: "5",
    title: "Kids Assorted Toys",
    category: "Other",
    condition: "New",
    location: "Vadodara, GJ",
    timeAgo: "3 days ago",
    imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80",
  },
  {
    _id: "6",
    title: "Women's Ethnic Wear Set",
    category: "Clothes",
    condition: "Gently Used",
    location: "Surat, GJ",
    timeAgo: "4 days ago",
    imageUrl: "https://images.unsplash.com/photo-1608228064614-5f5f403980bc?w=500&q=80",
  }
]

export default function ExploreGallery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [items, setItems] = useState(MOCK_ITEMS)

  const categories = ["All", "Clothes", "Electronics", "Books", "Furniture", "Other"]

  // Handle Search and Filter logic
  useEffect(() => {
    let filtered = MOCK_ITEMS

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setItems(filtered)
  }, [searchTerm, selectedCategory])

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'New': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
      case 'Gently Used': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      default: return 'bg-orange-500/10 text-orange-600 border-orange-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm bg-primary/10 text-primary border-none">
          <Heart className="w-4 h-4 mr-2 inline-block fill-primary" />
          Community Impact Gallery
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Explore Donations</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover items currently available for pickup across the platform. Verified NGOs can log in to claim these items.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-muted/20 p-4 rounded-2xl border border-primary/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search items or locations..." 
            className="pl-10 h-12 rounded-xl bg-background border-primary/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${selectedCategory !== category ? 'bg-background hover:bg-primary/5' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Masonry / Grid Gallery */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-primary/20">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-2xl font-bold mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-2xl">
              <div className="relative h-64 overflow-hidden bg-muted">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-none shadow-sm">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold line-clamp-1 flex-1 pr-2">{item.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {item.timeAgo}
                  </span>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 flex justify-between items-center">
                <Badge variant="outline" className={`${getConditionColor(item.condition)}`}>
                  {item.condition}
                </Badge>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10" asChild>
                  <a href="/login">Claim as NGO</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}