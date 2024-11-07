"use client"

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Settings, FileText, Repeat } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardHome() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company')
  const raisedAmount = 527000
  const totalAmount = 2000000

  const session = useSession();
  const name = session.data?.user.name?.split(' ')[0];
  const router = useRouter();

  const handleClick = async() =>{
      router.push(`/founder/dashboard/explore?company=${companyId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium">Welcome, {name}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Start raising</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create a round or RUV, invite investors, and close quickly.</p>
            <div className="space-y-2">
              <Button onClick={() => { handleClick() }}> Get started </Button>
              <Button variant="outline" className='ml-4'>View FAQs</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pre-Seed Round</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="inline-block bg-yellow-300 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                Raising
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">TOTAL RAISED</p>
            <p className="text-2xl font-bold mb-2">
                ₹ {raisedAmount.toLocaleString()}/{totalAmount.toLocaleString()}
            </p>
            <Progress value={(raisedAmount / totalAmount) * 100} className="mb-2" />
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">16 investors</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your tasks (2)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <div className='ml-2'>
                  <p className="font-medium">Add Option Holders</p>
                  <p className="text-sm text-muted-foreground">Sync your human resources platform and add employees.</p>
                </div>
              </li>
              <li className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <div className='ml-2'>
                  <p className="font-medium">Invite admin users</p>
                  <p className="text-sm text-muted-foreground">Grant admin privileges to your team and other service providers like law firms and accountants.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Draft grant
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Make offer
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Repeat className="mr-2 h-4 w-4" />
                  New round
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Ask VentureLink Assistant",
                description: "Meet your new assistant. Shortcut equity management and get insights from our AI-powered chat.",
                icon: Sparkles,
                action: "Explore Equity Assistant"
              },
              {
                title: "Tie Out Assistant",
                description: "Ensure that your cap table matches the underlying legal documents, powered by AI.",
                icon: Settings,
                action: "Explore Tie Out Assistant"
              },
              {
                title: "Equity Blocks",
                description: "Instantly issue equity. Equity Blocks eliminate the need for board consent for every grant.",
                icon: FileText,
                action: "Explore Equity Blocks"
              },
              {
                title: "SAFE Cleanups",
                description: "Clean up your cap table. Consolidate your SAFEs for faster equity rounds and lower costs.",
                icon: Repeat,
                action: "Explore SAFEs"
              }
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="link" className="p-0 text-blue-600">
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}