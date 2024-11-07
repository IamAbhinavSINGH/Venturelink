import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { userHandler } from "@/lib/userHandler";

export default async function Home(){
    const session = await getServerSession(userHandler);

    if(!session || !session.user){
        redirect('/auth');
    }   
    else{
        redirect('/investor/dashboard');
    }

}