-- AlterTable
ALTER TABLE "Investor" ADD COLUMN     "filterId" INTEGER;

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
