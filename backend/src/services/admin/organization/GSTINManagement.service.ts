import prisma from '../../../config/prisma.js'

export const createGST=async(data:any)=>{
     return prisma.gSTIN.create({
data: {
      gstin: data.gstin,
      state: data.state,
  organizationUnit: data.organizationUnit,
      registrationType: data.registrationType,
      createdBy: {
        connect: {
          id: Number(data.createdById),
        },
      },
    },

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