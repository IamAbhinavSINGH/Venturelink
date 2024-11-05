/*
  Warnings:

  - The values [AI_or_Ml] on the enum `Industry` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Industry_new" AS ENUM ('AI_or_ML', 'Other', 'Developers_Tools', 'Finance', 'HealthCare', 'Blockchain_or_Cryptocurrency', 'BioTech', 'Robotics', 'Health', 'E_Commerce', 'Security');
ALTER TABLE "Company" ALTER COLUMN "industry" TYPE "Industry_new" USING ("industry"::text::"Industry_new");
ALTER TABLE "Filter" ALTER COLUMN "industry" TYPE "Industry_new" USING ("industry"::text::"Industry_new");
ALTER TYPE "Industry" RENAME TO "Industry_old";
ALTER TYPE "Industry_new" RENAME TO "Industry";
DROP TYPE "Industry_old";
COMMIT;
