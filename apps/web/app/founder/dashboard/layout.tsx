"use client";

import React, { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/founder/DashbaordSidebar';
import { useSearchParams , usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathName = usePathname();
  const [currentSelectedItem, setCurrentSelectedItem] = useState('/founder/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company') as string;

  useEffect(() => {
    if(pathName){
      console.log( "pathname : " , pathName);
      setCurrentSelectedItem(pathName);
    }
  }, [ pathName ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        companyId={Number(companyId)}
        currentSelectedItem={currentSelectedItem}
        setCurrentSelectedItem={setCurrentSelectedItem}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className={`flex-1 overflow-y-auto p-20 transition-all duration-200 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {children}
      </main>
    </div>
  );
}