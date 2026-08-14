-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "finance"."Status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "role" "public"."Roles" NOT NULL DEFAULT 'EMPLOYEE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."groups" (
    "id" SERIAL NOT NULL,
    "group_name" VARCHAR(150) NOT NULL,
    "group_code" VARCHAR(30),
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."sub_groups" (
    "id" SERIAL NOT NULL,
    "sub_group_name" VARCHAR(150) NOT NULL,
    "sub_group_code" VARCHAR(30),
    "group_id" INTEGER NOT NULL,
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."account_groups" (
    "id" SERIAL NOT NULL,
    "root_group_name" VARCHAR(150) NOT NULL,
    "group_id" INTEGER NOT NULL,
    "sub_group_id" INTEGER NOT NULL,
    "group_code" VARCHAR(30),
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance"."account_classes" (
    "id" SERIAL NOT NULL,
    "class_name" VARCHAR(150) NOT NULL,
    "account_group_id" INTEGER NOT NULL,
    "description" TEXT,
    "status" "finance"."Status" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "groups_group_name_key" ON "finance"."groups"("group_name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_group_code_key" ON "finance"."groups"("group_code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_groups_sub_group_code_key" ON "finance"."sub_groups"("sub_group_code");

-- CreateIndex
CREATE UNIQUE INDEX "sub_groups_sub_group_name_group_id_key" ON "finance"."sub_groups"("sub_group_name", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_groups_group_code_key" ON "finance"."account_groups"("group_code");

-- CreateIndex
CREATE UNIQUE INDEX "account_groups_root_group_name_group_id_sub_group_id_key" ON "finance"."account_groups"("root_group_name", "group_id", "sub_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_classes_class_name_account_group_id_key" ON "finance"."account_classes"("class_name", "account_group_id");

-- AddForeignKey
ALTER TABLE "finance"."sub_groups" ADD CONSTRAINT "sub_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "finance"."groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."account_groups" ADD CONSTRAINT "account_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "finance"."groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."account_groups" ADD CONSTRAINT "account_groups_sub_group_id_fkey" FOREIGN KEY ("sub_group_id") REFERENCES "finance"."sub_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finance"."account_classes" ADD CONSTRAINT "account_classes_account_group_id_fkey" FOREIGN KEY ("account_group_id") REFERENCES "finance"."account_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;