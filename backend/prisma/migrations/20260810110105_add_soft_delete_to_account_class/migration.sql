-- AlterTable
ALTER TABLE "finance"."account_classes" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" INTEGER;
