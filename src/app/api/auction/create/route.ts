import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { auctionSchema } from "@/schemas/schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const parsedBody = auctionSchema.safeParse(await req.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Invalid Inputs",
      },
      { status: 411 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "User not found!",
      },
      { status: 404 }
    );
  }

  const {
    title,
    description,
    startingPrice,
    category,
    startingTime,
    endingTime,
    productTitle,
    productDescription,
    imageUrl,
  } = parsedBody.data;

  const product = await prisma.product.create({
    data: {
      title: productTitle,
      description: productDescription,
      imageUrl,
    },
  });

  const auction = await prisma.auction.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      title,
      description,
      startingPrice,
      startingTime,
      endingTime,
      currentHighestBid: 0,
      category,
    },
  });

  return NextResponse.json(
    {
      message: "Auction Successfully created",
      auction,
    },
    { status: 201 }
  );
}
