/*
  Warnings:

  - You are about to drop the `AccountingYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountingYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
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

-- CreateTable
CREATE TABLE "organization"."AccountingYear" (
    "id" SERIAL NOT NULL,
    "yearName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."FinanceMonth" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "financeStatus" TEXT NOT NULL DEFAULT 'Open',
    "invoiceStatus" TEXT NOT NULL DEFAULT 'Open',
    "cogsStatus" TEXT NOT NULL DEFAULT 'Pending',
    "lastModifiedBy" TEXT,
    "lastModifiedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountingYearId" INTEGER NOT NULL,

    CONSTRAINT "FinanceMonth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "organization"."FinanceMonth" ADD CONSTRAINT "FinanceMonth_accountingYearId_fkey" FOREIGN KEY ("accountingYearId") REFERENCES "organization"."AccountingYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
