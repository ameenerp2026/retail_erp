-- CreateEnum
CREATE TYPE "finance"."BalanceType" AS ENUM ('debit', 'credit');

-- CreateTable
CREATE TABLE "finance"."ledgers" (
    "id" SERIAL NOT NULL,
    "ledger_name" VARCHAR(150) NOT NULL,
    "ledger_code" VARCHAR(30),
    "account_class_id" INTEGER NOT NULL,
    "account_group_id" INTEGER NOT NULL,
    "balance_type" "finance"."BalanceType" NOT NULL,
    "opening_balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currency_id" INTEGER,
    "organization_unit_id" INTEGER,
    "gst_applicable" BOOLEAN NOT NULL DEFAULT false,
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."sub_ledger_types" (
    "id" SERIAL NOT NULL,
    "type_name" VARCHAR(100) NOT NULL,
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_ledger_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."sub_ledgers" (
    "id" SERIAL NOT NULL,
    "sub_ledger_name" VARCHAR(150) NOT NULL,
    "ledger_id" INTEGER NOT NULL,
    "sub_ledger_type_id" INTEGER NOT NULL,
    "balance_type" "finance"."BalanceType" NOT NULL DEFAULT 'debit',
    "opening_balance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "credit_limit" DECIMAL(18,2),
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."currencies" (
    "id" SERIAL NOT NULL,
    "country_name" VARCHAR(100) NOT NULL,
    "currency_code" VARCHAR(10) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledgers_ledger_code_key" ON "finance"."ledgers"("ledger_code");

-- CreateIndex
CREATE UNIQUE INDEX "ledgers_ledger_name_account_class_id_key" ON "finance"."ledgers"("ledger_name", "account_class_id");

-- CreateIndex
CREATE UNIQUE INDEX "sub_ledger_types_type_name_key" ON "finance"."sub_ledger_types"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "sub_ledgers_sub_ledger_name_ledger_id_key" ON "finance"."sub_ledgers"("sub_ledger_name", "ledger_id");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_currency_code_key" ON "finance"."currencies"("currency_code");

-- AddForeignKey
ALTER TABLE "finance"."ledgers" ADD CONSTRAINT "ledgers_account_class_id_fkey" FOREIGN KEY ("account_class_id") REFERENCES "finance"."account_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."ledgers" ADD CONSTRAINT "ledgers_account_group_id_fkey" FOREIGN KEY ("account_group_id") REFERENCES "finance"."account_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."ledgers" ADD CONSTRAINT "ledgers_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "finance"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."ledgers" ADD CONSTRAINT "ledgers_organization_unit_id_fkey" FOREIGN KEY ("organization_unit_id") REFERENCES "organization"."OrganizationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."sub_ledgers" ADD CONSTRAINT "sub_ledgers_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "finance"."ledgers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."sub_ledgers" ADD CONSTRAINT "sub_ledgers_sub_ledger_type_id_fkey" FOREIGN KEY ("sub_ledger_type_id") REFERENCES "finance"."sub_ledger_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;