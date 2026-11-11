import type { PrismaClient } from "@prisma/client";

const unitUserRoleName = "Standard Unit User";
const unitUserPermissionCodes = ["TAX_VIEW"];

export async function seedRoles(prisma: PrismaClient): Promise<void> {
  const organizationGroup = await prisma.organizationGroup.findFirst();

  if (!organizationGroup) {
    throw new Error(
      "Cannot seed security roles: no OrganizationGroup exists.",
    );
  }

  const adminRole = await prisma.role.upsert({
    where: {
      organizationGroupId_name: {
        organizationGroupId: organizationGroup.id,
        name: "Administrator",
      },
    },
    update: {
      description: "Administrative access",
      roleType: "ADMIN",
      scope: "GROUP",
      priority: 80,
      status: "ACTIVE",
    },
    create: {
      name: "Administrator",
      description: "Administrative access",
      roleType: "ADMIN",
      scope: "GROUP",
      priority: 80,
      status: "ACTIVE",
      organizationGroupId: organizationGroup.id,
    },
  });

  console.log(`Administrator role ready: ${adminRole.id}`);

  const allPermissions = await prisma.permission.findMany();

  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `Assigned ${allPermissions.length} permissions to Administrator`,
  );

  const unitUserRole = await prisma.role.findUnique({
    where: {
      organizationGroupId_name: {
        organizationGroupId: organizationGroup.id,
        name: unitUserRoleName,
      },
    },
  });

  if (!unitUserRole) {
    console.warn(
      `Role "${unitUserRoleName}" not found in organization group ${organizationGroup.id}; skipping unit-user permissions.`,
    );
    return;
  }

  const unitUserPermissions = await prisma.permission.findMany({
    where: {
      code: {
        in: unitUserPermissionCodes,
      },
    },
  });

  await prisma.rolePermission.createMany({
    data: unitUserPermissions.map((permission) => ({
      roleId: unitUserRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `Assigned ${unitUserPermissions.length} permissions to ${unitUserRoleName}`,
  );
}
