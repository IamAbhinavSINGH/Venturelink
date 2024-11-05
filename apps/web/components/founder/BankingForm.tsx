"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"

const bankingSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z.string().min(1, "Routing number is required"),
  additionalInfo: z.string().optional(),
})

type BankingValues = z.infer<typeof bankingSchema>

export function BankingForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BankingValues>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      additionalInfo: "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/company-settings")
        const data = response.data
        form.reset({
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          routingNumber: data.routingNumber || "",
          additionalInfo: data.additionalBankInfo || "",
        })
      } catch (error) {
        console.error("Error fetching banking information:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load banking information",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  async function onSubmit(data: BankingValues) {
    try {
      setIsLoading(true)
      await axios.put("/api/company-settings", data)
      toast({
        title: "Success",
        description: "Banking information updated successfully",
      })
    } catch (error) {
      console.error("Error updating banking information:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banking information",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>This information is encrypted and stored securely.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="routingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routing Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional banking information..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any additional banking details or notes here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}