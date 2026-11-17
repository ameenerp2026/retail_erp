import type { PrismaClient } from "@prisma/client";
import { parseId, parseTaxConfigInput } from "../../../../src/utils/inventory/productSetup/taxConfig.validation.js";
import { sampleTaxConfigs } from "../../data/Inventory/productSetup/taxConfig.seed.js";

const ADMIN_EMAIL = "admin@streamys.in";
const EFFECTIVE_FROM = "2026-04-01";

export async function seedTaxConfigs(prisma: PrismaClient) {
  // 1. Never add sample tax rates to production
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠ Skipped sample tax configs in production");
    return;
  }

  // 2. Find the admin user, to save as createdById
  const admin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true },
  });
  if (!admin) {
    throw new Error(`User ${ADMIN_EMAIL} not found. Create the admin user first.`);
  }

  // 3. Check every row with the same rules as the API
  const rows = sampleTaxConfigs.map((item, index) => {
    const parsed = parseTaxConfigInput({
      hsnCode: item.hsnCode,
      taxGroup: item.taxGroup,
      gstRate: item.gstRate,
      cessRate: 0,
      effectiveFrom: EFFECTIVE_FROM,
      isDefault: false,
      status: "ACTIVE",
    });

    if (!parsed.ok) {
      throw new Error(`Sample tax row ${index + 1} (${item.label}): ${parsed.error}`);
    }
    return parsed.data;
  });

  // 4. Save all rows; skip HSN codes that already exist
  const result = await prisma.taxConfig.createMany({
    data: rows.map((row) => ({ ...row, createdById: admin.id })),
    skipDuplicates: true,
  });

  console.log(
    `✔ Sample tax configs: ${result.count} added, ${rows.length - result.count} already existed`,
  );
}