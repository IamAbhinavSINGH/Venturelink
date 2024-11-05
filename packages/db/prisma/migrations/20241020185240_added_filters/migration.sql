/*
  Warnings:

  - You are about to drop the column `pitchId` on the `Investor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filterid]` on the table `Pitch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filterid` to the `Pitch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('AI_or_Ml', 'Other', 'Developers_Tools', 'Finance', 'HealthCare', 'Blockchain_or_Cryptocurrency', 'BioTech', 'Robotics', 'Health', 'E_Commerce', 'Security');

-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_pitchId_fkey";

-- DropIndex
DROP INDEX "Investor_pitchId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "filterid" INTEGER;

-- AlterTable
ALTER TABLE "Investor" DROP COLUMN "pitchId";

-- AlterTable
ALTER TABLE "Pitch" ADD COLUMN     "filterid" INTEGER NOT NULL,
ADD COLUMN     "investorid" INTEGER;

-- CreateTable
CREATE TABLE "Filter" (
    "id" SERIAL NOT NULL,
    "industry" "Industry" NOT NULL,
    "stage" "RaiseStage" NOT NULL,
    "minOffer" INTEGER NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pitch_filterid_key" ON "Pitch"("filterid");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_filterid_fkey" FOREIGN KEY ("filterid") REFERENCES "Filter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_investorid_fkey" FOREIGN KEY ("investorid") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pitch" ADD CONSTRAINT "Pitch_filterid_fkey" FOREIGN KEY ("filterid") REFERENCES "Filter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
