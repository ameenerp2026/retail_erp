import type { PrismaClient } from "@prisma/client";
import { allPermissions } from "./data/permissions/index.js";

export async function seedPermissions(prisma: PrismaClient): Promise<void> {
  const permissionCodes = allPermissions.map(({ code }) => code);
  const duplicateCodes = [...new Set(
    permissionCodes.filter(
      (code, index) => permissionCodes.indexOf(code) !== index,
    ),
  )];

  if (duplicateCodes.length > 0) {
    throw new Error(
      `Duplicate permission codes found: ${duplicateCodes.join(", ")}`,
    );
  }

  for (const permission of allPermissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
        module: permission.module,
        screen: permission.screen,
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log(`Seeded ${allPermissions.length} security permissions`);
}
