import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Organization groups (the parent company/entity that units belong to).
 *
 * cinNumber -> identity key. Each company has exactly one CIN, so it is used
 *              to detect an existing row (see note in main()).
 * status    -> optional; omitted rows use the schema default ("DRAFT").
 *
 * ⚠️ The row below is placeholder data. Replace it with your real group(s).
 */
const ORG_GROUPS: {
  shortName: string;
  logoUrl?: string;
  financialYear: string;
  currency: string;
  companyName: string;
  cinNumber: string;
  panNumber: string;
  email: string;
  phoneNumber: string;
  website?: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  status?: string;
}[] = [
  {
    shortName: "ACME",
    financialYear: "2025-26", // ⚠️ confirm the format your app uses
    currency: "INR",
    companyName: "Acme Industries Private Limited",
    cinNumber: "U12345KA2020PTC123456",
    panNumber: "AABCA1234A",
    email: "accounts@acme.example",
    phoneNumber: "+91 80 0000 0000",
    website: "https://acme.example",
    address: "1 Example Street, Bengaluru",
    state: "Karnataka",
    country: "IN",
    pinCode: "560001",
  },
];

async function main() {
  console.log(`Seeding ${ORG_GROUPS.length} organization groups...`);

  for (const group of ORG_GROUPS) {
    // cinNumber is not @unique in the schema, so upsert isn't available.
    // find + update/create keeps this safe to re-run. If you add @unique to
    // cinNumber later, switch this block to prisma.organizationGroup.upsert().
    const existing = await prisma.organizationGroup.findFirst({
      where: { cinNumber: group.cinNumber },
    });

    if (existing) {
      await prisma.organizationGroup.update({
        where: { id: existing.id },
        data: group,
      });
    } else {
      await prisma.organizationGroup.create({ data: group });
    }
  }

  console.log("✅ Organization groups seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });