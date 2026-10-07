import prisma from "../../../config/prisma.js";

export type UserScope = {
  organizationGroupId: number | null;
  organizationUnitId: number | null;
};

export const getUserScopes = async (
  userId: number
): Promise<UserScope[]> => {
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
    },
    select: {
      organizationGroupId: true,
      organizationUnitId: true,
    },
  });

  return userRoles.map((userRole) => ({
    organizationGroupId: userRole.organizationGroupId,
    organizationUnitId: userRole.organizationUnitId,
  }));
};