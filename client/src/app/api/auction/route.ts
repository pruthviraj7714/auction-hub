import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auctionId = req.nextUrl.searchParams.get("auctionId");

    if (!auctionId) {
      return NextResponse.json(
        {
          message: "Auction Id not found!",
        },
        { status: 411 }
      );
    }

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      {
        auction,
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
