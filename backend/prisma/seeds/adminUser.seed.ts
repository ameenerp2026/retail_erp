import type { PrismaClient } from "@prisma/client";

export async function seedAdminUser(prisma: PrismaClient): Promise<void> {
  const organizationGroup = await prisma.organizationGroup.findFirst();

  if (!organizationGroup) {
    throw new Error(
      "Cannot assign global administrator: no OrganizationGroup exists.",
    );
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: {
      organizationGroupId_name: {
        organizationGroupId: organizationGroup.id,
        name: "Administrator",
      },
    },
  });

  const adminUser = await prisma.user.findUnique({
    where: {
      email: "admin@streamys.in",
    },
  });

  if (!adminUser) {
    throw new Error("Global admin user admin@streamys.in not found.");
  }

  const existingAdminRole = await prisma.userRole.findFirst({
    where: {
      userId: adminUser.id,
      roleId: adminRole.id,
      organizationGroupId: null,
      organizationUnitId: null,
    },
  });

  if (!existingAdminRole) {
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        organizationGroupId: null,
        organizationUnitId: null,
      },
    });

    console.log(`Global Administrator assigned to ${adminUser.email}`);
  } else {
    console.log(
      `Global Administrator already assigned to ${adminUser.email}`,
    );
  }
}
