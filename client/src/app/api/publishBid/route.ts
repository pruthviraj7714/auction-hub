import redisClient from "@/lib/redisClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { newBid ,bidderId } = await req.json();
    redisClient.lpush("bids", JSON.stringify({...newBid, bidderId}));
    return NextResponse.json({
      message: "Bid Successfully Published",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
    });
  }
}
