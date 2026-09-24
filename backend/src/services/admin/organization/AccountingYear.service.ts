import { FinanceStatus } from '@prisma/client';
import prisma from '../../../config/prisma.js'

export const createAccountingYear = async (
  data: any,
  userId: number
) => {
  return prisma.$transaction(async (tx) => {
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);

    const startYear = fromDate.getFullYear();
    const endYear = String(toDate.getFullYear()).slice(-2);
    const yearName = `FY ${startYear}-${endYear}`;

    const accountingYear = await tx.accountingYear.create({
      data: {
        yearName,
        fromDate,
        toDate,
        createdById: userId,
      },
    });

    let current = new Date(fromDate);

    while (current <= toDate) {
      let startDate;
      let endDate;

      if (
        current.getFullYear() === fromDate.getFullYear() &&
        current.getMonth() === fromDate.getMonth()
      ) {
        startDate = new Date(fromDate);
      } else {
        startDate = new Date(current.getFullYear(), current.getMonth(), 1);
      }

      if (
        current.getFullYear() === toDate.getFullYear() &&
        current.getMonth() === toDate.getMonth()
      ) {
        endDate = new Date(toDate);
      } else {
        endDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      }

      const financeMonth = await tx.financeMonth.create({
        data: {
          accountingYearId: accountingYear.id,
          period: startDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          startDate,
          endDate,
          financeStatus: FinanceStatus.Open,
        },
      });
      await tx.financeMonthAudit.create({
        data: {
          financeMonthId: financeMonth.id,
          action: "Period Generated",
          performedById: userId,
        },
      });

      await tx.financeMonthAudit.create({
        data: {
          financeMonthId: financeMonth.id,
          action: "Period Opened",
          performedById: userId,
        },
      });

      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return accountingYear;
  });
};

export const getAccountingYearById = async (id: number) => {
  return prisma.accountingYear.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      financeMonths: {
        include: {
          auditLogs: {
            include: {
              performedBy: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })
}

export const getAccountingYear = async () => {
  return prisma.accountingYear.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      financeMonths: {
        include: {
          auditLogs: {
            include: {
              performedBy: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

