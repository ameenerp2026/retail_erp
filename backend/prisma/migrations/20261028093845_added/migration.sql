/*
  Warnings:

  - A unique constraint covering the columns `[organizationGroupId,organizationUnitId,code]` on the table `Uom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationGroupId,organizationUnitId,name]` on the table `Uom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "inventory"."Uom_organizationGroupId_code_key";

-- DropIndex
DROP INDEX "inventory"."Uom_organizationGroupId_name_key";

-- AlterTable
ALTER TABLE "inventory"."Uom" ADD COLUMN     "organizationUnitId" INTEGER;

-- CreateIndex
CREATE INDEX "Uom_organizationUnitId_idx" ON "inventory"."Uom"("organizationUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "Uom_organizationGroupId_organizationUnitId_code_key" ON "inventory"."Uom"("organizationGroupId", "organizationUnitId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Uom_organizationGroupId_organizationUnitId_name_key" ON "inventory"."Uom"("organizationGroupId", "organizationUnitId", "name");

-- AddForeignKey
ALTER TABLE "inventory"."Uom" ADD CONSTRAINT "Uom_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "organization"."OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
