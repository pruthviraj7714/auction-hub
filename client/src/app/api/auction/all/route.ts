import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || "";

    const auctions = await prisma.auction.findMany({
      where: {
        category: { startsWith: category },
      },
      include : {
        product : true
      },
      orderBy : {
        startingTime : "desc"
      }
    });

    return NextResponse.json(
      {
        auctions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
