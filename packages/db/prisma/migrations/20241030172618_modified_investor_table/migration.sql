-- AlterTable
ALTER TABLE "Investor" ADD COLUMN     "activeDeals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dealflow" TEXT,
ADD COLUMN     "investmentStage" "RaiseStage",
ADD COLUMN     "totalInvestments" INTEGER NOT NULL DEFAULT 0;
