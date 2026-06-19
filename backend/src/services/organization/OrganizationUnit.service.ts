import prisma from '../../config/prisma.js'


export const createOrganizationUnit = async(data:any)=>{
    return prisma.organizationUnit.create({
        data:{
            unitId : data.unitId,
            organizationUnit:data.organizationUnit,
            branchName:data.branchName,
            gstIn: data.gstIn,
            manager: data.manager,
            status: data.status,
        }
    })
}

export const getOrganizationUnit =async(id:number)=>{
    return prisma.organizationUnit.findUnique({
        where:{
            id,
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
         data:{
            unitId : data.unitID,
            organizationUnit:data.organizationUnit,
            branchName:data.branchName,
            gstIn: data.gstIn,
            manager: data.manager,
            status: data.status,
        }
    })
}