-- CreateEnum
CREATE TYPE "finance"."TransactionType" AS ENUM ('outward', 'inward');

-- CreateEnum
CREATE TYPE "finance"."SupplyType" AS ENUM ('b2b', 'b2c', 'd2c');

-- CreateEnum
CREATE TYPE "finance"."EInvoiceStatus" AS ENUM ('draft', 'submitted', 'irn_generated', 'cancelled', 'failed');

-- CreateTable
CREATE TABLE "finance"."hsn_codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "description" VARCHAR(300),
    "gstRate" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hsn_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."e_invoices" (
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
    "irn" VARCHAR(64),
    "ack_number" VARCHAR(30),
    "ack_date" TIMESTAMP(3),
    "qrCode" TEXT,
    "signed_invoice_json" JSONB,
    "status" "finance"."EInvoiceStatus" NOT NULL DEFAULT 'draft',
    "cancelled_at" TIMESTAMP(3),
    "cancel_reason" VARCHAR(200),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "e_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."e_invoice_items" (
    "id" SERIAL NOT NULL,
    "e_invoice_id" INTEGER NOT NULL,
    "hsn_code" VARCHAR(8) NOT NULL,
    "description" VARCHAR(300),
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
    "unit" VARCHAR(10),
    "rate" DECIMAL(18,2) NOT NULL,
    "taxable_value" DECIMAL(18,2) NOT NULL,
    "cgst_rate" DECIMAL(5,2),
    "sgst_rate" DECIMAL(5,2),
    "igst_rate" DECIMAL(5,2),

    CONSTRAINT "e_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."document_sequences" (
    "id" SERIAL NOT NULL,
    "seller_gst_profile_id" INTEGER NOT NULL,
    "financial_year" VARCHAR(7) NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hsn_codes_code_key" ON "finance"."hsn_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "e_invoices_irn_key" ON "finance"."e_invoices"("irn");

-- CreateIndex
CREATE UNIQUE INDEX "e_invoices_document_number_seller_gst_profile_id_key" ON "finance"."e_invoices"("document_number", "seller_gst_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_seller_gst_profile_id_financial_year_key" ON "finance"."document_sequences"("seller_gst_profile_id", "financial_year");

-- AddForeignKey
ALTER TABLE "finance"."e_invoices" ADD CONSTRAINT "e_invoices_seller_gst_profile_id_fkey" FOREIGN KEY ("seller_gst_profile_id") REFERENCES "organization"."GSTIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."e_invoice_items" ADD CONSTRAINT "e_invoice_items_e_invoice_id_fkey" FOREIGN KEY ("e_invoice_id") REFERENCES "finance"."e_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
