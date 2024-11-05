"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  age: z.string(),
  dealflow: z.enum(["High", "Medium", "Low"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  investmentStage: z.enum(["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"]),
})

export default function InvestorSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      age: "",
      address: "",
      dealflow: "High",
      investmentStage: "Seed",
    },
  })

  useEffect(() => {
    const fetchInvestorData = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`/api/investor?id=${session.user.id}`)
          const investorData = response.data.investor
          if (investorData) {
            form.reset({
              name: investorData.name,
              phoneNumber: investorData.phoneNumber,
              age: investorData.age,
              address: investorData.address,
              dealflow: investorData.dealflow as "High" | "Medium" | "Low",
              investmentStage: investorData.investmentStage,
            })
          }
        } catch (error) {
          console.error("Error fetching investor data:", error)
        }
      }
    }

    fetchInvestorData()
  }, [session, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await axios.put("/api/investor", values)
      // Show success message
    } catch (error) {
      console.error("Error updating settings:", error)
      // Show error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Investor Settings</h1>

      <Tabs defaultValue="personal" className="space-y-8">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="disclosures">Disclosures</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and investment preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dealflow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dealflow</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dealflow state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />    

                  <FormField
                    control={form.control}
                    name="investmentStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Stage Preference</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select investment stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pre_Seed">Pre-Seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Level_A">Series A</SelectItem>
                            <SelectItem value="Level_B">Series B</SelectItem>
                            <SelectItem value="Level_C">Series C</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disclosures">
          <Card>
            <CardHeader>
              <CardTitle>Disclosures & Confidentiality</CardTitle>
              <CardDescription>
                Last updated March 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="default" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Investing in startups and early-stage companies involves substantial risk and may result in partial or total loss of investment.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2">Valuations</h3>
                  <p className="text-sm text-muted-foreground">
                    Investment values presented on this dashboard represent estimates of current value prepared in accordance with the methodologies described below.
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-2 text-sm text-muted-foreground">
                    <li>For early-stage companies, valuations are generally marked up or down to a company's latest priced round. Companies that do not have a new priced round since the last mark are held at the last mark or cost. Investments may also be marked down (but never up) at our discretion. This is an industry-standard method.</li>
                    <li>For later-stage companies, investments are sent to a third-party for valuation if the company is valued over $100M, the investment is estimated to be worth over $10M, and 24 months have passed since the last investment.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>VentureLink is not responsible for investment outcomes</li>
                    <li>Startup investments typically have a high failure rate</li>
                    <li>Investments are illiquid and may be held for extended periods</li>
                    <li>Past performance does not guarantee future results</li>
                    <li>Investment values may fluctuate significantly</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Confidentiality</h3>
                  <p className="text-sm text-muted-foreground">
                    All investment value estimates and return multiples are calculated net of any fees, expenses or carry. Estimated values for early-stage companies do not account for liquidation preferences and other non-financial terms that may affect returns. While VentureLink's valuation sources and company activity updates are believed to be reliable, we do not undertake to verify the accuracy of such sources.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}