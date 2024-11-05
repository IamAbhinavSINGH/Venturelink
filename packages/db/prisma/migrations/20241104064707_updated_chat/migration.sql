/*
  Warnings:

  - A unique constraint covering the columns `[founderId,investorId,pitchId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Chat_founderId_investorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_founderId_investorId_pitchId_key" ON "Chat"("founderId", "investorId", "pitchId");
