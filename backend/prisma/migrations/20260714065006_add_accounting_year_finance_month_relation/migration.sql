/*
  Warnings:

  - You are about to drop the `AccountingYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountingYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "organization"."YearStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "organization"."GstType" AS ENUM ('REGULAR', 'COMPOSITION');

-- CreateEnum
CREATE TYPE "organization"."GstStatus" AS ENUM ('VERIFIED', 'PENDING', 'FAILED');

-- DropTable
DROP TABLE "finance"."AccountingYear";

-- DropTable
DROP TABLE "public"."AccountingYear";

-- DropTable
DROP TABLE "public"."OrganizationGroup";

-- DropTable
DROP TABLE "public"."OrganizationUnit";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."Roles";

-- CreateTable
CREATE TABLE "organization"."AccountingYear" (
    "id" SERIAL NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "yearName" TEXT NOT NULL,
    "status" "organization"."YearStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."FinanceMonth" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "financeStatus" TEXT NOT NULL,
    "accountingYearId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."GSTMangement" (
    "id" SERIAL NOT NULL,
    "gstin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "organizationUnit" TEXT NOT NULL,
    "type" "organization"."GstType" NOT NULL,
    "status" "organization"."GstStatus" NOT NULL,
    "lastVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GSTMangement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GSTMangement_gstin_key" ON "organization"."GSTMangement"("gstin");

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."FinanceMonth" ADD CONSTRAINT "FinanceMonth_accountingYearId_fkey" FOREIGN KEY ("accountingYearId") REFERENCES "organization"."AccountingYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
