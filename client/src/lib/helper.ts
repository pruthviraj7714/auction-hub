"use server";

import prisma from "./db";
import redisClient from "./redisClient";

export async function checkUserBalance(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        bidCoins: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.bidCoins;
  } catch (error) {
    console.error("Error checking user balance:", error);
    throw new Error("Internal Server Error");
  }
}
const listenForBids = async () => {
  try {
    while (true) {
      const result = await redisClient.brpop("bids", 0);
      if (result) {
        const [, message] = result;
        const bid = JSON.parse(message);
        console.log(`New bid from ${bid?.bidder}: $${bid.bidAmount}`);
        await saveBidToDatabase({bid});
      }
    }
  } catch (error) {
    console.error("Error processing new bid message:", error);
  }
};

listenForBids();
export async function saveBidToDatabase({bid} : {bid : any}) {
  try {
    const userBid = await prisma.bid.create({
      data: {
        userId: bid.bidderId,
        timeStamp: bid.timestamp,
        auctionId: bid.auctionId,
        amount: bid.bidAmount,
      },
    });
    console.log("Bid Successfully added to database");
  } catch (error: any) {
    console.error(error.message);
    throw Error(error.message);
  }
}
