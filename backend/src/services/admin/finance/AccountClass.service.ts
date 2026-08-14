import prisma from '../../../config/prisma.js'
import { Status } from '@prisma/client'

export const createAccountClass = async (
  data: {
    className: string;
    accountGroupId: number;
    description: string;
    status?: "active" | "inactive";
  },
  userId?: number
) => {
    return await prisma.accountClass.create({
    data: {
      className: data.className,
      accountGroupId: data.accountGroupId,
      description: data.description,
      createdBy: userId,
      status: data.status ?? "active",
    },
  });
}

/**
 * Get all account classes
 */
export const getAccountClasses = async () => {
  return await prisma.accountClass.findMany({
    include: {
      accountGroup: {
        select: {
          id: true,
          rootGroupName: true,
          groupCode: true,
        },
      },
      _count: { select: { ledgers: true } }
    },
     orderBy: {
      createdAt: "asc",
    },
  });
};
/**
 * Get all account class by id
 */
export const getAccountClassById = async (id: number) => {
  return await prisma.accountClass.findUnique({
    where: { id },
    include: {
      accountGroup: {
        select: {
          id: true,
          rootGroupName: true,
          groupCode: true,
        },
      },
    },
  });
};
/**
 * Update account class
 */
export const updateAccountClass = async (id: number, input: any, userId?: number) => {
    const { className, accountGroupId, description, status } = input;

    return prisma.accountClass.update({
      where: { id },
      data: {
        className: className.trim(),
        accountGroupId: Number(accountGroupId),
        description: description?.trim() || null,
        status: status ?? "active",
        updatedBy: userId ?? null,
      },
      include: {
        accountGroup: {
          select: { id: true, rootGroupName: true, groupCode: true },
        },
        _count: { select: { ledgers: true } },
      },
    });
  }

export const deleteAccountClass = async (id: number, userId?: number) => {
    return prisma.accountClass.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId ?? null,
        status: "inactive", // optional: also flip status so it stops showing as active anywhere else that filters by status
      },
    });
  }
//Account Class Service
  export const getAccountClassesByGroup = async (accountGroupId: number) => {
    return prisma.accountClass.findMany({
      where: {
        accountGroupId,
        status: "active",
        deletedAt: null,
      },
      select: {
        id: true,
        className: true,
      },
      orderBy: { className: "asc" },
    });
  }
