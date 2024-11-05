"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "../ui/use-toast"
import axios from "axios"

const pitchFormSchema = z.object({
  stage: z.enum(["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"]),
  instrumentType: z.enum(["SAFE", "Equity"]),
  safeType: z.enum(["POST_ROUND", "PRE_ROUND"]),
  target: z.string().transform((val) => parseInt(val, 10)),
  pitchDescription: z.string().min(10, "Description must be at least 10 characters"),
  bankInfo: z.string().optional(),
  videoLink: z.string().optional()
})

type PitchFormValues = z.infer<typeof pitchFormSchema>

const defaultValues: Partial<PitchFormValues> = {
  stage: "Pre_Seed",
  instrumentType: "SAFE",
  safeType: "POST_ROUND",
}

interface PitchModalProps {
    investorId : string
    investorName: string
}

export function PitchModal({ investorName , investorId }: PitchModalProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const searchParams = useSearchParams();
  const companyId = searchParams.get('company');

  const form = useForm<PitchFormValues>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues,
  })

  async function onSubmit(data: PitchFormValues) {
    try {

      const response = await axios.post("/api/founder/pitch", {
        ...data,
        investorId : investorId,
        companyId : companyId
      });

      console.log(`response  : ` , response);

      toast({
        title: "Success",
        description: "Your pitch has been submitted successfully.",
      })

      setOpen(false)
      form.reset()

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit pitch. Please try again.",
      })

      console.log(`error while creating pitch : ` , error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' >Make a Pitch</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-background sticky top-0 z-10">
          <DialogTitle>Create a Pitch for {investorName}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your investment pitch.
          </DialogDescription>
          
        </DialogHeader>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raise Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
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

              <FormField
                control={form.control}
                name="instrumentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instrument Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instrument type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SAFE">SAFE</SelectItem>
                        <SelectItem value="Equity">Equity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="safeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SAFE Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SAFE type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="POST_ROUND">Post-Money</SelectItem>
                        <SelectItem value="PRE_ROUND">Pre-Money</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter target amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pitchDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pitch Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your pitch..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Information (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="px-6 py-4 bg-background sticky bottom-0 z-10 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Submit Pitch</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}