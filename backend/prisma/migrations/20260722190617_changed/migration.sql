/*
  Warnings:

  - You are about to drop the column `OrganizationGroup` on the `OrganizationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `branchName` on the `OrganizationUnit` table. All the data in the column will be lost.
  - Added the required column `organizationGroupId` to the `OrganizationUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization"."OrganizationUnit" DROP COLUMN "OrganizationGroup",
DROP COLUMN "branchName",
ADD COLUMN     "organizationGroupId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "organization"."OrganizationUnit" ADD CONSTRAINT "OrganizationUnit_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
