-- CreateTable
CREATE TABLE "inventory"."tax_configs" (
    "id" SERIAL NOT NULL,
    "tax_id" VARCHAR(20) NOT NULL,
    "product_code" VARCHAR(60) NOT NULL,
    "product_name" VARCHAR(200) NOT NULL,
    "hsn_sac" VARCHAR(20),
    "tax_group" VARCHAR(80) NOT NULL,
    "gstRate" DECIMAL(5,2) NOT NULL,
    "cess" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" INTEGER,
    "updated_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_configs_tax_id_key" ON "inventory"."tax_configs"("tax_id");

