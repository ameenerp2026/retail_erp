/*
  Warnings:

  - Made the column `organizationGroupId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user"."User" DROP CONSTRAINT "User_organizationGroupId_fkey";

-- AlterTable
ALTER TABLE "user"."User" ALTER COLUMN "organizationGroupId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
