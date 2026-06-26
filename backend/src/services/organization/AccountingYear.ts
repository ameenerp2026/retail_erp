import prisma from '../../config/prisma.js'

export const createAccountingYear = async (data: any) => {
  return prisma.accountingYear.create({
    data: {
      fromDate: data.fromDate,
      toDate: data.toDate,
      yearName:data.yearName
    },
  });
};

export const getAccountingYear =async(id:number)=>{
    return prisma.accountingYear.findUnique({
        where:{
            id,
        }
    })
}
