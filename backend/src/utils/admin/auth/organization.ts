import prisma from "../../../config/prisma.js";    // use the same import as uom.services.ts
import { httpError } from "../../httpError.js";


export async function getUserOrganizationGroupId(userId: number): Promise<number>{

    const user = await prisma.user.findUnique({
        where:{id:userId},
        select:{organizationGroupId: true}

        
    })
if(!user?.organizationGroupId){
            throw httpError(404, "organization group not forund for the user");
        }
    return user.organizationGroupId;

} 