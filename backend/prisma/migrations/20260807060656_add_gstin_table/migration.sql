-- CreateEnum
CREATE TYPE "organization"."RegistrationType" AS ENUM ('REGULAR', 'COMPOSITION', 'SEZ');

-- AlterEnum
ALTER TYPE "organization"."GstType" ADD VALUE 'SEZ';

-- CreateTable
CREATE TABLE "organization"."GSTIN" (
    "id" SERIAL NOT NULL,
    "gstin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "organizationUnitId" INTEGER NOT NULL,
    "registrationType" "organization"."RegistrationType" NOT NULL,
    "eInvoiceApplicable" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GSTIN_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GSTIN_gstin_key" ON "organization"."GSTIN"("gstin");

-- AddForeignKey
ALTER TABLE "organization"."GSTIN" ADD CONSTRAINT "GSTIN_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "organization"."OrganizationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."GSTIN" ADD CONSTRAINT "GSTIN_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
