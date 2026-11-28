/*
  Warnings:

  - A unique constraint covering the columns `[organizationGroupId,level,code]` on the table `ProductHierarchy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationGroupId` to the `ProductHierarchy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "inventory"."ProductHierarchy_level_code_key";

-- AlterTable
ALTER TABLE "inventory"."ProductHierarchy" ADD COLUMN     "organizationGroupId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ProductHierarchy_organizationGroupId_idx" ON "inventory"."ProductHierarchy"("organizationGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHierarchy_organizationGroupId_level_code_key" ON "inventory"."ProductHierarchy"("organizationGroupId", "level", "code");

-- AddForeignKey
ALTER TABLE "inventory"."ProductHierarchy" ADD CONSTRAINT "ProductHierarchy_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
