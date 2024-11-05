import db from "@repo/db/client";
import { NextRequest , NextResponse } from "next/server";
import { z } from "zod"
import { Industry, EntityType , RaiseStage } from "@prisma/client"


const companyUpdateSchema = z.object({
    name: z.string().min(2),
    website: z.string().url().optional().or(z.literal("")),
    totalCapitalRaised: z.number().int().nonnegative(),
    country: z.string().min(2),
    address: z.string().min(5),
    entityType: z.nativeEnum(EntityType),
    description: z.string().optional(),
    industry: z.nativeEnum(Industry).optional(),
    teamMembers: z.string().optional(),
    bankInfo: z.string().optional(),
})

  

export async function GET(req : NextRequest){
    const userId = req.headers.get('x-username');
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('company');

    if(!userId){
        return NextResponse.json(
            { message : "You are not authenticated" },
            { status : 401 }
        );
    }

    try{
        const user = await db.user.findFirst({ where : { username : userId } });
        if(!user){
            return NextResponse.json({ message : "Could not find any user" },{ status : 404 });
        }
        
        let company = null;

        if(!companyId){  
            company = await db.company.findMany({ where : { user : user } });
        }else{
            company = await db.company.findFirst( { where : { user : user , id : Number(companyId) } });
        }
        
        if(company != null){
            return NextResponse.json({
                company : company
            });
        }
        else{
            return NextResponse.json( 
                { message : "No companies exist" },
                { status : 400 }
            );
        }

    }catch(err){
        console.log(`error while fetching companies : `, err);
        return NextResponse.json(
            { message : "Something went wrong" },
            { status : 400 }
        );
    }
}

export async function POST(req : NextRequest){
    const body = await req.json();
    const username = req.headers.get('x-username');
    console.log('username : ' , username);

    if(!username){
        return NextResponse.json(
            { message : "You are not logged in" },
            { status : 400 }
        );
    }

    try{
        const user = await db.user.findFirst({ where : { username : username } });
        if(!user){
            return NextResponse.json(
                { message : "Couldn't found any user with this username" },
                { status : 400 }
            );
        }
        
        const name = body.name;
        const website = body.website;
        const capitalRaised = body.capitalRaised;
        const teamMembers = body.teamMembers;
        const country = body.country;
        const address = body.address;
        const entityType = body.entityType;
        const description = body.description;
        const bankInfo = body.bankInfo;
        const id = user.id
        
        const res = await registerCompany({
            name ,
            userId : id ,
            website ,
            capitalRaised , 
            teamMembers , 
            country , 
            address , 
            entityType,
            description,
            bankInfo
        });

        if(!res.status || !res.companyId){
            return NextResponse.json(
                { message : res.message },
                { status : 422 }
            );
        }
        else{
            return NextResponse.json(
                { 
                    message : res.message ,
                    companyId : res.companyId
                },
                { status : 200 }
            );
        }
    }catch(err){
        return NextResponse.json(
            { message : "Something went wrong"},
            { status : 400 }
        );
    }
}

interface RegisterCompanyProps{
    name : string,
    userId : number
    website : string,
    capitalRaised : string,
    teamMembers : string,
    country : string,
    address : string,
    entityType : string,
    description : string,
    bankInfo : string
}

interface ReturnStatus{
    status : boolean,
    message : string,
    companyId : string | null
}

async function registerCompany({
    name,
    userId,
    website,
    capitalRaised, 
    teamMembers, 
    country,
    address, 
    entityType,
    bankInfo,
    description
} : RegisterCompanyProps) : Promise<ReturnStatus>{
    if(!name || !website || !capitalRaised || !teamMembers || !country || !address || !entityType 
         || !description || !bankInfo
    ){
        return {
            status : false,
            message : "Missing fields!",
            companyId : null
        };
    }

    const existingCompany = await db.company.findFirst({ where : { name } });
    if(existingCompany){
        return {
            status : false,
            message : "A company already exits with the same name",
            companyId : null
        };
    }

    const company = await db.company.create({
        data : {
            name,
            website,
            totalCapitalRaised : Number(capitalRaised),
            country,
            address,
            bankInfo,
            teamMembers,
            description,
            entityType : (entityType === 'C corp') ? 'Ccorp' : (entityType === 'LLC') ? 'LLC' : 'PBC',
            userid : userId
        }
    });

    return {
        status : true,
        message : "Company registered!",
        companyId : company.id.toString()
    }
}

export async function PUT(req: NextRequest) {
  try {

    const username = req.headers.get('x-username');
    if(!username){
        return NextResponse.json(
            { message : "You are not logged in!" },
            { status : 400 }
        );
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get('company');

    if(!companyId){
        return NextResponse.json(
            { message : "No company id present" },
            { status : 400 }
        );
    }

    const company = await db.company.findFirst({ where : { id : Number(companyId) } });

    if(!company){
        return NextResponse.json(
            { message : "No company present with this id" },
            { status : 400 }
        );
    }

    const body = await req.json();
    const partialCompnanyUpdateSchema = companyUpdateSchema.partial();
    const validatedData = partialCompnanyUpdateSchema.parse(body)

    const updatedCompany = await db.company.update({
      where: { id: Number(companyId) },
      data: validatedData,
    });

    return NextResponse.json({ message: "Company updated successfully", company: updatedCompany })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    console.error("Error updating company:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}