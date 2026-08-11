/*
  Warnings:

  - You are about to drop the column `eInvoiceApplicable` on the `GSTIN` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "organization"."GSTINStatus" AS ENUM ('VERIFIED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "organization"."LocationType" AS ENUM ('HEAD_OFFICE', 'BRANCH', 'WAREHOUSE', 'STORE');

-- CreateEnum
CREATE TYPE "organization"."BusinessCategory" AS ENUM ('RETAIL', 'WHOLESALE', 'DISTRIBUTION', 'MANUFACTURING');

-- CreateEnum
CREATE TYPE "organization"."LocationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "organization"."GSTIN" DROP COLUMN "eInvoiceApplicable",
ADD COLUMN     "status" "organization"."GSTINStatus" NOT NULL DEFAULT 'PENDING';

UPDATE "organization"."GSTIN"
SET "status" = 'VERIFIED'
WHERE "id" IN (1, 2, 3, 4, 5, 6, 7);

UPDATE "organization"."GSTIN"
SET "status" = 'FAILED'
WHERE "id" IN (8, 9, 10, 11, 12, 13);

UPDATE "organization"."GSTIN"
SET "status" = 'PENDING'
WHERE "id" IN (14, 15, 16, 17, 18, 19, 20);
-- CreateTable
CREATE TABLE "organization"."BusinessLocation" (
    "id" SERIAL NOT NULL,
    "locationName" TEXT NOT NULL,
    "locationCode" TEXT NOT NULL,
    "parentOrganizationUnitId" INTEGER NOT NULL,
    "locationType" "organization"."LocationType" NOT NULL,
    "businessCategory" "organization"."BusinessCategory" NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "emergencyContact" TEXT,
    "linkedGSTINId" INTEGER NOT NULL,
    "registrationType" "organization"."RegistrationType" NOT NULL,
    "defaultBillingLocation" BOOLEAN NOT NULL DEFAULT false,
    "defaultStockLocation" BOOLEAN NOT NULL DEFAULT false,
    "allowSales" BOOLEAN NOT NULL DEFAULT false,
    "allowPurchase" BOOLEAN NOT NULL DEFAULT false,
    "allowInventory" BOOLEAN NOT NULL DEFAULT false,
    "allowDispatch" BOOLEAN NOT NULL DEFAULT false,
    "allowPOS" BOOLEAN NOT NULL DEFAULT false,
    "status" "organization"."LocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessLocation_locationCode_key" ON "organization"."BusinessLocation"("locationCode");

-- AddForeignKey
ALTER TABLE "organization"."BusinessLocation" ADD CONSTRAINT "BusinessLocation_parentOrganizationUnitId_fkey" FOREIGN KEY ("parentOrganizationUnitId") REFERENCES "organization"."OrganizationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."BusinessLocation" ADD CONSTRAINT "BusinessLocation_linkedGSTINId_fkey" FOREIGN KEY ("linkedGSTINId") REFERENCES "organization"."GSTIN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
