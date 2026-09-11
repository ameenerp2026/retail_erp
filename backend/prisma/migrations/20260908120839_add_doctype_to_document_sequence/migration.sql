/*
  Warnings:

  - Added the required column `doc_type` to the `document_sequences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "finance"."TransportMode" AS ENUM ('road', 'rail', 'air', 'ship');

-- CreateEnum
CREATE TYPE "finance"."EWayBillStatus" AS ENUM ('draft', 'generated', 'cancelled', 'expired');

-- AlterTable: add doc_type as nullable first
ALTER TABLE "finance"."document_sequences" ADD COLUMN "doc_type" VARCHAR(20);

-- Backfill existing rows — both current rows came from e-invoice creation
UPDATE "finance"."document_sequences" SET "doc_type" = 'einvoice' WHERE "doc_type" IS NULL;

-- Now enforce NOT NULL going forward
ALTER TABLE "finance"."document_sequences" ALTER COLUMN "doc_type" SET NOT NULL;

-- Replace the old two-column unique constraint with the new three-column one
-- NOTE: verify this constraint name matches your actual database before running —
-- see "how to check" below if it errors.
-- Replace the old two-column unique constraint with the new three-column one
ALTER TABLE "finance"."document_sequences" DROP CONSTRAINT IF EXISTS "document_sequences_seller_gst_profile_id_financial_year_key";
ALTER TABLE "finance"."document_sequences" ADD CONSTRAINT "document_sequences_seller_gst_profile_id_doc_type_financial_year_key" UNIQUE ("seller_gst_profile_id", "doc_type", "financial_year");
-- CreateTable
CREATE TABLE "finance"."e_way_bills" (
    "id" SERIAL NOT NULL,
    "document_number" VARCHAR(30) NOT NULL,
    "document_date" TIMESTAMP(3) NOT NULL,
    "transaction_type" "finance"."TransactionType" NOT NULL,
    "supply_type" "finance"."SupplyType" NOT NULL,
    "seller_gst_profile_id" INTEGER NOT NULL,
    "from_pin" VARCHAR(10),
    "from_city" VARCHAR(100),
    "to_gstin" VARCHAR(15) NOT NULL,
    "to_legal_name" VARCHAR(200),
    "to_pin" VARCHAR(10),
    "to_city" VARCHAR(100),
    "hsn_code" VARCHAR(8) NOT NULL,
    "taxable_value" DECIMAL(18,2) NOT NULL,
    "vehicle_number" VARCHAR(15) NOT NULL,
    "transport_mode" "finance"."TransportMode" NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "ewb_number" VARCHAR(12),
    "status" "finance"."EWayBillStatus" NOT NULL DEFAULT 'draft',
    "cancelled_at" TIMESTAMP(3),
    "cancel_reason" VARCHAR(200),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_way_bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "e_way_bills_ewb_number_key" ON "finance"."e_way_bills"("ewb_number");

-- CreateIndex
CREATE UNIQUE INDEX "e_way_bills_document_number_seller_gst_profile_id_key" ON "finance"."e_way_bills"("document_number", "seller_gst_profile_id");

-- AddForeignKey
ALTER TABLE "finance"."e_way_bills" ADD CONSTRAINT "e_way_bills_seller_gst_profile_id_fkey" FOREIGN KEY ("seller_gst_profile_id") REFERENCES "organization"."GSTIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;