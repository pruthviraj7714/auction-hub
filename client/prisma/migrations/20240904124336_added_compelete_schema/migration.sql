/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endingTime` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingPrice` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingTime` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "currentHighestBid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endingTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "startingPrice" INTEGER NOT NULL,
ADD COLUMN     "startingTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bidCoins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcation" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "auctionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Transcation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transcation_auctionId_key" ON "Transcation"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "Auction_productId_key" ON "Auction"("productId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcation" ADD CONSTRAINT "Transcation_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcation" ADD CONSTRAINT "Transcation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
