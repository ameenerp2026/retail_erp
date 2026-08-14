-- AlterTable
ALTER TABLE "finance"."sub_ledgers" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" INTEGER;
