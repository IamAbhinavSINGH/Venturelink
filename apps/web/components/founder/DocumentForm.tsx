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
import { toast } from "../ui/use-toast"
import { Loader2, X } from "lucide-react"

const documentsSchema = z.object({
  legalDocuments: z.array(z.string().url("Please enter a valid URL")),
})

type DocumentsValues = z.infer<typeof documentsSchema>

export function DocumentsForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      legalDocuments: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/company-settings")
        const data = response.data
        form.reset({
          legalDocuments: data.LegalDocumentsLink || [],
        })
      } catch (error) {
        console.error("Error fetching legal documents:", error)
        toast({
          variant: "destructive",
          
          title: "Error",
          description: "Failed to load legal documents",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [form])

  async function onSubmit(data: DocumentsValues) {
    try {
      setIsLoading(true)
      await axios.put("/api/company-settings", data)
      toast({
        title: "Success",
        description: "Legal documents updated successfully",
      })
    } catch (error) {
      console.error("Error updating legal documents:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update legal documents",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addDocument = () => {
    const currentDocs = form.getValues().legalDocuments
    form.setValue("legalDocuments", [...currentDocs, ""])
  }

  const removeDocument = (index: number) => {
    const currentDocs = form.getValues().legalDocuments
    form.setValue("legalDocuments", currentDocs.filter((_, i) => i !== index))
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
        {form.watch("legalDocuments").map((_, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`legalDocuments.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Legal Document ${index + 1}`}</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input {...field} placeholder="https://example.com/document.pdf" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="button" variant="outline" onClick={addDocument}>
          Add Document
        </Button>

        <FormDescription>
          Add links to your company's legal documents (e.g., incorporation papers, bylaws).
        </FormDescription>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}