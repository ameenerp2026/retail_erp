-- CreateEnum
CREATE TYPE "inventory"."HierarchyLevel" AS ENUM ('GROUP', 'DEPARTMENT', 'SECTION');

-- CreateTable
CREATE TABLE "inventory"."ProductHierarchy" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "inventory"."HierarchyLevel" NOT NULL,
    "parentId" INTEGER,
    "status" "inventory"."MasterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductHierarchy_parentId_idx" ON "inventory"."ProductHierarchy"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHierarchy_level_code_key" ON "inventory"."ProductHierarchy"("level", "code");

-- AddForeignKey
ALTER TABLE "inventory"."ProductHierarchy" ADD CONSTRAINT "ProductHierarchy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory"."ProductHierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Level/parent rule
ALTER TABLE "inventory"."ProductHierarchy"
ADD CONSTRAINT "ProductHierarchy_level_parent_check"
CHECK (
  ("level" = 'GROUP'  AND "parentId" IS NULL)
  OR
  ("level" <> 'GROUP' AND "parentId" IS NOT NULL)
);