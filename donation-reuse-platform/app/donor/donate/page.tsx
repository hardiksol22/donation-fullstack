"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/lib/api"
import { Loader2, UploadCloud, MapPin, Package, Calendar } from "lucide-react"

export default function DonatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "Gently Used",
    quantity: 1,
    description: "",
    pickupAddress: "",
    scheduledTime: "",
  })

  // 🔥 FIX 1: Use 'prev' state to prevent data loss (Stale Closure Fix)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImageToCloudinary = async (file: File) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "daansetu_uploads") 
    data.append("cloud_name", "xw8menbd") 

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/xw8menbd/image/upload", {
        method: "POST",
        body: data,
      })

      if (!res.ok) {
        const errData = await res.json()
        console.error("Cloudinary Detailed Error:", errData)
        throw new Error("Cloudinary rejected the upload")
      }

      const uploadedImage = await res.json()
      return uploadedImage.secure_url
    } catch (error) {
      console.error("Cloudinary Upload Error:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category) {
      return toast.error("Please select a category.")
    }

    try {
      setLoading(true)
      let imageUrl = ""

      if (imageFile) {
        toast.info("Uploading image...", { id: "upload-toast" })
        imageUrl = await uploadImageToCloudinary(imageFile)
        
        if (!imageUrl) {
          toast.error("Image upload failed. Check your Cloudinary preset.", { id: "upload-toast" })
          throw new Error("Image upload failed")
        }
      }

      const finalData = {
        ...formData,
        imageUrl,
      }

      await api.post('/api/donations', finalData)
      
      toast.success("✨ Donation Request Created Successfully!", { id: "upload-toast" })
      router.push("/donor/history") 
    } catch (error: any) {
      console.error("Donation creation error:", error)
      const errorMsg = error.response?.data?.message || "Failed to create request. Please try again."
      toast.error(errorMsg, { id: "upload-toast" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="border-primary/10 shadow-lg">
        <CardHeader className="space-y-1 text-center bg-muted/30 pb-8 pt-8 border-b">
          <div className="flex justify-center mb-2">
            <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-sm">
              <Package className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Donate an Item</CardTitle>
          <CardDescription className="text-base">
            Fill in the details below to schedule a pickup by a verified NGO.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            
            <div className="space-y-2">
              <Label>Item Photo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/10 relative">
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-40 object-contain rounded-md" />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input 
                  id="title" name="title" 
                  placeholder="e.g., Men's Winter Jacket" 
                  required 
                  value={formData.title} onChange={handleChange} 
                />
              </div>

              {/* 🔥 FIX 2: Added `value={formData.category}` to tightly control the Select */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clothes">Clothes</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 🔥 FIX 3: Changed 'Heavily Used' to 'Fair' to match MongoDB strict enum */}
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={formData.condition} onValueChange={(val) => handleSelectChange("condition", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New (Unused)</SelectItem>
                    <SelectItem value="Gently Used">Gently Used</SelectItem>
                    <SelectItem value="Fair">Fair / Heavily Used</SelectItem> 
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" name="quantity" 
                  type="number" min="1" 
                  required 
                  value={formData.quantity} onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" name="description" 
                placeholder="Briefly describe the item (size, brand, any defects)..." 
                className="resize-none" rows={3}
                value={formData.description} onChange={handleChange} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="pickupAddress" name="pickupAddress" 
                    placeholder="Full street address..." 
                    className="pl-9" required 
                    value={formData.pickupAddress} onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Preferred Pickup Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="scheduledTime" name="scheduledTime" 
                    type="datetime-local" 
                    className="pl-9" required 
                    value={formData.scheduledTime} onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

          </CardContent>
          
          <CardFooter className="bg-muted/10 p-6 border-t mt-2">
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Request...</>
              ) : (
                "Schedule Pickup"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}