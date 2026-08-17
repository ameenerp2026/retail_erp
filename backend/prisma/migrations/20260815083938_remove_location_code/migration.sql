/*
  Warnings:

  - You are about to drop the column `locationCode` on the `BusinessLocation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "organization"."BusinessLocation_locationCode_key";

-- AlterTable
ALTER TABLE "organization"."BusinessLocation" DROP COLUMN "locationCode";
