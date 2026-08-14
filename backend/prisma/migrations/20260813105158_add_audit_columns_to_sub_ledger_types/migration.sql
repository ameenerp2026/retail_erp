/*
  Warnings:

  - You are about to drop the column `status` on the `AccountingYear` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "organization"."AccountingYear" DROP CONSTRAINT "AccountingYear_createdById_fkey";

-- AlterTable
ALTER TABLE "finance"."sub_ledger_types" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "organization"."AccountingYear" DROP COLUMN "status",
ALTER COLUMN "createdById" DROP NOT NULL;

-- DropEnum
DROP TYPE "organization"."YearStatus";

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
