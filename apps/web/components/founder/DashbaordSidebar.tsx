"use client";

import React, { useEffect, useState } from 'react';
import { Menu, Home, PieChart, Settings, Search, MessageCircleIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const navItems = [
  { name: 'Home', href: '/founder/dashboard', icon: Home },
  { name: 'Explore', href: '/founder/dashboard/explore', icon: Search },
  { name : 'Messages' , href : '/founder/dashboard/messages' , icon : MessageCircleIcon},
  { name: 'Trends', href: '/founder/dashboard/trends', icon: PieChart },
  { name: 'Settings', href: '/founder/dashboard/settings', icon: Settings },
];

type Company = {
  id: number;
  name: string;
  description: string;
  country: string;
  entityType: string;
};

interface DashboardSidebarProps {
  companyId: number;
  currentSelectedItem: string;
  setCurrentSelectedItem: (item: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ 
  companyId,  
  currentSelectedItem, 
  setCurrentSelectedItem,
  isOpen,
  setIsOpen
}: DashboardSidebarProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [showCompanyList, setShowCompanyList] = useState(false);
  const { data : session } = useSession();
  let initials = "";

  if(session != null){
    const nameArr = session?.user.name.split(' ');
    initials = nameArr[0].charAt(0) 
  }

  const router = useRouter();

  const fetchCompanyDetails = async () => {
    try {
      const res = await axios.get(`/api/founder/company`);

      if (res && res.data) {
        setCompanyList(res.data.company);
        const selectedCompany = res.data.company.find((c: Company) => c.id === companyId); 
        setCompany(selectedCompany || null);
      }
    } catch (err) {
      console.log(`Error while fetching company details:`, err);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCompanyChange = (currCompany: Company) => {
    setCompany(currCompany);
    setShowCompanyList(false);
    router.push(`${currentSelectedItem}?company=${currCompany.id}`);
  }

  const handleButtonClick = (item: any) => {
    setCurrentSelectedItem(item.href)
    router.push(`${item.href}?company=${companyId}`)
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

      <Dialog open={showCompanyList} onOpenChange={setShowCompanyList}>
        <DialogTrigger asChild>
          <div onClick={() => setShowCompanyList(true)} className="cursor-pointer">
            {isOpen ? (
              <div className="flex items-center space-x-3 p-4 space-y-3 border-b border-gray-700 ">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-cyan-500 text-gray-100">
                    {company?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-100">{company?.name}</div>
                  <div className="text-sm text-gray-400">{company?.country}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-y-3 p-4 border-b border-gray-800">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-cyan-500 text-gray-100">
                    {company?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogOverlay />

        <DialogContent className="w-fit h-fit p-10 shadow-md z-50">
          <h3 className="text-lg font-semibold text-black">Companies</h3>
          <div className="mt-2">
            {companyList.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center space-x-5 p-2 font-medium rounded-lg py-2 text-gray-600 hover:text-stone-950 hover:bg-gray-400 cursor-pointer"
                onClick={() => { handleCompanyChange(comp) }}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-300 text-black font-semibold">{comp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{comp.name}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ScrollArea className="flex-grow">
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <button
              onClick={() => { handleButtonClick(item) }}
              key={item.name}
              className={cn(
                "flex items-center w-full rounded-lg px-3 py-2 transition-colors",
                currentSelectedItem === item.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-4">{item.name}</span>}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <div className=" flex justify-center p-4 border-t border-gray-800">
        <div className="flex items-center rounded-lg px-2 w-fit py-2 text-white hover:bg-gray-800 hover:text-white transition-colors">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="flex items-center justify-center bg-gray-100 text-black">{initials}</AvatarFallback>
          </Avatar>
          {isOpen && <span className="ml-4 text-lg text-gray-300">{session?.user.name}</span>}
        </div>
      </div>
    </div>
  );
}