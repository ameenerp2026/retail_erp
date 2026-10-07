-- DropForeignKey
ALTER TABLE "organization"."UserRole" DROP CONSTRAINT "UserRole_organizationGroupId_fkey";

-- AlterTable
ALTER TABLE "organization"."UserRole" ALTER COLUMN "organizationGroupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "organization"."UserRole" ADD CONSTRAINT "UserRole_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
