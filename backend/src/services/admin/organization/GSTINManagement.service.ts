import prisma from '../../../config/prisma.js'
import { getUserScopes } from "../../../utils/admin/securities/scope.helper.js";
import { hasGlobalScope } from "../../../utils/admin/securities/scope.utils.js";

export const createGST = async (data: any) => {
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


export const getGSTDetails = async (userId: number) => {
  const scopes = await getUserScopes(userId);

  const hasGlobalAccess = scopes.some(hasGlobalScope);

  let allowedUnitIds: number[] | undefined;

  if (!hasGlobalAccess) {
    const groupIds = scopes
      .filter(
        (scope) =>
          scope.organizationGroupId !== null &&
          scope.organizationUnitId === null
      )
      .map((scope) => scope.organizationGroupId as number);

    const unitIds = scopes
      .filter((scope) => scope.organizationUnitId !== null)
      .map((scope) => scope.organizationUnitId as number);

    const allowedUnits = await prisma.organizationUnit.findMany({
      where: {
        OR: [
          ...(groupIds.length > 0
            ? [{ organizationGroupId: { in: groupIds } }]
            : []),
          ...(unitIds.length > 0
            ? [{ id: { in: unitIds } }]
            : []),
        ],
      },
      select: {
        id: true,
      },
    });

    allowedUnitIds = allowedUnits.map((unit) => unit.id);
  }

  return prisma.gSTIN.findMany({
    ...(allowedUnitIds !== undefined
      ? { where: { organizationUnitId: { in: allowedUnitIds } } }
      : {}),
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
