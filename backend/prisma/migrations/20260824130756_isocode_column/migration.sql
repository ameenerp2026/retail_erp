/*
  Warnings:

  - A unique constraint covering the columns `[iso_code]` on the table `gst_states` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iso_code` to the `gst_states` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization"."gst_states" ADD COLUMN     "cgst_sgst_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "igst_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "iso_code" VARCHAR(5) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "gst_states_iso_code_key" ON "organization"."gst_states"("iso_code");
