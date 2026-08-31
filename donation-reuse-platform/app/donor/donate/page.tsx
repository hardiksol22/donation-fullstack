'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake } from "lucide-react";

export default function DonateItemsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [ngos, setNgos] = useState<{ _id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    category: 'Clothes',
    quantity: 1,
    condition: 'Gently Used',
    pickupAddress: '',
    pickupDate: '',
    selectedNgo: '',
  });

  // Fetch verified NGOs
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        // Updated API route to match standard REST patterns (adjust if your backend differs)
        const response = await api.get('/api/ngos'); 
        setNgos(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to load NGOs', err);
        // Silently fail here so the form still works even if NGOs can't be loaded initially
      }
    };
    fetchNGOs();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const donorId = localStorage.getItem('userId') || 'placeholder-id'; 

      const payload = {
        donorId: donorId,
        category: formData.category,
        quantity: Number(formData.quantity),
        condition: formData.condition,
        pickupAddress: formData.pickupAddress,
        scheduledTime: formData.pickupDate,
        ngoId: formData.selectedNgo || null,
      };

      await api.post('/api/donations', payload);
      
      alert('Your donation request has been scheduled successfully! ✨');
      router.push('/donor/history');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule donation.');
    } finally {
      setLoading(false);
    }
  };

  // Tailwind class for native select styling to match shadcn
  const selectStyles = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10 px-4">
      <Card className="w-full max-w-2xl shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <HeartHandshake className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Schedule a Donation</CardTitle>
          <CardDescription className="text-md">
            Provide the details of the items you wish to donate. Our partners will collect them from your doorstep.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="p-3 mb-6 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Item Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight border-b pb-2">Item Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className={selectStyles}>
                  <option value="Clothes">Clothes</option>
                  <option value="Household Items">Household Items</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <select id="condition" name="condition" value={formData.condition} onChange={handleChange} className={selectStyles}>
                    <option value="New">New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Logistics Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight border-b pb-2">Pickup Logistics</h3>
              
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <Textarea 
                  id="pickupAddress" 
                  name="pickupAddress" 
                  rows={3} 
                  value={formData.pickupAddress} 
                  onChange={handleChange} 
                  placeholder="Enter your full address for doorstep collection" 
                  required 
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Preferred Date & Time</Label>
                  <Input id="pickupDate" type="datetime-local" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selectedNgo">Select NGO (Optional)</Label>
                  <select id="selectedNgo" name="selectedNgo" value={formData.selectedNgo} onChange={handleChange} className={selectStyles}>
                    <option value="">Any Available NGO</option>
                    {ngos.map(ngo => (
                      <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-md font-semibold" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Pickup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}