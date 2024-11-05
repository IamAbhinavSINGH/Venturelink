import { userHandler } from "@/lib/userHandler";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardHome from "@/components/founder/DashboardHome";

export default async function({ searchParams }: { searchParams: { company: string } }){
    const session = await getServerSession(userHandler);
    const companyId = Number(searchParams.company);

    if(!session || !session.user){
        redirect('/');
    }

  return (
    <div className="transition-all duration-200 ease-in-out">
      <DashboardHome />
    </div>
  );
}