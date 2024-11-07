"use client"

import { redirect } from "next/navigation";
import DashboardHome from "@/components/founder/DashboardHome";
import { useSearchParams } from "next/navigation";

export default async function DashboardPage(){
    const searchParams = useSearchParams();
    const companyId = searchParams.get('company');

    console.log('company in searchParams : ' , companyId);

    if(!companyId){
      console.log('redirected coz no companyId');
      redirect('/auth');
    }

  return (
    <div className="transition-all duration-200 ease-in-out">
      <DashboardHome />
    </div>
  );
}