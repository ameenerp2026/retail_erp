import prisma from "../../../config/prisma.js";
import { getUserScopes } from "../../../utils/admin/securities/scope.helper.js";
import { hasGlobalScope } from "../../../utils/admin/securities/scope.utils.js";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const createOrganizationUnit = async (data: any) => {
  const unitName = data.name ? String(data.name).trim() : "";
  const formattedGstin = data.gstin ? String(data.gstin).trim().toUpperCase() : "";

  if (!unitName) {
    const error: any = new Error("Unit name is required");
    error.statusCode = 400;
    throw error;
  }

  if (!data.group) {
    const error: any = new Error("Org Group is required");
    error.statusCode = 400;
    throw error;
  }

  if (!formattedGstin || !GSTIN_REGEX.test(formattedGstin)) {
    const error: any = new Error(
      "Invalid GSTIN format. Must be 15 characters (e.g. 29ABCDE1234F1Z5)"
    );
    error.statusCode = 400;
    throw error;
  }

  // Check duplicate unit name (case-insensitive)
  const existingName = await prisma.organizationUnit.findFirst({
    where: {
      organizationUnit: { equals: unitName, mode: "insensitive" },
    },
  });
  if (existingName) {
    const error: any = new Error(
      `An organization unit with name "${unitName}" already exists`
    );
    error.statusCode = 409;
    throw error;
  }

  // Check duplicate GSTIN
  const existingGstin = await prisma.organizationUnit.findFirst({
    where: {
      gstIn: formattedGstin,
    },
  });
  if (existingGstin) {
    const error: any = new Error(
      `GSTIN "${formattedGstin}" is already assigned to unit "${existingGstin.organizationUnit}"`
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.organizationUnit.create({
    data: {
      organizationUnit: unitName,
      unitType: data.type || "Branch",
      gstIn: formattedGstin,
      manager: data.manager || "",
      organizationGroupId: Number(data.group),
      country: data.country || "IN",
      state: data.state || "",
      address: data.address || "",
    },
    include: {
      organizationGroup: {
        select: {
          id: true,
          shortName: true,
        },
      },
    },
  });
};

export const getOrganizationUnit = async (userId: number) => {
  const scopes = await getUserScopes(userId);

  // Global Admin
  const isGlobal = scopes.some((scope) => hasGlobalScope(scope));

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
        id: "asc",
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
      id: "asc",
    },
  });
};

export const getOrganizationUnitById = async (id: number) => {
  return prisma.organizationUnit.findUnique({
    where: {
      id,
    },
    include: {
      organizationGroup: {
        select: {
          id: true,
          shortName: true,
        },
      },
    },
  });
};

export const deleteOrganizationUnit = async (id: number) => {
  // Check linked GSTIN records
  const linkedGstinCount = await prisma.gSTIN.count({
    where: { organizationUnitId: id },
  });
  if (linkedGstinCount > 0) {
    const error: any = new Error(
      "This unit is linked to GSTIN records and cannot be deleted"
    );
    error.statusCode = 409;
    throw error;
  }

  // Check linked Business Location records
  const linkedLocationsCount = await prisma.businessLocation.count({
    where: { parentOrganizationUnitId: id },
  });
  if (linkedLocationsCount > 0) {
    const error: any = new Error(
      "This unit is linked to business locations and cannot be deleted"
    );
    error.statusCode = 409;
    throw error;
  }

  // Check linked User records
  const linkedUsersCount = await prisma.user.count({
    where: { organizationUnitId: id },
  });
  if (linkedUsersCount > 0) {
    const error: any = new Error(
      "This unit is linked to user accounts and cannot be deleted"
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.organizationUnit.delete({
    where: {
      id,
    },
  });
};

export const updateOrganizationUnit = async (id: number, data: any) => {
  const unitName = data.name ? String(data.name).trim() : "";
  const formattedGstin = data.gstin ? String(data.gstin).trim().toUpperCase() : "";

  if (!unitName) {
    const error: any = new Error("Unit name is required");
    error.statusCode = 400;
    throw error;
  }

  if (!data.group) {
    const error: any = new Error("Org Group is required");
    error.statusCode = 400;
    throw error;
  }

  if (!formattedGstin || !GSTIN_REGEX.test(formattedGstin)) {
    const error: any = new Error(
      "Invalid GSTIN format. Must be 15 characters (e.g. 29ABCDE1234F1Z5)"
    );
    error.statusCode = 400;
    throw error;
  }

  // Check duplicate unit name excluding current unit
  const existingName = await prisma.organizationUnit.findFirst({
    where: {
      organizationUnit: { equals: unitName, mode: "insensitive" },
      id: { not: id },
    },
  });
  if (existingName) {
    const error: any = new Error(
      `An organization unit with name "${unitName}" already exists`
    );
    error.statusCode = 409;
    throw error;
  }

  // Check duplicate GSTIN excluding current unit
  const existingGstin = await prisma.organizationUnit.findFirst({
    where: {
      gstIn: formattedGstin,
      id: { not: id },
    },
  });
  if (existingGstin) {
    const error: any = new Error(
      `GSTIN "${formattedGstin}" is already assigned to unit "${existingGstin.organizationUnit}"`
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.organizationUnit.update({
    where: {
      id,
    },
    data: {
      organizationUnit: unitName,
      unitType: data.type || "Branch",
      gstIn: formattedGstin,
      manager: data.manager || "",
      organizationGroupId: Number(data.group),
      country: data.country || "IN",
      state: data.state || "",
      address: data.address || "",
    },
    include: {
      organizationGroup: {
        select: {
          id: true,
          shortName: true,
        },
      },
    },
  });
};
