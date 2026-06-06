-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'EMPLOYEE';
