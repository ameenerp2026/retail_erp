-- CreateTable
CREATE TABLE "inventory"."TaxConfig" (
    "id" SERIAL NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "taxGroup" TEXT NOT NULL,
    "gstRate" DECIMAL(5,2) NOT NULL,
    "cessRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "effectiveFrom" DATE NOT NULL,
    "status" "inventory"."MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxConfig_hsnCode_key" ON "inventory"."TaxConfig"("hsnCode");
