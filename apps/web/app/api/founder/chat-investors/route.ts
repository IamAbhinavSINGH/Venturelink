// apps/web/app/api/founder/chat-investors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import db from '@repo/db/client'

export async function GET(req : NextRequest) {
    const username = req.headers.get('x-username');
    const url = new URL(req.url);
    const companyId = url.searchParams.get('company');

    if(!username){
        return NextResponse.json({ message : "You are not logged in" } , { status : 401 });
    }

  try {

    const user = await db.user.findFirst({ where : { username : username } });
    if(!user){
        return NextResponse.json({ message : "Could not find any user with this id" } , { status : 401 });
    }

    if(!companyId){
        return NextResponse.json({ message : "No companyId found" } , { status : 404});
    }

    const company = await db.company.findFirst({ where : { id : parseInt(companyId) } });
    if(!company){
        return NextResponse.json({ message : "No company found" } , { status : 404});
    }

    const acceptedPitches = await db.pitch.findMany({
      where: {
        companyId : company.id,
        status: 'Accepted',
      },
      include: {
        investor: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    const investors = acceptedPitches.map(pitch => pitch.investor)

    return NextResponse.json({ investors })
  } catch (error) {
    console.error('Error fetching chat-eligible investors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}