DROP TABLE IF EXISTS "inventory"."Uom";

CREATE TABLE "inventory"."Uom" (
  "id" SERIAL NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "inventory"."MasterStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdById" INTEGER NOT NULL,
  "updatedById" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Uom_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Uom_code_key" ON "inventory"."Uom"("code");
CREATE UNIQUE INDEX "Uom_name_key" ON "inventory"."Uom"("name");