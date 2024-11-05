"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
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
import { useSearchParams } from "next/navigation";

const teamMembersSchema = z.object({
  teamMembers: z.string().min(1, "Please enter at least one team member"),
})

type TeamMembersValues = z.infer<typeof teamMembersSchema>

export function TeamMembersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company');

  const form = useForm<TeamMembersValues>({
    resolver: zodResolver(teamMembersSchema),
    defaultValues: {
      teamMembers: "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/api/founder/company?company=${companyId}`);
        const data = response.data.company;

        form.reset({
          teamMembers: data.teamMembers || "",
        })

      } catch (error) {
        console.error("Error fetching team members:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load team members",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  async function onSubmit(data: TeamMembersValues) {
    try {
      setIsLoading(true)
      await axios.put(`/api/founder/company?company=${companyId}`, data);
      toast({
        title: "Success",
        description: "Team members updated successfully",
      })
    } catch (error) {
      console.error("Error updating team members:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update team members",
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
          name="teamMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Members</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List your team members, one per line..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the names of your team members, one per line. Include their roles if desired.
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