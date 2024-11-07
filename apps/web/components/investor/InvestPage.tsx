"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {  Search, Filter, Loader2 } from "lucide-react"
import axios from 'axios'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { InvitesSection } from "./InvitesSection"

interface FilterType {
  fundingStage? : ("Pre_Seed" | "Seed" | "Level_A" | "Level_B" | "Level_C")[],
  location? : string,
  minValuationRange? : number,
  maxValuationRange? : number,
  entityType? : ("Ccorp" | 'LLC' | 'PBC')[],
  industry? : ( 'AI_or_ML' | 'Other' | 'Developers_Tools' | 'Finance' | 'HealthCare' |
     'Blockchain_or_Cryptocurrency' | 'BioTech' | 'Robotics' | 'Health' | 'E_Commerce' | 'Security')[]
}

interface Startup {
  id: string
  name: string
  description: string
  fundingStage: "Pre_Seed" | "Seed" | "Level_A" | "Level_B" | "Level_C"
  industry: 'AI_or_ML' | 'Other' | 'Developers_Tools' | 'Finance' | 'HealthCare' |
     'Blockchain_or_Cryptocurrency' | 'BioTech' | 'Robotics' | 'Health' | 'E_Commerce' | 'Security'
  totalCapitalRaised: string
  address: string
  country : string
  website : string
  entityType : "Ccorp" | 'LLC' | 'PBC'
}

interface StartupCardProps {
  startup: Startup
}

export default function InvestPage() {
  const [isLoading , setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [startups, setStartups] = useState<Startup[]>([])
  const [filters, setFilters] = useState<FilterType>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchStartups()
  }, [searchQuery, filters])

  const fetchStartups = async () => {
    setLoading(true);
    try {
      let url = `/api/founder/company/bulk?`
      if (searchQuery) url += `name=${searchQuery}&`
      if (filters.fundingStage?.length) url += `fundingStage=${filters.fundingStage.join(',')}&`
      if (filters.industry?.length) url += `industry=${filters.industry.join(',')}&`
      if (filters.entityType?.length) url += `entityType=${filters.entityType.join(',')}&`
      if (filters.location) url += `location=${filters.location}&`
      if (filters.maxValuationRange) url += `maxValuationRange=${filters.maxValuationRange}&`
      if(filters.minValuationRange) url += `minValuationRange=${filters.minValuationRange}`

      const res = await axios.get(url);

      if (res && res.data) {
        setStartups(res.data.companies);
      } else setStartups([]);

    } catch (err) {
      console.log(`Error while fetching startups:`, err)
      setStartups([]);
    } finally{
      setLoading(false);
    }
  }

  const toggleFilter = (category: keyof FilterType, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[] | undefined
      if (current?.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) }
      } else {
        return { ...prev, [category]: [...(current || []), value] }
      }
    })
  }

  const resetFilters = () => {
    setFilters({})
    setSearchQuery("")
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Explore Promising Startups</h1>
      </div>

      <Tabs defaultValue="startups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="startups">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Filter className="mr-2 h-4 w-4" />
                      Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="py-6 overflow-y-auto max-h-screen">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                        Refine your startup search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Funding Stage</label>
                      <div className="flex flex-wrap gap-2">
                        {["Pre_Seed" , "Seed" , "Level_A" , "Level_B" , "Level_C"].map((stage) => (
                          <Button
                            key={stage}
                            variant={filters.fundingStage?.includes(stage as any) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFilter('fundingStage', stage)}
                          >
                            {stage.replaceAll('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <div className="flex flex-wrap gap-2">
                        {['AI_or_ML' , 'Other' , 'Developers_Tools' , 'Finance' , 'HealthCare' ,
     'Blockchain_or_Cryptocurrency' , 'BioTech' , 'Robotics' , 'Health' , 'E_Commerce' , 'Security'].map((industry) => (
                          <Button
                            key={industry}
                            variant={filters.industry?.includes(industry as any) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFilter('industry', industry)}
                          >
                            {industry.replaceAll('_' , ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Startup Type </label>
                      <div className="flex flex-wrap gap-2">
                        {["Ccorp" , 'LLC' , 'PBC'].map((entityType) => (
                          <Button
                            key={entityType}
                            variant={filters.entityType?.includes(entityType as any) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFilter('entityType', entityType)}
                          >
                            {entityType.replaceAll('_' , ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valuation Range</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minValuationRange || ''}
                          onChange={(e) => setFilters({ ...filters, minValuationRange: parseInt(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxValuationRange || ''}
                          onChange={(e) => setFilters({ ...filters, maxValuationRange: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        placeholder="Enter location"
                        value={filters.location || ''}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      />
                    </div>

                    <Button onClick={resetFilters} variant="outline" className="w-full">
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {
              (isLoading) ? 
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              :
                <div>
                  {
                    (startups.length === 0) ? 
                      <div className="mt-10 flex items-center justify-center">
                          <p className="text-muted-foreground">No startups found</p>
                      </div>
                    : 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {
                        startups.map((startup) => (
                            <StartupCard key={startup.id} startup={startup} />
                        ))
                      }
                    </div>
                  }
                </div>
            }
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <InvitesSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StartupCard({ startup }: StartupCardProps) {
  return (
    <Card key={startup.id}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{startup.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{startup.name}</h3>
            <div className="text-sm text-muted-foreground mt-1">
               {
                startup.entityType ? (
                  `${startup.entityType.replaceAll('_' , ' ')} • ${startup.country}`
                ) : null
               }
            </div>
          </div>
          { 
            startup.industry ? (
              <Badge variant="outline">{startup.industry.replaceAll('_' , ' ')}</Badge>
            ) : null
          }
        </div>
        <p className="mt-3 text-sm">{startup.description}</p>
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          {
            startup.totalCapitalRaised ? (
              <span>Valuation: ${startup.totalCapitalRaised.toLocaleString()}</span>
            ) : null
          }
          {
            startup.fundingStage ? (
              <span>{startup.fundingStage.replaceAll('_' , ' ')}</span>
            ) : null
          }
        </div>
        <Button className="w-full mt-4">View Details</Button>
      </CardContent>
    </Card>
  )
}