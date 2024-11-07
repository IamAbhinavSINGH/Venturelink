import { NextRequest , NextResponse } from "next/server";
import db from "@repo/db/client";
import zod from 'zod';

const updatePitchSchema = zod.object({
    status : zod.enum(['Pending' , 'Accepted' , 'Rejected'])
})

export async function GET(req : NextRequest){
    const username = req.headers.get('x-username');
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'Pending';

    if(!username){
        return NextResponse.json(
            { message : "You are not logged in" },
            { status : 401 }
        );
    }

    try{
        const investor = await db.investor.findFirst( { where : { username : username } } );
        if(!investor) return NextResponse.json({ message : "Could not find any investor with the given username" } , { status : 404 });

        const allPitches = await db.pitch.findMany({ 
            where : { investorid : investor.id , status : status as 'Pending' | 'Accepted' | 'Rejected'},
            include : { company : true }
        });

        return NextResponse.json(
            { pitches : allPitches },
        );

    }catch(err){
        console.error('error while fetching pitches in investor : ' , err);
        return NextResponse.json(
            { message : "Something went wrong" },
            { status : 400 }
        );
    }
}

export async function PUT(req : NextRequest){
    const username = req.headers.get('x-username');
    const url = new URL(req.url);
    const pitchId = url.searchParams.get('pitch');
    const body = await req.json();

    if(!username) return NextResponse.json({ message : "You are not logged in" } , { status : 401 });

    try{
        const investor = await db.investor.findFirst({ where : { username : username } });
        if(!investor) return NextResponse.json({ message : "Could not find any investor with given username" } , { status : 404 });

        if(!pitchId){
            return NextResponse.json({ message : "No pitch id found" } , { status : 400 });
        }
        
        const pitch = await db.pitch.findFirst({ where : { id : Number(pitchId) } });
        if(!pitch){
            return NextResponse.json({ message : "Could not found any matching pitch" } , { status : 400 });
        }

        const newStatus = { status : body.status };
        const schemaParse = updatePitchSchema.safeParse(newStatus);
        
        if(!schemaParse.success){
            return NextResponse.json({ message : "Invalid inputs" } , { status : 440 });
        }

        if(newStatus.status === 'Accepted'){
            await db.investor.update({
                where : { id : investor.id },
                data : {
                    activeDeals : (investor.activeDeals + 1)
                }
            });
        }

        await db.pitch.update({
            where : { id : pitch.id },
            data : { 
                status : newStatus.status
            }
        });

        return NextResponse.json(
            { message : "Pitch updated successfully" },
            { status : 200 }
        );
    }catch(err){
        console.error(`error while updating the pitch in investor : ` , err);
        return NextResponse.json(
            { message : "Something went wrong" },
            { status : 400 }
        );
    }
}
