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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Founder schema
const founderSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

// Investor schema
const investorSchema = founderSchema.extend({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  age : z.string()
});

type SignInFormProps = {
  role: 'investor' | 'founder'
}

export function SignInForm({ role }: SignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error , setErrorMessage] = useState<string>("");

  const schema = role === 'founder' ? founderSchema : investorSchema;
  const form = useForm<z.infer<typeof investorSchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "", // Will not be required for founder
      country: "", // Will not be required for founder
      age : ""
    },
  });

  async function onSubmit(values: z.infer<typeof investorSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    const data = {
      name: values.name,
      username: values.email,  
      password: values.password,
      phoneNumber: values.phoneNumber,
      type: role,
      address: role === "investor" ? values.address : undefined,
      country: role === "investor" ? values.country : undefined,
      age: role === "investor" ? values.age : undefined,
    };
    

    console.log("inside signin onSubmit , data : " , data);
    
    const res = await signIn("credentials", {
      ...data,
      redirect : false
    });

    console.log("res" , res);
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className='text-center'>Sign In as {role === "founder" ? "Founder" : "Investor"}</CardTitle>
        <CardDescription className='text-center'>Enter your details to sign in as a {role.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
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
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === 'investor' && (
              <>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input placeholder="18" {...field} />
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
                        <Input placeholder="123 Main St, City, State" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="pk">Pakistan</SelectItem>
                          <SelectItem value="bu">Bhutan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {error && <div><p className='text-sm text-rose-900'>{error}</p></div>}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
    
        <div>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href={`/login?role=${role}`} className="text-blue-600 hover:underline">
              login
            </a>
          </p>
        </div>
        <div>
            <p className='text-sm text-gray-500'>
                Sign in as {" "}
                <a href={`/signin?role=${(role === 'founder') ? 'investor' : 'founder'}`} className="text-blue-600 hover:underline">
                  {(role === 'founder') ? "Investor" : "Founder"}
                </a>
            </p>
        </div>
      </CardFooter>
    </Card>
  );
}
