/*
  Warnings:

  - Added the required column `currency_name` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "finance"."currencies" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "currency_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "exchange_rate" DECIMAL(18,4) NOT NULL DEFAULT 1,
ADD COLUMN     "is_base" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_by" INTEGER,
ALTER COLUMN "country_name" DROP NOT NULL;
