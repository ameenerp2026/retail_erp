-- CreateTable
CREATE TABLE "OrganizationGroup" (
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
