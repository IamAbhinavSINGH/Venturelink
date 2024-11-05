"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Globe, FileText, MessageSquare, Settings, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSession } from 'next-auth/react';

const navItems = [
  { name: 'Portfolio', href: '/investor/dashboard', icon: LayoutDashboard },
  { name: 'Invest', href: '/investor/dashboard/invest', icon: Globe },
  { name: 'Messages', href: '/investor/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/investor/dashboard/settings', icon: Settings },
];

interface InvestorSidebarProps {
  currentSelectedItem: string;
  setCurrentSelectedItem: (item: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function InvestorSidebar({ 
  currentSelectedItem, 
  setCurrentSelectedItem,
  isOpen,
  setIsOpen
}: InvestorSidebarProps) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const { data : session } = useSession();
  let initials = "";

  if(session != null){
    const nameArr = session?.user.name.split(' ');
    initials = nameArr[0].charAt(0);
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-stone-900 text-gray-100 transition-all duration-200 ease-in-out",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex h-16 items-center px-4 border-b border-gray-800">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className='bg-transparent border-transparent'
        >
          <Menu className="h-12 w-12" />
        </Button>
        {isOpen && <span className="text-xl font-semibold ml-4">Venturelink</span>}
      </div>

      <ScrollArea className="flex-grow">
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className={cn(
                "flex items-center w-full rounded-lg px-3 py-2 transition-colors",
                currentSelectedItem === item.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
              onClick={() => setCurrentSelectedItem(item.href)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-4">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="flex justify-center p-4 border-t border-gray-800">
        <div className="flex items-center rounded-lg px-2 w-fit py-2 text-white hover:bg-gray-800 hover:text-white transition-colors">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="flex items-center justify-center bg-gray-100 text-black">{ initials }</AvatarFallback>
          </Avatar>
          {isOpen && <span className="ml-4 text-lg text-gray-300">{ session?.user.name }</span>}
        </div>
      </div>
    </div>
  );
}