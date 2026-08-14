import prisma from '../../../config/prisma.js'
import { Status } from '@prisma/client'

/**
 * Get all active groups
 */
export const getGroups = async () => {
  return await prisma.group.findMany({
    where: {
      status: Status.active,
    },
    orderBy: {
      groupName: "asc",
    },
  });
};

/**
 * Get sub groups by group id
 */
export const getSubGroups = async (groupId: number) => {
  return await prisma.subGroup.findMany({
    where: {
      groupId,
      status: Status.active,
    },
    orderBy: {
      subGroupName: "asc",
    },
  });
};
/**
 * create unique group code
 */
export async function generateNextGroupCode(): Promise<string> {
  const [groups, subGroups, accountGroups] = await Promise.all([
    prisma.group.findMany({ select: { groupCode: true } }),
    prisma.subGroup.findMany({ select: { subGroupCode: true } }),
    prisma.accountGroup.findMany({ select: { groupCode: true } }),
  ]);

  const allCodes = [
    ...groups.map((g) => g.groupCode),
    ...subGroups.map((sg) => sg.subGroupCode),
    ...accountGroups.map((ag) => ag.groupCode),
  ].filter((code): code is string => !!code);

  const maxNumber = allCodes.reduce((max, code) => {
    const match = code.match(/^AG(\d+)$/);
    if (!match) return max;
    const num = parseInt(match[1], 10);
    return num > max ? num : max;
  }, 0);

  const nextNumber = maxNumber + 1;
  return `AG${String(nextNumber).padStart(3, "0")}`;
}

/**
 * Create account group
 */
export const createAccountGroup = async (
  data: {
    rootGroupName: string;
    groupId: number;
    subGroupId: number;
    status?: "active" | "inactive";
  },
  userId?: number
) => {
  const group = await prisma.group.findUnique({
    where: { id: data.groupId },
  });

  if (!group) {
    throw new Error(`Group with id ${data.groupId} not found`);
  }

  const groupCode = await generateNextGroupCode();

  return await prisma.accountGroup.create({
    data: {
      rootGroupName: data.rootGroupName,
      groupId: data.groupId,
      subGroupId: data.subGroupId,
      groupCode,
      createdBy: userId,
      status: data.status ?? "active",
    },
  });
};

/**
 * Update account group
 */
export const updateAccountGroup = async (
  id: number,
  data: {
    rootGroupName: string;
    groupId: number;
    subGroupId: number;
    groupCode?: string;
    status: Status;
    updatedBy?: number;
  }
) => {
  return await prisma.accountGroup.update({
    where: {
      id,
    },
    data: {
      rootGroupName: data.rootGroupName,
      groupId: data.groupId,
      subGroupId: data.subGroupId,
      groupCode: data.groupCode,
      status:data.status,
      updatedBy: data.updatedBy,
    },
  });
};

/**
 * Get all account groups
 */
export const getAccountGroups = async () => {
  return await prisma.accountGroup.findMany({
    include: {
      group: true,
      subGroup: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

/**
 * Get account group by id
 */
export const getAccountGroupById = async (id: number) => {
  return await prisma.accountGroup.findUnique({
    where: { id },
    include: {
      group: true,
      subGroup: true,
    },
  });
};

/**
 * Soft delete account group
 */
export const deleteAccountGroup = async (id: number) => {
  return await prisma.accountGroup.update({
    where: {
      id,
    },
    data: {
      status: Status.inactive,
    },
  });
};

/**
 * Get account groups by active status
 */
export const activeAccountGroups = async () => {
  return await prisma.accountGroup.findMany({
      where: { status: 'active' },
  select: { id: true, rootGroupName: true, groupCode: true },
  orderBy: { rootGroupName: 'asc' }
  });
};