"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SelectionAppBar() {
  const { data: session } = useSession();
  const [navbarBg, setNavbarBg] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setNavbarBg(true)
    } else {
      setNavbarBg(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const userInitial = session?.user?.name ? session.user.name[0].toUpperCase() : ''

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navbarBg ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-semibold text-gray-950">Venturelink</span>
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <button>
                      <Avatar className="w-12 h-12 hover:ring-1 hover:ring-gray-700">
                        <AvatarFallback className="text-lg">{userInitial}</AvatarFallback>
                      </Avatar>
                   </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link href="/api/auth/signout" className="w-full">Log Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/api/auth/signin">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}