import { PrismaClient, BalanceType, Status } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// createdBy / updatedBy are plain Int columns here (no foreign key), so a
// wrong id won't fail, but it will record the wrong user.
const ADMIN_USER_ID = 1;

/**
 * Sub ledgers (customers, vendors, employees... under a parent ledger).
 *
 * ledgerName     -> ledgerName of an existing Ledger. It must match exactly
 *                   ONE ledger; the seed stops if none or several match.
 * typeName       -> typeName of an existing SubLedgerType ("Customer",
 *                   "Vendor", "Employee"), seeded in your main seed.
 * balanceType    -> "debit" or "credit". Defaults to "debit" when omitted,
 *                   matching the schema and the form.
 * openingBalance -> string, to avoid floating point issues (e.g. "2500.00").
 *                   Defaults to "0" when omitted.
 * creditLimit    -> optional string; omit for "no credit limit" (null).
 * status         -> optional; omitted rows use the schema default ("active").
 *
 * The identity key is (subLedgerName, ledgerId), so this seed uses a real
 * upsert.
 *
 * ⚠️ The rows below are examples with made-up names. Replace them with your
 * real sub ledgers.
 */
const SUB_LEDGERS: {
  subLedgerName: string;
  ledgerName: string;
  typeName: string;
  balanceType?: BalanceType;
  openingBalance?: string;
  creditLimit?: string;
  status?: Status;
}[] = [
  // Customers, under the Sundry Debtors ledger
  {
    subLedgerName: "Sharma Traders",
    ledgerName: "Sundry Debtors",
    typeName: "Customer",
    balanceType: "debit",
    creditLimit: "100000.00",
  },
  {
    subLedgerName: "Greenfield Stores",
    ledgerName: "Sundry Debtors",
    typeName: "Customer",
    balanceType: "debit",
    creditLimit: "250000.00",
  },

  // Vendors, under the Sundry Creditors ledger
  {
    subLedgerName: "Patel Wholesale Supplies",
    ledgerName: "Sundry Creditors",
    typeName: "Vendor",
    balanceType: "credit",
  },
  {
    subLedgerName: "Metro Packaging Co",
    ledgerName: "Sundry Creditors",
    typeName: "Vendor",
    balanceType: "credit",
  },
];

async function main() {
  console.log(`Seeding ${SUB_LEDGERS.length} sub ledgers...`);

  for (const s of SUB_LEDGERS) {
    // ledgerName alone is not unique in the schema (it's unique per account
    // class), so make sure exactly one ledger matches.
    const ledgers = await prisma.ledger.findMany({
      where: { ledgerName: s.ledgerName },
      select: { id: true },
    });
    if (ledgers.length === 0) {
      throw new Error(
        `Ledger "${s.ledgerName}" not found for sub ledger "${s.subLedgerName}". Seed ledgers first.`
      );
    }
    if (ledgers.length > 1) {
      throw new Error(
        `Ledger name "${s.ledgerName}" matches ${ledgers.length} ledgers (sub ledger "${s.subLedgerName}"). Use a unique ledger name.`
      );
    }
    const ledgerId = ledgers[0].id;

    const type = await prisma.subLedgerType.findUnique({
      where: { typeName: s.typeName },
    });
    if (!type) {
      throw new Error(
        `SubLedgerType "${s.typeName}" not found for sub ledger "${s.subLedgerName}". Run the main seed (sub ledger types) first.`
      );
    }

    await prisma.subLedger.upsert({
      where: {
        subLedgerName_ledgerId: {
          subLedgerName: s.subLedgerName,
          ledgerId,
        },
      },
      // openingBalance, creditLimit and status are deliberately NOT updated
      // on re-runs, so values changed in the app aren't overwritten.
      update: {
        subLedgerTypeId: type.id,
        ...(s.balanceType && { balanceType: s.balanceType }),
        updatedBy: ADMIN_USER_ID,
      },
      create: {
        subLedgerName: s.subLedgerName,
        ledgerId,
        subLedgerTypeId: type.id,
        balanceType: s.balanceType ?? "debit",
        openingBalance: s.openingBalance ?? "0",
        creditLimit: s.creditLimit ?? null,
        ...(s.status && { status: s.status }),
        createdBy: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ Sub ledgers seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });