import AuthDashboard  from "../../components/landing/AuthDashboard"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { userHandler } from "@/lib/userHandler";

export default async function auth(){
    const session = await getServerSession(userHandler);

    if(session && session.user){
        if(session?.user.type === 'investor'){
            redirect(`/investor/dashboard`);
        }
        else{
            redirect(`/founder/get-started`);
        }
    }

    return (
        <div>
            <AuthDashboard />
        </div>
    );
}