import prisma from "../../../config/prisma.js";
import { Prisma, type MasterStatus, type HierarchyLevel } from "@prisma/client";
import {httpError} from "../../../utils/httpError.js";
//import {getUserOrganizationGroupId} from "../../../utils/admin/auth/organization.js";
type ProductHierarchyInput = {
    code:string;
    name: string;
    level: HierarchyLevel;
    parentId?: number | null;
}
type ProductHierarchyOutput = {
  id: number;
  code: string;
  name: string;
  level: HierarchyLevel;
  parentId: number | null;
  status: MasterStatus;
  children: ProductHierarchyOutput[];
};

const EXPECTED_PARENT_LEVELS: Record<HierarchyLevel, HierarchyLevel | null> = {
  GROUP:null,
  DEPARTMENT:"GROUP",
  SECTION:"DEPARTMENT"
}

async function validateParent(
  organizationGroupId: number,
  level: HierarchyLevel,
  parentId?: number | null | undefined
){
  const expected = EXPECTED_PARENT_LEVELS[level];
  if(expected === null && parentId != null){
    if(  parentId != null){
    throw httpError(400,` level ${level}cannot have Parent`);
  }
  return 
}
if(expected !== null && parentId === null){
  throw httpError(400,`A ${level} must have a parent ${expected}`);
}
}