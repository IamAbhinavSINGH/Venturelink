import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import zod from 'zod';

const pitchSchema = zod.object({
    investorId: zod.number(), 
    companyId: zod.string(),
    stage: zod.enum(["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"]),
    instrumentType: zod.enum(["SAFE", "Equity"]), 
    safeType: zod.enum(["POST_ROUND", "PRE_ROUND"]), 
    target: zod.number(), 
    pitchDescription: zod.string(),
    bankInfo: zod.string().nullable()
});


export async function GET(req: NextRequest) {
    try{
        const username = req.headers.get('x-username');
        const url = new URL(req.url);
        const companyId = url.searchParams.get('company') || "";
        const status = url.searchParams.get('status') || 'Pending';

        if (!username){
            return NextResponse.json(
                { message : "You are not logged in" },
                { status : 400 }
            );
        }

        const founder = await db.user.findFirst({ where: { username: username } });
        if (!founder){
            return NextResponse.json(
                { message : "No user found with the given username" },
                { status : 400 }
            );
        }

        const company = await db.company.findFirst({ where: { id : Number(companyId) } });
        if (!company) {
            return NextResponse.json(
                { message: "No company exists" },
                { status: 401 }
            );
        }

        const allPitches = await db.pitch.findMany({ 
            where: { 
                companyId: company.id,
                status : (status as any) 
            },
            include : {
                company : true,
                investor : true
            }
        });

        return NextResponse.json({
            pitches: allPitches
        });

    }catch(err){
        console.error(`error while getting Pitches : ${err}`)
        return NextResponse.json(
            { message : "Something wrong happened" },
            { status : 400 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const username = req.headers.get('x-username');
        const body = await req.json();

        if (!username) {
            return NextResponse.json(
                { message: "You are not authenticated" },
                { status: 400 }
            );
        }

        const founder = await db.user.findFirst({ where: { username: username } });
        if (!founder) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }

        // Extract pitch data and validate using Zod
        const pitchData = {
            investorId: body.investorId, // No type casting needed
            companyId : body.companyId,
            stage: body.stage,
            instrumentType: body.instrumentType,
            safeType: body.safeType,
            target: Number(body.target), // Ensure target is a number
            pitchDescription: body.pitchDescription,
            bankInfo: body.bankInfo,
        };

        const safeParse = pitchSchema.safeParse(pitchData);

        if (!safeParse.success) {
            return NextResponse.json(
                { 
                    message: "Invalid inputs",
                    errors: safeParse.error.errors // Include validation errors in response
                },
                { status: 400 }
            );
        }
        
        const investor = await db.investor.findFirst({ where: { id: pitchData.investorId } });
        if (!investor) {
            return NextResponse.json(
                { message: "No Investor found with the given id" },
                { status: 404 }
            );
        }

        // Check if company exists
        const company = await db.company.findFirst({ where: { id : Number(pitchData.companyId) } });
        if (!company) {
            return NextResponse.json(
                { message: "No company found with the given name" },
                { status: 404 }
            );
        }

        // Create a new pitch
        const pitch = await db.pitch.create({
            data: {
                companyId: company.id,
                raiseStage: pitchData.stage,
                instrumentType: pitchData.instrumentType,
                safeType: pitchData.safeType,
                target: pitchData.target,
                description: pitchData.pitchDescription,
                investorid: investor.id,
                status : 'Pending',
                createdAt : new Date()
            }
        });

        return NextResponse.json({
            message: "Pitch created successfully",
            pitch: pitch
        });

    } catch (err) {
        console.log(`Error while creating a pitch: ${err}`);
        return NextResponse.json(
            { message: "Failed to create pitch" },
            { status: 500 }
        );
    }
}
