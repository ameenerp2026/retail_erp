/*
  Warnings:

  - You are about to drop the column `cgst_sgst_applicable` on the `gst_states` table. All the data in the column will be lost.
  - You are about to drop the column `igst_applicable` on the `gst_states` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organization"."gst_states" DROP COLUMN "cgst_sgst_applicable",
DROP COLUMN "igst_applicable";
