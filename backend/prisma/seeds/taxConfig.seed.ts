import type { PrismaClient } from "@prisma/client";

export async function seedTaxConfig(prisma: PrismaClient): Promise<void> {
  const adminUser = await prisma.user.findUnique({
    where: {
      email: "admin@streamys.in",
    },
  });

  if (!adminUser) {
    throw new Error(
      "Cannot seed Tax Configurations: admin@streamys.in not found.",
    );
  }

  const taxConfigs = [
    {
      hsnCode: "85171290",
      taxGroup: "STANDARD",
      gstRate: 18,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
    {
      hsnCode: "64029900",
      taxGroup: "STANDARD",
      gstRate: 18,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
    {
      hsnCode: "33059000",
      taxGroup: "STANDARD",
      gstRate: 18,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
    {
      hsnCode: "84671100",
      taxGroup: "STANDARD",
      gstRate: 18,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
    {
      hsnCode: "11010020",
      taxGroup: "ESSENTIAL",
      gstRate: 5,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: true,
    },
    {
      hsnCode: "30049099",
      taxGroup: "PHARMA",
      gstRate: 12,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
    {
      hsnCode: "85171210",
      taxGroup: "STANDARD",
      gstRate: 18,
      cessRate: 0,
      effectiveFrom: new Date("2026-04-01"),
      isDefault: false,
    },
  ];

  for (const tax of taxConfigs) {
    await prisma.taxConfig.upsert({
      where: {
        hsnCode: tax.hsnCode,
      },
      update: {},
      create: {
        ...tax,
        createdById: adminUser.id,
      },
    });
  }

  console.log(`Tax Configurations seeded: ${taxConfigs.length}`);
}