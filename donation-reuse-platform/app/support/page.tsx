"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LifeBuoy, Loader2, Send, MessageSquareWarning, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface Dispute {
  _id: string;
  subject: string;
  description: string;
  status: string;
  adminResponse?: string;
  createdAt: string;
}

export default function SupportPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ subject: "", description: "" })

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    try {
      const response = await api.get('/api/disputes')
      setDisputes(response.data.data)
    } catch (error) {
      toast.error("Failed to load your support tickets.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const response = await api.post('/api/disputes', formData)
      setDisputes([response.data.data, ...disputes])
      setFormData({ subject: "", description: "" })
      toast.success("Ticket submitted successfully! Support team will respond soon.")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit ticket.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <LifeBuoy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground">Report issues with donations, pickups, or platform bugs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CREATE TICKET FORM */}
          <div className="md:col-span-1">
            <Card className="border-primary/10 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Submit a Ticket</CardTitle>
                <CardDescription>Tell us what went wrong.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="e.g. NGO didn't arrive" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Details</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Please explain the issue..." 
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gap-2" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Report
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* PAST TICKETS */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <MessageSquareWarning className="h-5 w-5 text-muted-foreground" />
              Your Recent Tickets
            </h3>
            
            {disputes.length === 0 ? (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-3" />
                  <p>You haven't reported any issues yet.</p>
                </CardContent>
              </Card>
            ) : (
              disputes.map((ticket) => (
                <Card key={ticket._id} className={ticket.status === 'Resolved' ? 'border-l-4 border-l-emerald-500 opacity-90' : 'border-l-4 border-l-amber-500'}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <Badge variant={ticket.status === 'Resolved' ? 'default' : 'secondary'} className={ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500 text-white hover:bg-amber-600'}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <CardDescription>{new Date(ticket.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-foreground/80 mb-4">{ticket.description}</p>
                    
                    {ticket.status === 'Resolved' && ticket.adminResponse && (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Admin Response:</p>
                        <p className="text-muted-foreground">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}