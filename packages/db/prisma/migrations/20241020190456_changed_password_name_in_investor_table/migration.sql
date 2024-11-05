/*
  Warnings:

  - You are about to drop the column `password` on the `Investor` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `Investor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Investor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Credentials', 'Google');

-- AlterTable
ALTER TABLE "Investor" DROP COLUMN "password",
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "provider" "Provider" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider" NOT NULL;
