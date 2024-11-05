import { NextRequest, NextResponse } from 'next/server'
import db from '@repo/db/client'

export async function GET(req : NextRequest) {
    const username = req.headers.get('x-username');

    if(!username){
        return NextResponse.json({ message : "You are not logged in" } , { status : 401 });
    }

  try {

    const investor = await db.investor.findFirst({ where : { username : username } });
    if(!investor){
        return NextResponse.json({ message : "Could not find any user with this id" } , { status : 401 });
    }

    const acceptedPitches = await db.pitch.findMany({
      where: {
        investorid : investor.id,
        status: 'Accepted',
      },
      include: {
        company : {
          select : {
            id : true,
            name : true,
            country : true
          }
        }
      }
    })

    const companies = acceptedPitches.map(pitch => pitch.company);

    return NextResponse.json({ companies })
  } catch (error) {
    console.error('Error fetching chat-eligible investors:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}