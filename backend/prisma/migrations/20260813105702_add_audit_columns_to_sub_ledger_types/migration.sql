/*
  Warnings:

  - Made the column `createdById` on table `AccountingYear` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "organization"."YearStatus" AS ENUM ('OPEN', 'CLOSED');

-- DropForeignKey
ALTER TABLE "organization"."AccountingYear" DROP CONSTRAINT "AccountingYear_createdById_fkey";

-- AlterTable
ALTER TABLE "organization"."AccountingYear" ADD COLUMN     "status" "organization"."YearStatus" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "createdById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
