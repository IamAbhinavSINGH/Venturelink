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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "../ui/use-toast"
import { EntityType } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

const companyDetailsSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  entityType: z.nativeEnum(EntityType),
  description: z.string().optional(),
})

type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>

export function CompanyDetailsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company');

  const form = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      name: "",
      address: "",
      country: "",
      entityType: EntityType.LLC,
      description: "",
    },
  })

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/api/founder/company?company=${companyId}`)
        const data = response.data.company;
        form.reset({
          name: data.name,
          address: data.address,
          country: data.country,
          entityType: data.entityType,
          description: data.description || "",
        })
      } catch (error) {
        console.error("Error fetching company details:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company details",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [form])

  async function onSubmit(data: CompanyDetailsValues) {
    try {
      setIsLoading(true)
      await axios.put(`/api/founder/company?company=${companyId}`, data)

      toast({
        title: "Success",
        description: "Company details updated successfully",
      });
      
    } catch (error) {
      console.error("Error updating company details:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company details",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
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
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(EntityType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your company..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of your company and its mission.
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