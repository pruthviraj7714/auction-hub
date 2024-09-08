import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    const username = req.nextUrl.searchParams.get("username");

    if(!username) {
        return NextResponse.json({
            message : "Username Not Provided!"
        }, { status : 411})
    }
    try {

        const { amount, auctionId} = await req.json();

        if(!amount || !auctionId) {
            return NextResponse.json({
                message : "missing inputs"
            }, { status : 411})
        }

        const user = await prisma.user.findUnique({
            where : {
                username
            }
        })

        if(!user) {
            return NextResponse.json({
                message : "User not found!"
            }, { status : 403})
        }

        await prisma.transcation.create({
            data : {
                userId : user.id,
                amount,
                auctionId
            }
        })
        return NextResponse.json({
            message : "Transaction done successfully!"
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message : "Internal Server Error"
        }, { status : 500})
    }

}