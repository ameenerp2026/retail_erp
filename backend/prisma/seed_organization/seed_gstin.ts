import { PrismaClient, RegistrationType } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// GSTIN.createdById is required and must point to an existing User.
const ADMIN_USER_ID = 1;

/**
 * GSTIN registrations, each linked to an org unit.
 *
 * gstin            -> unique key, so this seed uses a real upsert.
 * state            -> full state name, matching the GstState seed
 *                     (e.g. "Maharashtra", not "MH").
 * organizationUnit -> NAME of an existing OrganizationUnit. It is resolved to
 *                     organizationUnitId at run time, so the unit seed must
 *                     run before this one.
 * registrationType -> value from the RegistrationType enum.
 * status           -> not set here; new rows use the schema default
 *                     ("PENDING"). Existing rows keep their current status.
 *
 * ⚠️ These rows reuse the GSTINs from the org unit seed. Replace them with
 * your real registrations. A unit can have several GSTINs (one per state).
 */
const GSTINS: {
  gstin: string;
  state: string;
  organizationUnit: string;
  registrationType: RegistrationType;
}[] = [
  {
    gstin: "27AABCS1429B1ZB",
    state: "Maharashtra",
    organizationUnit: "Mumbai South",
    registrationType: "REGULAR", // ⚠️ confirm against your RegistrationType enum
  },
  {
    gstin: "29BLRO05160B1DU",
    state: "Karnataka",
    organizationUnit: "Bengaluru East",
    registrationType: "REGULAR",
  },
  {
    gstin: "23BPLC02452C1DU",
    state: "Madhya Pradesh",
    organizationUnit: "Bhopal West",
    registrationType: "REGULAR",
  },
  {
    gstin: "24AAACC1206D1ZM",
    state: "Gujarat",
    organizationUnit: "Gujrat North", // must match the unit seed spelling exactly
    registrationType: "REGULAR",
  },
];

async function main() {
  console.log(`Seeding ${GSTINS.length} GSTINs...`);

  for (const { organizationUnit: unitName, ...g } of GSTINS) {
    // organizationUnit (name) is not @unique, so findFirst is used here.
    const unit = await prisma.organizationUnit.findFirst({
      where: { organizationUnit: unitName },
    });

    if (!unit) {
      throw new Error(
        `OrganizationUnit "${unitName}" not found for GSTIN "${g.gstin}". Seed org units first.`
      );
    }

    await prisma.gSTIN.upsert({
      where: { gstin: g.gstin },
      update: {
        state: g.state,
        registrationType: g.registrationType,
        organizationUnitId: unit.id,
      },
      create: {
        gstin: g.gstin,
        state: g.state,
        registrationType: g.registrationType,
        organizationUnitId: unit.id,
        createdById: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ GSTINs seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });