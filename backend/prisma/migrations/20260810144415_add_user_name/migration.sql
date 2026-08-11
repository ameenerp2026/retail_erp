/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "name" TEXT ;

UPDATE "user"."User"
SET "name" = 'Admin User'
WHERE "id" = 1;

UPDATE "user"."User"
SET "name" = 'Employee User'
WHERE "id" = 2;

ALTER TABLE "user"."User" ALTER COLUMN "name" SET NOT NULL; ;
