
import prisma from  '../../../config/prisma.js'
import { Prisma } from '@prisma/client'
import { createAuditLog } from "../../../services/admin/userLogs.service.js";
import { AuthRequest } from '../../../middleware/auth.middleware.js';



type UomStatus = 'ACTIVE' | 'INACTIVE'

const httpError=(status:number, message:string)=>{
    Object.assign(new Error(message),{status})
}



export const uomService = {

 
async list(filters?:{search?: string; status?:UomStatus}){
    
        const where:Prisma.UomWhereInput = {
            ...(filters?.search ?{
                OR:[
                  {name: {contains: filters.search ,mode: 'insensitive' as const }},
                   {code: {contains: filters.search ,mode: 'insensitive' as const }},
                ]
            } :{}),
            ...(filters?.status ? {status: filters.status} : {}),
        
        }
        return prisma.uom.findMany({where, orderBy:{id:'asc'}})
},
           



async create(data: { code: string; name: string } , createdBy:number){
    const code =data.code.trim().toUpperCase()
    const name = data.name.trim()
    return prisma.uom.create({ data: { code, name, createdById: createdBy } })
},
async update(id:number, status:UomStatus, updatedBy:number){
const existing = await prisma.uom.findUnique({where:{id}})
if(!existing) throw httpError (404,'UOM not found')
return prisma.uom.update({where:{id}, data:{status, updatedById: updatedBy}})
}
}