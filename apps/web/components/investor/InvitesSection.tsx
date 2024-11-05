"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { Loader2 } from 'lucide-react'

interface Pitch {
  id: number
  company: {
    name: string
    industry: string
  }
  raiseStage: string
  instrumentType: string
  safeType: string
  description: string
  target: number
  status: 'Pending' | 'Accepted' | 'Rejected'
  createdAt: string
}

export function InvitesSection() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [filteredPitches, setFilteredPitches] = useState<Pitch[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('Pending')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchPitches()
  }, [statusFilter]) 

  useEffect(() => {
    filterPitches()
  }, [pitches, searchQuery])

  const fetchPitches = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/investor/pitch', {
        params: {
          status: statusFilter,
        },
      })
      
      setPitches(response.data.pitches)
    } catch (error) {
      console.error('Error fetching pitches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPitches = () => {
    let filtered = pitches
    if (searchQuery) {
      filtered = filtered.filter((pitch) =>
        pitch.company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredPitches(filtered)
  }

  const handleStatusChange = async (pitchId: number, newStatus: 'Accepted' | 'Rejected') => {
    try {
      await axios.put(`/api/investor/pitch?pitch=${pitchId}`, { status: newStatus } );

      // After updating the status, fetch the pitches again
      fetchPitches()

    } catch (error) {
      console.error('Error updating pitch status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invites</h2>
        <div className="flex space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search by company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {
            (filteredPitches.length === 0) ? 
              <div className='flex justify-center items-center'>
                <p className='text-muted-foreground'>There aren't any pitches yet with this status.</p>
              </div> :
            filteredPitches.map((pitch) => (
              <Card key={pitch.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{pitch.company.name}</h3>
                      <p className="text-sm text-muted-foreground">{pitch.company.industry.replaceAll('_' , ' ')}</p>
                    </div>
                      <Badge variant={(pitch.status === 'Pending') ? 'outline' : 'default'} 
                        className={(pitch.status === 'Accepted') ? 'bg-green-100 text-green-800' 
                          : (pitch.status === 'Rejected') ?'bg-red-100 text-red-800' : ''}>
                        {pitch.status}
                      </Badge>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Stage:</strong> {pitch.raiseStage.replaceAll('_' , ' ')}</p>
                    <p><strong>Instrument:</strong> {pitch.instrumentType.replaceAll('_' , ' ')} ({pitch.safeType.replaceAll('_ ' , ' ')})</p>
                    <p><strong>Target:</strong> ${pitch.target.toLocaleString()}</p>
                    <p className="text-sm">{pitch.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-6">
                  {pitch.status === 'Pending' && (
                    <div className="flex justify-end space-x-2 w-full">
                      <Button variant="outline" onClick={() => handleStatusChange(pitch.id, 'Rejected')}>
                        Reject
                      </Button>
                      <Button onClick={() => handleStatusChange(pitch.id, 'Accepted')}>
                        Accept
                      </Button>
                    </div>
                  )}
                  {pitch.status !== 'Pending' && (
                    <p className="text-sm text-muted-foreground">
                      {pitch.status} on {new Date(pitch.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))
          }
        </div>
      )}
    </div>
  )
}