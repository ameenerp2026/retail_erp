/*
  Warnings:

  - The `financeStatus` column on the `FinanceMonth` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "organization"."FinanceStatus" AS ENUM ('Open', 'Closed', 'Provisional');

-- AlterTable
ALTER TABLE "organization"."FinanceMonth" DROP COLUMN "financeStatus",
ADD COLUMN     "financeStatus" "organization"."FinanceStatus" NOT NULL DEFAULT 'Open';
