-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "organizationGroupId" INTEGER,
ADD COLUMN     "organizationUnitId" INTEGER;

-- CreateIndex
CREATE INDEX "User_organizationGroupId_idx" ON "user"."User"("organizationGroupId");

-- CreateIndex
CREATE INDEX "User_organizationUnitId_idx" ON "user"."User"("organizationUnitId");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_organizationUnitId_fkey" FOREIGN KEY ("organizationUnitId") REFERENCES "organization"."OrganizationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
