import prisma from '../../../config/prisma.js'

// export const createFinanceMonth = async (data: any) => {
//   return prisma.financeMonth.create({
//     data: {
//       period: data.period,
//       startDate: new Date(data.startDate),
//       endDate: new Date(data.endDate),
//       financeStatus: data.financeStatus,
//     updatedAt: data.updatedAt
//     },
//   });
// };
export const getFinanceMonths = async () => {
  return prisma.financeMonth.findMany({
    orderBy: { startDate: "desc" },
  });
};

export const getFinanceMonthById = async (accountingYearId: number) => {
  return prisma.financeMonth.findMany({
    where: {
      accountingYearId,
    },
    orderBy: {
      startDate: "asc",
    },
  });
};

// export const updateFinanceMonth = async (id: number, data: any) => {
//   return prisma.financeMonth.update({
//     where: { id },
//     data,
//   });
// };

// export const deleteFinanceMonth = async (id: number) => {
//   return prisma.financeMonth.delete({
//     where: { id },
//   });
// };