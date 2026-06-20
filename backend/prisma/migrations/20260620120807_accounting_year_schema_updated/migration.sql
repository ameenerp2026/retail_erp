/*
  Warnings:

  - You are about to drop the column `from` on the `AccountingYear` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `AccountingYear` table. All the data in the column will be lost.
  - Added the required column `fromDate` to the `AccountingYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `AccountingYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountingYear" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "toDate" TIMESTAMP(3) NOT NULL;
