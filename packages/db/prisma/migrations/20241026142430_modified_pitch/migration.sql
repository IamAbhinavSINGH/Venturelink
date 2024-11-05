/*
  Warnings:

  - Added the required column `safeType` to the `Pitch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SafeType" AS ENUM ('POST_ROUND', 'PRE_ROUND');

-- DropForeignKey
ALTER TABLE "Pitch" DROP CONSTRAINT "Pitch_filterid_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bankInfo" TEXT;

-- AlterTable
ALTER TABLE "Pitch" ADD COLUMN     "safeType" "SafeType" NOT NULL,
ALTER COLUMN "filterid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_filterid_fkey" FOREIGN KEY ("filterid") REFERENCES "Filter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
