"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from 'axios'
import { useSearchParams } from "next/navigation"

interface Pitch {
  id: number
  companyId: number
  raiseStage: "Pre_Seed" | "Seed" | "Level_A" | "Level_B" | "Level_C"
  instrumentType: "SAFE" | "Equity"
  safeType: "POST_ROUND" | "PRE_ROUND"
  description: string
  createdAt: string
  status: "Pending" | "Rejected" | "Accepted"
  target: number
  investorid: number
  investor?: {
    name: string
  }
  company?: {
    name: string
  }
}

export function AcceptedPitches() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams();

  const companyId = searchParams.get('company');

  useEffect(() => {
    fetchAcceptedPitches()
  }, [])

  const fetchAcceptedPitches = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/founder/pitch?status=Accepted&company=${companyId}`)
      setPitches(response.data.pitches)
    } catch (err) {
      console.error('Error fetching accepted pitches:', err)
      setError('Failed to load accepted pitches')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (pitches.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50 max-w-2xl mx-auto">
        <p className="text-muted-foreground">No accepted pitches found</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Accepted Pitches</h2>
        <Button onClick={fetchAcceptedPitches} variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      
      {pitches.map((pitch) => (
        <Card key={pitch.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {pitch.company?.name || 'Company Name Unavailable'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Investor: {pitch.investor?.name || 'Investor Name Unavailable'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline">{pitch.raiseStage.replace('_', ' ')}</Badge>
                <Badge variant="secondary">{pitch.instrumentType}</Badge>
                <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Investment Details</p>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">
                    <span className="text-muted-foreground">Target Amount:</span>{' '}
                    {formatCurrency(pitch.target)}
                  </li>
                  <li className="text-sm">
                    <span className="text-muted-foreground">SAFE Type:</span>{' '}
                    {pitch.safeType.replace('_', ' ')}
                  </li>
                  <li className="text-sm">
                    <span className="text-muted-foreground">Accepted Date:</span>{' '}
                    {formatDate(pitch.createdAt)}
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium">Pitch Description</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {pitch.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="default" size="sm">
                Contact Investor
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}