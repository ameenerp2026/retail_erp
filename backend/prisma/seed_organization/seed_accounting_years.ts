import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// AccountingYear.createdById is required and must point to an existing User.
const ADMIN_USER_ID = 1;

/**
 * Accounting (fiscal) years.
 *
 * Indian financial year: 1 April to 31 March.
 * Dates are written as UTC midnight so they don't shift by a day on machines
 * in different timezones (e.g. IST vs UTC).
 *
 * yearName -> identity key (see note in main()). Keep the format consistent
 *             with what users type in the form, e.g. "FY 2025-26".
 * status   -> optional; omitted rows use the schema default ("OPEN").
 *
 * ⚠️ These rows are examples. Adjust the range to the years your business
 * actually needs, and mark finished years as CLOSED if that matches reality.
 */
const ACCOUNTING_YEARS: {
  fromDate: Date;
  toDate: Date;
  yearName: string;
  status?: "OPEN" | "CLOSED";
}[] = [
  {
    yearName: "FY 2024-25",
    fromDate: new Date("2024-04-01T00:00:00.000Z"),
    toDate: new Date("2025-03-31T00:00:00.000Z"),
  },
  {
    yearName: "FY 2025-26",
    fromDate: new Date("2025-04-01T00:00:00.000Z"),
    toDate: new Date("2026-03-31T00:00:00.000Z"),
  },
  {
    yearName: "FY 2026-27",
    fromDate: new Date("2026-04-01T00:00:00.000Z"),
    toDate: new Date("2027-03-31T00:00:00.000Z"),
  },
];

async function main() {
  console.log(`Seeding ${ACCOUNTING_YEARS.length} accounting years...`);

  for (const year of ACCOUNTING_YEARS) {
    // yearName is not @unique in the schema, so upsert isn't available.
    // find + update/create keeps this safe to re-run. If you add @unique to
    // yearName later, switch this block to prisma.accountingYear.upsert().
    const existing = await prisma.accountingYear.findFirst({
      where: { yearName: year.yearName },
    });

    if (existing) {
      await prisma.accountingYear.update({
        where: { id: existing.id },
        data: { ...year, updatedById: ADMIN_USER_ID },
      });
    } else {
      await prisma.accountingYear.create({
        data: { ...year, createdById: ADMIN_USER_ID },
      });
    }
  }

  console.log("✅ Accounting years seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });