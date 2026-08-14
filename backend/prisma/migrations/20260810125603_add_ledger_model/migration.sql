-- AlterTable
ALTER TABLE "finance"."ledgers" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" INTEGER;
