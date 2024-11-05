"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "../ui/use-toast"
import { Industry } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation";

const websiteIndustrySchema = z.object({
  website: z.string().url("Please enter a valid URL"),
  industry: z.nativeEnum(Industry),
})

type WebsiteIndustryValues = z.infer<typeof websiteIndustrySchema>

export function WebsiteIndustryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company');

  const form = useForm<WebsiteIndustryValues>({
    resolver: zodResolver(websiteIndustrySchema),
    defaultValues: {
      website: "",
      industry: Industry.Other,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/api/founder/company?company=${companyId}`);
        const data = response.data.company;

        form.reset({
          website: data.website || "",
          industry: data.industry || Industry.Other,
        });

      } catch (error) {
        console.error("Error fetching company data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  async function onSubmit(data: WebsiteIndustryValues) {
    try {
      setIsLoading(true)
      await axios.put(`/api/founder/company?company=${companyId}`, data);

      toast({
        title: "Success",
        description: "Website and industry information updated successfully",
      });

    } catch (error) {
      console.error("Error updating company data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company data",
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
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>Your company's official website</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Industry).map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the primary industry of your company</FormDescription>
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