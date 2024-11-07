"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Info, Search, X } from "lucide-react"
import { PitchModal } from "@/components/founder/PitchModal"
import { PendingPitches } from "./PendingPitches"
import axios from 'axios'
import { AcceptedPitches } from "./AcceptedPitches"

interface Filter {
  investmentStage?: ("Pre_Seed" | "Seed" | "Level_A" | "Level_B" | "Level_C")[]
  dealflow?: ("High" | "Medium" | "Low")[]
  activeDeals?: number
  totalInvestments?: number
  location?: string
}

interface Investor {
  id: string
  name: string
  phoneNumber: string
  username: string
  age: string
  investmentStage: "Pre_Seed" | "Seed" | "Level_A" | "Level_B" | "Level_C"
  dealflow: "High" | "Medium" | "Low"
  activeDeals: string
  totalInvestments: string
  address: string
}


interface InvestorCardProps {
  investor: {
    id: string
    name: string
    phoneNumber: string
    username: string
    age: string
    investmentStage: string
    dealflow: "High" | "Medium" | "Low"
    activeDeals: string
    totalInvestments: string
    address: string
  }
}


export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [investors, setInvestors] = useState<Investor[]>([])
  const [filters, setFilters] = useState<Filter>({})

  useEffect(() => {
    fetchInvestors()
  }, [searchQuery, filters])

  const fetchInvestors = async () => {
    try {
      let url = `/api/investor?`
      if (searchQuery) url += `name=${searchQuery}&`
      if (filters.investmentStage?.length) url += `investmentStage=${filters.investmentStage.join(',')}&`
      if (filters.dealflow?.length) url += `dealflow=${filters.dealflow.join(',')}&`
      if (filters.activeDeals) url += `activeDeals=${filters.activeDeals}&`
      if (filters.totalInvestments) url += `totalInvestments=${filters.totalInvestments}&`
      if (filters.location) url += `location=${filters.location}&`

      const res = await axios.get(url)
      if (res && res.data) {
        setInvestors(res.data.investors)
      } else setInvestors([])
    } catch (err) {
      console.log(`Error while fetching investors:`, err)
      setInvestors([])
    }
  }

  const toggleFilter = (category: keyof Filter, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[] | undefined
      if (current?.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) }
      } else {
        return { ...prev, [category]: [...(current || []), value] }
      }
    })
  }

  const removeFilter = (category: keyof Filter, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[] | undefined
      return { ...prev, [category]: current?.filter(v => v !== value) }
    })
  }

  const resetFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Find the best investors for your need!</h1>
      </div>

      <Tabs defaultValue="all-investors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-investors">All Investors</TabsTrigger>
          <TabsTrigger value="connected">Accepted Pitches</TabsTrigger>
          <TabsTrigger value="pending">Pending Pitches</TabsTrigger>
        </TabsList>

        <TabsContent value="all-investors">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{investors.length}</div>
                      <div className="text-sm text-muted-foreground">Matching Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{investors.reduce((sum, inv) => sum + parseInt(inv.activeDeals), 0)}</div>
                      <div className="text-sm text-muted-foreground">Active Investments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{investors.reduce((sum, inv) => sum + parseInt(inv.totalInvestments), 0)}</div>
                      <div className="text-sm text-muted-foreground">Total Investments</div>
                    </div>
                  </div>

                  <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-700">
                          Connect with top investors through our premium network
                        </span>
                      </div>
                      <Button variant="link" className="text-blue-700">
                        View Premium Access
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {investors.map((investor) => (
                      <InvestorCard investor={investor} key={investor.id} />
                    ))}
                  </div>
                </div>

                <Card className="h-fit">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">Filter by</h2>
                      <Button variant="ghost" className="h-auto p-0 text-primary" onClick={resetFilters}>
                        Reset
                      </Button>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search investors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Investment Stage</label>
                        <div className="flex flex-wrap gap-2">
                          {["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"].map((stage) => (
                            <Button
                              key={stage}
                              variant={filters.investmentStage?.includes(stage as any) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleFilter('investmentStage', stage)}
                            >
                              {stage.replace('_', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dealflow</label>
                        <div className="flex flex-wrap gap-2">
                          {["High", "Medium", "Low"].map((level) => (
                            <Button
                              key={level}
                              variant={filters.dealflow?.includes(level as any) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleFilter('dealflow', level)}
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Deals</label>
                        <Input
                          type="number"
                          placeholder="Minimum active deals"
                          value={filters.activeDeals || ''}
                          onChange={(e) => setFilters({ ...filters, activeDeals: parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Total Investments</label>
                        <Input
                          type="number"
                          placeholder="Minimum total investments"
                          value={filters.totalInvestments || ''}
                          onChange={(e) => setFilters({ ...filters, totalInvestments: parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="Enter location"
                          value={filters.location || ''}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                      </div>
                    </div>

                    {Object.entries(filters).some(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true)) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Filters</label>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(filters).map(([key, value]) => {
                            if (Array.isArray(value)) {
                              return value.map((v) => (
                                <Badge key={`${key}-${v}`} variant="secondary" className="flex items-center gap-1">
                                  {v.replace('_', ' ')}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(key as keyof Filter, v)} />
                                </Badge>
                              ))
                            } else if (value) {
                              return (
                                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                                  {`${key}: ${value}`}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, [key]: undefined })} />
                                </Badge>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
        </TabsContent>

        <TabsContent value="connected">
          <AcceptedPitches />
        </TabsContent>

        <TabsContent value='pending'>
            <PendingPitches/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function InvestorCard({ investor }: InvestorCardProps) {
  return (
    <Card key={investor.id} className="p-4">
      <CardContent className="flex items-center gap-4 p-4 relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {investor.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold truncate">{investor.name}</h3>
            <Badge variant={investor.dealflow === "High" ? "outline" : "secondary"}>
              {investor.dealflow}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {investor.activeDeals} active deals • {investor.totalInvestments} total investments
          </div>
          {
            (investor.investmentStage) ? 
              <div className="text-sm text-muted-foreground">
              Invests in {investor.investmentStage.replace('_', ' ')} • {investor.address}
            </div> : null
          }
        </div>
        <div className="absolute bottom-1 right-4">
          <PitchModal investorName={investor.name} investorId={investor.id} />
        </div>
      </CardContent>
    </Card>
  );
}
