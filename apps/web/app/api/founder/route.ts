import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const headers = req.headers.get('Authorization');
    const token = headers?.split(' ')[1];

    console.log('token inside founder route : ' , token);

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const user = await db.user.findFirst( { where: { token },} );
    
    console.log('user :' , user);

    if(!user){
      return NextResponse.redirect(new URL('/' , req.url));
    }

    const startups = await db.company.findMany( { where : { user : user } } );

    console.log("company : " ,startups);

    return NextResponse.json({
       user : user,
       company : startups
    });
}