import { PrismaClient } from "@prisma/client";
import { seedAccounting } from "./seeds/accounting.seed.js";
import { seedAdminUser } from "./seeds/adminUser.seed.js";
import { seedPermissions } from "./seeds/permissions.seed.js";
import { seedRoles } from "./seeds/roles.seed.js";
import { seedSubLedgerTypes } from "./seeds/subLedgerTypes.seed.js";

const prisma = new PrismaClient();

const seeds = [
  { name: "accounting", run: seedAccounting },
  { name: "subLedgerTypes", run: seedSubLedgerTypes },
  { name: "permissions", run: seedPermissions },
  { name: "roles", run: seedRoles },
  { name: "adminUser", run: seedAdminUser },
];

async function main(): Promise<void> {
  const requestedSeed = process.argv[2];

  if (requestedSeed !== undefined) {
    const seed = seeds.find(({ name }) => name === requestedSeed);

    if (!seed) {
      const validNames = seeds.map(({ name }) => name).join(", ");
      throw new Error(
        `Unknown seed "${requestedSeed}". Valid seed names: ${validNames}`,
      );
    }
    await seed.run(prisma);
    await seed.run(prisma);
  } else {
    for (const seed of seeds) {
      await seed.run(prisma);
    }
  }

  console.log("==========================================");
  console.log("Database seed completed successfully");
  console.log("==========================================");
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
