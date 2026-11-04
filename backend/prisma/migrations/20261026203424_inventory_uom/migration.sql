-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory";

-- CreateEnum
CREATE TYPE "inventory"."MasterStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "inventory"."Uom" (
    "id" SERIAL NOT NULL,
    "organizationGroupId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "inventory"."MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Uom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Uom_organizationGroupId_code_key" ON "inventory"."Uom"("organizationGroupId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Uom_organizationGroupId_name_key" ON "inventory"."Uom"("organizationGroupId", "name");

-- AddForeignKey
ALTER TABLE "inventory"."Uom" ADD CONSTRAINT "Uom_organizationGroupId_fkey" FOREIGN KEY ("organizationGroupId") REFERENCES "organization"."OrganizationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
