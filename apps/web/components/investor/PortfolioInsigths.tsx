"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface MarketData {
  name: string
  percentage: number
}

const marketData: MarketData[] = [
  { name: "AI / ML", percentage: 24 },
  { name: "Finance", percentage: 8.6 },
  { name: "SaaS", percentage: 7.8 },
  { name: "Other", percentage: 5.9 },
  { name: "Biotech", percentage: 5.2 },
]

function HorizontalBar({ percentage, color = "bg-blue-100" }: { percentage: number; color?: string }) {
  return (
    <div className="relative h-8 w-full bg-gray-50 rounded">
      <div
        className={`absolute left-0 top-0 h-full ${color} rounded transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function PortfolioInsights() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mt-10">
        <h4 className="text-xl font-semibold tracking-tight">Portfolio Insights</h4>
        <span className="text-sm text-muted-foreground">
          For investments with displayed valuations
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">The Top Markets on AngelList</h3>
              <p className="text-sm text-muted-foreground">
                by % of investments in past 3 months
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {marketData.map((market) => (
            <div key={market.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{market.name}</span>
                <span className="font-medium">{market.percentage}%</span>
              </div>
              <HorizontalBar percentage={market.percentage} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Alert variant="default" className="flex flex-row items-center justify-start bg-blue-50 text-blue-900 border-blue-100">
        <Info className="h-4 w-4" />
        <AlertDescription>
          More investment data needed: If the leads you invest with enable more investment valuations, 
          you will see more performance-based insights
        </AlertDescription>
      </Alert>

      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          Past performance is not indicative of future returns.
        </p>
        <p>
          Portfolio comparison to the Venturelink Platform is a measure of the investor's Total Value to 
          Paid In multiple (TVPI), as of 90 days ago, compared to the TVPI of all finalized investments 
          on the AngelList platform, as of August 20, 2024.
        </p>
      </div>
    </div>
  )
}