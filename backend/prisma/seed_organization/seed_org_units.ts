import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Organization units (branches, regional offices, HQ).
 *
 * organizationGroup -> NAME of an existing OrganizationGroup. It is resolved
 *                      to organizationGroupId at run time, so the group
 *                      seed must run before this one.
 * unitType          -> value from the "Unit Type" dropdown (e.g. "Head Office").
 * gstIn             -> used as the identity key (see note in main()).
 * country / status  -> optional, default to "IN" / "Active" per the schema.
 *
 * ⚠️ The row below is a placeholder built from the form's example values.
 * Replace it with your real units.
 */
const ORG_UNITS: {
  organizationUnit: string;
  unitType: string;
  gstIn: string;
  manager: string;
  organizationGroup: string;
  country?: string;
  state: string;
  address: string;
  status?: string;
}[] = [
  {
    organizationUnit: "Mumbai South",
    unitType: "Head Office",
    gstIn: "27AABCS1429B1ZB",
    manager: "Raj Kumar",
    organizationGroup: "ACME",
    country: "IN",
    state: "Maharashtra", // ⚠️ confirm: full name or isoCode ("MH")?
    address: "Bangalore",
    status: "Active",
  },
  {
    organizationUnit: "Bengaluru East",
    unitType: "Head Office",
    gstIn: "29BLRO05160B1DU",
    manager: "Ravi Kumar",
    organizationGroup: "ACME",
    country: "IN",
    state: "Karnataka", // ⚠️ confirm: full name or isoCode ("MH")?
    address: "Bangalore",
    status: "Active",
  },
  {
    organizationUnit: "Bhopal West",
    unitType: "Head Office",
    gstIn: "23BPLC02452C1DU",
    manager: "Ramya",
    organizationGroup: "ACME",
    country: "IN",
    state: "Madhya Pradesh", // ⚠️ confirm: full name or isoCode ("MH")?
    address: "Bhopal",
    status: "Active",
  },
  {
    organizationUnit: "Gujrat North",
    unitType: "Head Office",
    gstIn: "24AAACC1206D1ZM",
    manager: "Rashmi",
    organizationGroup: "ACME",
    country: "IN",
    state: "Gujarat", // ⚠️ confirm: full name or isoCode ("MH")?
    address: "Ahemdabad",
    status: "Active",
  },
  
];

async function main() {
  console.log(`Seeding ${ORG_UNITS.length} organization units...`);

  for (const { organizationGroup: groupName, ...unit } of ORG_UNITS) {
    const group = await prisma.organizationGroup.findFirst({
      where: { shortName: groupName },
    });

    if (!group) {
      throw new Error(
        `OrganizationGroup "${groupName}" not found for unit "${unit.organizationUnit}". Seed groups first.`
      );
    }

    const data = { ...unit, organizationGroupId: group.id };

    // gstIn is not @unique in the schema, so upsert isn't available.
    // find + update/create keeps this safe to re-run. If you add @unique to
    // gstIn later, switch this block to prisma.organizationUnit.upsert().
    const existing = await prisma.organizationUnit.findFirst({
      where: { gstIn: unit.gstIn },
    });

    if (existing) {
      await prisma.organizationUnit.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.organizationUnit.create({ data });
    }
  }

  console.log("✅ Organization units seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });