/*
  Warnings:

  - You are about to drop the column `founderId` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyId,investorId,pitchId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_founderId_fkey";

-- DropIndex
DROP INDEX "Chat_founderId_investorId_pitchId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "founderId",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_companyId_investorId_pitchId_key" ON "Chat"("companyId", "investorId", "pitchId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
