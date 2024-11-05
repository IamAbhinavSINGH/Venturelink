'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn } from 'next-auth/react'
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

type LoginFormProps = {
  role: 'investor' | 'founder'
}

export function LoginForm({ role }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error , setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
      setIsLoading(true)
      setErrorMessage("");
    
      const data = { username : values.username , password : values.password , type : role }
      const res = await signIn("credentials", { ...data, redirect : false });
  
      setIsLoading(false);
    
      if (!res?.error) {
        router.push('/auth');
      } 
      else {
        if (res.status === 401) {
          setErrorMessage("Invalid Credentials, try again!")
        } else if (res.status === 400) {
          setErrorMessage("Missing Credentials!");
        } else if (res.status === 404) {
          setErrorMessage("Account not found!")
        } else if (res.status === 403) {
          setErrorMessage("Forbidden!");
        } else {
          setErrorMessage("oops something went wrong...!");
        }
    }
  }

  return (
      <div>
           <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className='text-center'>Login as {(role === 'founder') ? "Founder" : "Investor"}</CardTitle>
              <CardDescription className='text-center'>Enter your credentials to login as a {role.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
              {
                (error != null && error.length > 0 ) ? 
                  <div>
                    <p className='text-red-800 text-sm'> {error} </p>
                  </div> : ""
              }

              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <a href={`/signin?role=${role}`}  className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
              <p className='text-sm text-gray-500'>
                  Login as {" "}
                  <a href={`/login?role=${(role === 'founder') ? 'investor' : 'founder'}`} className="text-blue-600 hover:underline">
                    {(role === 'founder') ? "Investor" : "Founder"}
                  </a>
              </p>
            </CardFooter>
          </Card>
      </div>
  )
}