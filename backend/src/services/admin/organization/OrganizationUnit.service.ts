import prisma from "../../../config/prisma.js";
import { getUserScopes } from "../../../utils/admin/securities/scope.helper.js";
import { hasGlobalScope } from "../../../utils/admin/securities/scope.utils.js";

export const createOrganizationUnit = async (data: any) => {
  return prisma.organizationUnit.create({
    data: {
      organizationUnit: data.name,
      unitType: data.type,
      gstIn: data.gstin,
      manager: data.manager,
      organizationGroupId: Number(data.group),
      state: data.state,
      address: data.address,
    },
  });
};


export const getOrganizationUnit = async (userId: number) => {
  const scopes = await getUserScopes(userId);

  // Global Admin
  const isGlobal = scopes.some((scope) =>
    hasGlobalScope(scope)
  );

  if (isGlobal) {
    return prisma.organizationUnit.findMany({
      include: {
        organizationGroup: {
          select: {
            id: true,
            shortName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Build conditions based on user's scopes
  const conditions = scopes
    .map((scope) => {
      // Group-level access
      if (
        scope.organizationGroupId !== null &&
        scope.organizationUnitId === null
      ) {
        return {
          organizationGroupId: scope.organizationGroupId,
        };
      }

      // Unit-level access
      if (
        scope.organizationGroupId !== null &&
        scope.organizationUnitId !== null
      ) {
        return {
          id: scope.organizationUnitId,
        };
      }

      return null;
    })
    .filter(Boolean);

  if (conditions.length === 0) {
    return [];
  }

  return prisma.organizationUnit.findMany({
    where: {
      OR: conditions as {
        organizationGroupId?: number;
        id?: number;
      }[],
    },
    include: {
      organizationGroup: {
        select: {
          id: true,
          shortName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const getOrganizationUnitById = async (id: number) => {
  return prisma.organizationUnit.findUnique({
    where: {
      id,
    },
  });
};


export const deleteOrganizationUnit = async (id: number) => {
  return prisma.organizationUnit.delete({
    where: {
      id,
    },
  });
};


export const updateOrganizationUnit = async (
  id: number,
  data: any
) => {
  return prisma.organizationUnit.update({
    where: {
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
  });
};