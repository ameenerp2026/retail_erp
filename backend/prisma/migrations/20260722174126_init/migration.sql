-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finance";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organization";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateEnum
CREATE TYPE "user"."Roles" AS ENUM ('ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "organization"."YearStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "organization"."GstType" AS ENUM ('REGULAR', 'COMPOSITION');

-- CreateEnum
CREATE TYPE "organization"."GstStatus" AS ENUM ('VERIFIED', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "user"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "role" "user"."Roles" NOT NULL DEFAULT 'EMPLOYEE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."OrganizationGroup" (
    "id" SERIAL NOT NULL,
    "shortName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "financialYear" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "cinNumber" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "website" TEXT,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."OrganizationUnit" (
    "id" SERIAL NOT NULL,
    "organizationUnit" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "gstIn" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "OrganizationGroup" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationUnit_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "user"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GSTMangement_gstin_key" ON "organization"."GSTMangement"("gstin");

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."AccountingYear" ADD CONSTRAINT "AccountingYear_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."FinanceMonth" ADD CONSTRAINT "FinanceMonth_accountingYearId_fkey" FOREIGN KEY ("accountingYearId") REFERENCES "organization"."AccountingYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
