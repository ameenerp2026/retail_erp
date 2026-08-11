import prisma from '../../../config/prisma.js'

export const createGST=async(data:any)=>{
     return prisma.gSTIN.create({
data,
    })
}
export const getGSTDetails = async () => {
  return prisma.gSTIN.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      organizationUnit: {
        select: {
          organizationUnit: true,
        },
      },

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};