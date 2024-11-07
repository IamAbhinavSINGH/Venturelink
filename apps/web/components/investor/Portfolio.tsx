"use client"

import { useState } from "react"
import { Search, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioInsights } from "./PortfolioInsigths"

interface InvestmentOption {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  bgColor: string;
}

const investmentOptions: InvestmentOption[] = [
  {
    title: "Syndicates",
    description: "Invest directly into startups alongside top VCs",
    icon: "📈",
    buttonText: "Browse",
    bgColor: "bg-white",
  },
  {
    title: "Venture Funds",
    description: "Browse and apply to invest in venture funds",
    icon: "🎯",
    buttonText: "Browse",
    bgColor: "bg-green-50",
  },
  {
    title: "Rolling Funds",
    description: "Subscribe quarterly and adjust your investment size as your goals evolve",
    icon: "🔄",
    buttonText: "Browse",
    bgColor: "bg-purple-50",
  },
  {
    title: "Wishlist",
    description: "Build your investing wishlist and we'll notify you if there's an opportunity",
    icon: "⭐",
    buttonText: "Get started",
    bgColor: "bg-yellow-50",
  },
]

export function Portfolio() {

    const [ currentTab , setCurrentTab ] = useState<string>("Portfolio");


  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">{currentTab}</h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
            <TabsTrigger value="dashboard" onClick={() => { setCurrentTab("Portfolio") }}>Dashboard</TabsTrigger>
            <TabsTrigger value="insights" onClick={() => { setCurrentTab("Insights") }}>Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>

        <TabsContent value="insights">
          <PortfolioInsights />
        </TabsContent>
        
      </Tabs>
    </div>
  )
}


function Dashboard(){
    const [searchQuery, setSearchQuery] = useState("");


    return (
        <div className="space-y-12 mt-10">
            <div className="space-y-3">
                <p className="text-muted-foreground">
                    Here are a few ways you can build out your investment portfolio
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {investmentOptions.map((option) => (
                    <Card key={option.title} className={`${option.bgColor} border-none`}>
                        <CardHeader>
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <CardTitle>{option.title}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Button variant="outline" className="bg-white">
                            {option.buttonText}
                        </Button>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">Investments</h2>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Companies, funds, leads"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                    <p className="text-muted-foreground">
                            Your investments will be shown here
                    </p>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>
                            Company/Fund
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        <TableHead>
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        <TableHead>
                            Invest Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        <TableHead>
                            Funded
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        <TableHead>
                            Net Value
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        <TableHead>
                            Multiple
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            No data
                        </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                Unrealized value represents the estimated value of an investment net of fees and carry.
                </p>
                <p>
                Realized value represents the value of an investment that has been distributed or is pending distribution to an investor.
                </p>
                <p>
                The internal rate of return (IRR) is the highest discount rate that sets the net present value (NPV) of the cashflows of an investor's portfolio to 0. IRRs may not be calculable for certain portfolios.
                </p>
                <p>
                All multiples are calculated as the Total Value to Paid In multiple (TVPI).
                </p>
                <p>
                All data and calculations include self-reported investment amounts, unrealized and realized values, and investment dates for offline investments. AngelList will not verify any self-reported or offline investments, or any resulting calculations or values based on such information.
                </p>
            </div>
        </div>
    );
}