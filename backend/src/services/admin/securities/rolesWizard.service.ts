import { Role, RoleType } from '@prisma/client'



const PRIORITY :Record<RoleType, number> = {
     STANDARD: 1,
  MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
}
export interface CreateRoleInput {
    name:string,
    description?: string | null,
    roleType:RoleType,
    organizationGroupId:number,
    permissionIds:number[]
}

export const createRole