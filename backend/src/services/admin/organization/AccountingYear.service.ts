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
        yearName: yearName,
        fromDate: fromDate,
        toDate: toDate,
        createdById: userId,
      },
    });

    const financeMonths = [];

   
    
   let current = new Date(fromDate);

while (current <= toDate) {
  let startDate;
  let endDate;

  // First month
  if (
    current.getFullYear() === fromDate.getFullYear() &&
    current.getMonth() === fromDate.getMonth()
  ) {
    startDate = new Date(fromDate);
  } else {
    startDate = new Date(current.getFullYear(), current.getMonth(), 1);
  }

  // Last month
  if (
    current.getFullYear() === toDate.getFullYear() &&
    current.getMonth() === toDate.getMonth()
  ) {
    endDate = new Date(toDate);
  } else {
    endDate = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  }

  financeMonths.push({
    accountingYearId: accountingYear.id,
    period: startDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
    startDate,
    endDate,
    financeStatus: FinanceStatus.Open
  });

  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
}
    await tx.financeMonth.createMany({
      data: financeMonths,
    });

    return accountingYear;
  });
};

export const getAccountingYearById =async(id:number)=>{
    return prisma.accountingYear.findUnique({
        where:{
            id,
        },
        include:{
          createdBy:{
            select:{
              id:true,
              name:true,
              email:true
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
    financeMonths: true
   
  },
  orderBy: {
    createdAt: 'desc'
  }
});
};

