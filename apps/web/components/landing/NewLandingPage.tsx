'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Plus, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import PlatformImage from "../../images/platform.jpg"
import { useSession } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export default function Component() {
    const { data : session } = useSession();
    const userInitial = session?.user?.name ? session.user.name[0].toUpperCase() : ''

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">VentureLink</h1>
            </div>
            {
                !session ? (
                    <div className="flex items-center space-x-4">
                        <Link href={`/signin?role=investor`}>
                            <Button variant="ghost" className="text-gray-900 border-transparent rounded-full hover:bg-gray-800 hover:text-white">Sign in as investor</Button>
                        </Link>
                        <Link href={`/signin?role=founder`}>
                            <Button variant="outline" className="text-gray-900 border-transparent rounded-full hover:bg-gray-800 hover:text-white">Sign in as founder</Button>
                        </Link>
                    </div> 
                )
                : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>
                            <Link href="/investor/get-started" className="w-full">View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/investor/get-started" className="w-full">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/api/auth/signout" className="w-full">Log Out</Link>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                 </DropdownMenu>
                ) 
            }
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <a href="#" className="inline-flex items-center text-sm px-4 py-2 hover:bg-gray-300 rounded-full text-gray-600 hover:text-black">
            Explore our Fund ERP software <ChevronRight className="ml-2 h-4 w-4" />
          </a>
          <h2 className="text-5xl md:text-7xl font-bold text-black leading-tight">
            Built to scale all private funds
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
            VentureLink provides investors and innovators with the tools to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/auth`}>
                <Button className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 h-auto">
                    Get Started
                </Button>
            </Link>
            <Button variant="outline" className="text-black border-black hover:bg-gray-100 text-lg px-8 py-6 h-auto">
              Watch demo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {[
              { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
              { id: 2, name: 'Assets under management', value: '$119 trillion' },
              { id: 3, name: 'New users annually', value: '46,000' },
            ].map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Comprehensive Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Investor Management",
              description: "Leverage software to drive meaningful, actionable engagement",
              image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            },
            {
              title: "Financial Services",
              description: "Consolidate your capital management with seamless, flexible solutions",
              image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            },
            {
              title: "Full Service Funds",
              description: "Access 50+ services that remove friction from fund management",
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1415&q=80"
            },
            {
              title: "Equity Management",
              description: "Modern cap tables for high-growth companies",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-50 border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-4 right-4 rounded-full bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-black">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              We have worked with thousands of amazing people
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Updated grid layout */}
              {[
                {
                  body: "VentureLink has transformed how we manage our fund. The efficiency gains are remarkable.",
                  author: {
                    name: 'Leslie Alexander',
                    handle: 'lesliealexander',
                    imageUrl:
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  },
                },
                {
                  body: "The investor management tools are top-notch. Our LPs have never been more engaged.",
                  author: {
                    name: 'Michael Foster',
                    handle: 'michaelfoster',
                    imageUrl:
                      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  },
                },
                {
                  body: "VentureLink's financial services have streamlined our operations significantly.",
                  author: {
                    name: 'Dries Vincent',
                    handle: 'driesvincent',
                    imageUrl:
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                  },
                },
              ].map((testimonial, testimonialIdx) => (
                <div key={testimonialIdx} className="pt-8"> {/* Removed flex-row class */}
                  <figure className="rounded-2xl bg-white p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>{`"${testimonial.body}"`}</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                        <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Boost your productivity.
                <br />
                Start using our app today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Join thousands of fund managers who have already transformed their operations with VentureLink.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link href={`/auth`}>
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Get started
                  </Button>
                </Link>
                <Button variant="link" className="text-white">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Image
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src={PlatformImage}
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">
          Better together. VentureLink partners with industry leaders.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
          {[
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png"
          ].map((logo, index) => (
            <div key={index} className="h-12">
              <img src={logo} alt={`Partner ${index + 1}`} className="h-full object-contain" />
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-12 text-black border-black hover:bg-gray-100">
          Our premier partnership program <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-black">About</a>
                <a href="#" className="block text-gray-600 hover:text-black">Careers</a>
                <a href="#" className="block text-gray-600 hover:text-black">Contact</a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-black">Features</a>
                <a href="#" className="block text-gray-600 hover:text-black">Pricing</a>
                <a href="#" className="block text-gray-600 hover:text-black">Security</a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-black">Blog</a>
                <a href="#" className="block text-gray-600 hover:text-black">Documentation</a>
                <a href="#" className="block text-gray-600 hover:text-black">Support</a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-black">Privacy</a>
                <a href="#" className="block text-gray-600 hover:text-black">Terms</a>
                <a href="#" className="block text-gray-600 hover:text-black">Cookie Settings</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              © 2024 VentureLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}