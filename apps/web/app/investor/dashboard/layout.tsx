"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import InvestorSidebar from '@/components/investor/InvestorSidebar';

export default function InvestorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [currentSelectedItem, setCurrentSelectedItem] = useState('/investor/dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Update the currentSelectedItem based on the pathname
    if (pathname) {
      setCurrentSelectedItem(pathname);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      <InvestorSidebar
        currentSelectedItem={currentSelectedItem}
        setCurrentSelectedItem={setCurrentSelectedItem}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className={`flex-1 overflow-y-auto px-16 py-16 transition-all duration-200 ease-in-out ${
        isSidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {children}
      </main>
    </div>
  );
}