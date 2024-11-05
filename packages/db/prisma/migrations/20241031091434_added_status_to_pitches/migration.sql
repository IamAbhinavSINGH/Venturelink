/*
  Warnings:

  - You are about to drop the column `bankInfo` on the `Pitch` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PitchStatus" AS ENUM ('Pending', 'Rejected', 'Accepted');

-- AlterTable
ALTER TABLE "Pitch" DROP COLUMN "bankInfo",
ADD COLUMN     "status" "PitchStatus" NOT NULL DEFAULT 'Pending';
