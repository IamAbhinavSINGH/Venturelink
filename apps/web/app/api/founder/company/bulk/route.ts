import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { Industry, EntityType, RaiseStage, Prisma } from "@prisma/client";
import db from "@repo/db/client";

const filterSchema = z.object({
    name: z.string().optional(),
    fundingStage: z.array(z.nativeEnum(RaiseStage)).optional(),
    location: z.string().optional(),
    minValuationRange: z.string().optional(),
    maxValuationRange: z.string().optional(),
    entityType: z.array(z.nativeEnum(EntityType)).optional(),
    industry: z.array(z.nativeEnum(Industry)).optional(),
});

export async function GET(req: NextRequest) {
    const username = req.headers.get('x-username');
    const { searchParams } = new URL(req.url);

    try {
        if (!username) {
            return NextResponse.json({ message: "You are not authenticated" }, { status: 401 });
        }

        console.log('username in bulk request : ', username);

        const user = await db.investor.findFirst({ where: { username: username } });
        if (!user) {
            return NextResponse.json({ message: "Could not find any user" }, { status: 404 });
        }

        const filterData = Object.fromEntries(
            Array.from(searchParams.entries()).map(([key, value]) => {
                if (key === 'fundingStage' || key === 'entityType' || key === 'industry') {
                    return [key, value.split(',')];
                }
                return [key, value];
            })
        );

        const validateFilters = filterSchema.parse(filterData);
        
        const filters: Prisma.CompanyWhereInput = {
            ...(validateFilters.name && { 
                name: { contains: validateFilters.name, mode: 'insensitive' } 
            }),
            ...(validateFilters.fundingStage && validateFilters.fundingStage.length > 0 && {
                fundingStage: { in: validateFilters.fundingStage }
            }),
            ...(validateFilters.entityType && validateFilters.entityType.length > 0 && {
                entityType: { in: validateFilters.entityType }
            }),
            ...(validateFilters.industry && validateFilters.industry.length > 0 && {
                industry: { in: validateFilters.industry }
            }),
            ...(validateFilters.location && {
                OR: [
                    { country: { contains: validateFilters.location, mode: 'insensitive' } },
                    { address: { contains: validateFilters.location, mode: 'insensitive' } },
                ],
            }),
            ...(validateFilters.minValuationRange && {
                totalCapitalRaised: { 
                    ...((validateFilters.minValuationRange || validateFilters.maxValuationRange) && {
                        gte: validateFilters.minValuationRange ? parseInt(validateFilters.minValuationRange) : undefined,
                        lte: validateFilters.maxValuationRange ? parseInt(validateFilters.maxValuationRange) : undefined,
                    })
                },
            }),
        };

        const companies = await db.company.findMany({ where: filters });

        return NextResponse.json({
            companies: companies
        });

    } catch (err) {
        console.log(`error while fetching bulk request of companies : `, err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 400 }
        );
    }
}