import { getServerSession } from "next-auth";
import { userHandler } from "@/lib/userHandler";

export async function getUser(){
    const session = await getServerSession(userHandler);
    return session;
}