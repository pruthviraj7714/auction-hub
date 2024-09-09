import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { message: "Username Not Provided!" },
      { status: 400 }
    );
  }

  try {
    const { amount, auctionId } = await req.json();

    if (!amount || !auctionId) {
      return NextResponse.json(
        { message: "Missing inputs: amount and auctionId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    if (user.bidCoins < amount) {
      return NextResponse.json(
        { message: "Insufficient bidCoins!" },
        { status: 400 }
      );
    }

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      select: { userId: true },
    });

    if (!auction) {
      return NextResponse.json(
        { message: "No Auction found!" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount,
          auctionId,
          status: "inbid",
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { bidCoins: { decrement: amount } },
      });

      await tx.user.update({
        where: { id: auction.userId },
        data: { bidCoins: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          userId: auction.userId,
          amount: amount,
          status: "outbid",
          auctionId,
        },
      });
    });

    return NextResponse.json({
      message: "Transaction completed successfully!",
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
