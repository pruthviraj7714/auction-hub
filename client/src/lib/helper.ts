"use server"

import prisma from "./db";

export async function checkUserBalance(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                bidCoins: true
            }
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
