-- CreateTable
CREATE TABLE "organization"."FinanceMonthAudit" (
    "id" SERIAL NOT NULL,
    "financeMonthId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceMonthAudit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "organization"."FinanceMonthAudit" ADD CONSTRAINT "FinanceMonthAudit_financeMonthId_fkey" FOREIGN KEY ("financeMonthId") REFERENCES "organization"."FinanceMonth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."FinanceMonthAudit" ADD CONSTRAINT "FinanceMonthAudit_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
