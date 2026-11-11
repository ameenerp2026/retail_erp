import type { PrismaClient } from "@prisma/client";

export async function seedSubLedgerTypes(prisma: PrismaClient): Promise<void> {
  const subLedgerTypes = ["Customer", "Vendor", "Employee"];

  for (const typeName of subLedgerTypes) {
    await prisma.subLedgerType.upsert({
      where: {
        typeName,
      },
      update: {},
      create: {
        typeName,
      },
    });
  }

  console.log("Seeded sub ledger types: Customer, Vendor, Employee");
}
