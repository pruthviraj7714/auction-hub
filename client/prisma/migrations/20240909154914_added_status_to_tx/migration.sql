/*
  Warnings:

  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Txstatus" AS ENUM ('inbid', 'outbid');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "Txstatus" NOT NULL;
