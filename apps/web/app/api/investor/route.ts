import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"
import { z } from 'zod';

const updateInvestorSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  age: z.string().optional(),
  address: z.string().optional(),
  investmentStage: z.enum(["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"]).optional(),
});

const filterSchema = z.object({
  name: z.string().optional(),
  investmentStage: z.array(z.enum(["Pre_Seed", "Seed", "Level_A", "Level_B", "Level_C"])).optional(),
  dealflow: z.array(z.enum(["High", "Medium", "Low"])).optional(),
  activeDeals: z.string().optional(),
  totalInvestments: z.string().optional(),
  location: z.string().optional()
});

export async function GET(req: NextRequest) {
  const username = req.headers.get('x-username');
  const { searchParams } = new URL(req.url);

  if (!username) {
    return NextResponse.json({ error: "Username not provided" }, { status: 401 });
  }

  try {
    const investorId = searchParams.get('id');
    if (investorId) {
      // Fetch single investor
      const investor = await db.investor.findFirst({
        where: { id: parseInt(investorId) },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          address: true,
          username: true,
          age: true,
          investmentStage: true,
          dealflow: true,
          activeDeals: true,
          totalInvestments: true
        }
      });

      if (!investor) {
        return NextResponse.json({ error: "Investor not found" }, { status: 404 });
      }

      return NextResponse.json({ investor: investor });
    }

    const founder = await db.user.findFirst({ where: { username } });
    if (!founder) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const filterData = Object.fromEntries(
      Array.from(searchParams.entries()).map(([key, value]) => {
        if (key === 'investmentStage' || key === 'dealflow') {
          return [key, value.split(',')];
        }
        return [key, value];
      })
    );

    const validatedFilters = filterSchema.parse(filterData);

    const filters: Prisma.InvestorWhereInput = {
      ...(validatedFilters.name && { name: { contains: validatedFilters.name, mode: 'insensitive' } }),
      ...(validatedFilters.investmentStage && validatedFilters.investmentStage.length > 0 && { 
        investmentStage: { in: validatedFilters.investmentStage } 
      }),
      ...(validatedFilters.dealflow && validatedFilters.dealflow.length > 0 && { 
        dealflow: { in: validatedFilters.dealflow } 
      }),
      ...(validatedFilters.activeDeals && { activeDeals: { gte: parseInt(validatedFilters.activeDeals) } }),
      ...(validatedFilters.totalInvestments && { totalInvestments: { gte: parseInt(validatedFilters.totalInvestments) } }),
      ...(validatedFilters.location && { address: { contains: validatedFilters.location, mode: 'insensitive' } }),
    };

    const investors = await db.investor.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        address: true,
        username: true,
        age: true,
        investmentStage: true,
        dealflow: true,
        activeDeals: true,
        totalInvestments: true
      }
    });

    return NextResponse.json({ investors });
  } catch (error) {
    console.error("Error in GET /api/investor:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid filter parameters" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const username = req.headers.get("x-username");
    if (!username) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateInvestorSchema.parse(body);

    const investor = await db.investor.findFirst({
      where: { username: username },
    });

    if (!investor) {
      return NextResponse.json(
        { message: "Investor not found" },
        { status: 404 }
      );
    }

    const updatedInvestor = await db.investor.update({
      where: { id: investor.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      investor: updatedInvestor,
    });
  } catch (err) {
    console.error("Error updating investor settings:", err);
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    );
  }
}