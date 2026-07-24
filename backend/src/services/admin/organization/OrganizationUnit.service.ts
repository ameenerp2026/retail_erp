import prisma from '../../../config/prisma.js'


export const createOrganizationUnit = async(data:any)=>{
    return prisma.organizationUnit.create({
        data:{
            organizationUnit : data.name,
            unitType:data.type,
            gstIn: data.gstin,
            manager: data.manager,
            organizationGroupId:Number(data.group),
            state:data.state,
            address:data.address,
           
        }
    })
}
export const getOrganizationUnit = async () => {
  return prisma.organizationUnit.findMany({
    include :{
        organizationGroup:{
            select:{
                id: true,
                shortName:true
            }
        }
    },
     orderBy: {
    createdAt: 'desc',
  },
  });
};

export const getOrganizationUnitById =async(id:number)=>{
    return prisma.organizationUnit.findUnique({
        where:{
            id
             
        }
    })
}

export const deleteOrganizationUnit = async(id:number)=>{
    return prisma.organizationUnit.delete({
        where:{
            id,
        }
    })
}

export const updateOrganizationUnit = async(
    id:number, 
    data:any
)=>{
    return prisma.organizationUnit .update({
        where:{
            id,
        },
         data: {
      organizationUnit: data.name,
      unitType: data.type,
      gstIn: data.gstin,
      manager: data.manager,
      organizationGroupId: Number(data.group),
      state: data.state,
      address: data.address,
    },
    })
}