import { userHandler } from "../../lib/userHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";



export async function GET(){

    const session = await getServerSession(userHandler);

    return NextResponse.json({
        user : session?.user,
        message : "Healthy Server"
    });
}