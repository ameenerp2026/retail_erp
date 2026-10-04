import { PrismaClient, BalanceType, Status } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// createdBy / updatedBy are plain Int columns here (no foreign key), so a
// wrong id won't fail, but it will record the wrong user.
const ADMIN_USER_ID = 1;

/**
 * Ledgers (the individual accounts postings are made to).
 *
 * groupCode        -> groupCode of an existing AccountGroup (e.g. "AG005").
 * className        -> className of an existing AccountClass under that group.
 *                     Both are resolved to ids at run time, so the account
 *                     group and account class seeds must run first.
 * balanceType      -> "debit" or "credit".
 * openingBalance   -> string, to avoid floating point issues (e.g. "1500.00").
 *                     Defaults to "0" when omitted.
 * organizationUnit -> optional NAME of an OrganizationUnit. Omit it for
 *                     "All Units" (stored as null), matching the form.
 * ledgerCode       -> optional; it is globally unique if you set it.
 * gstApplicable    -> defaults to false when omitted.
 * status           -> optional; omitted rows use the schema default ("active").
 *
 * The identity key is (ledgerName, accountClassId), so this seed uses a real
 * upsert. Currency is left empty (null); add currencyId support if you need it.
 *
 * ⚠️ The rows below are examples. Replace them with your real ledgers.
 */
const LEDGERS: {
  ledgerName: string;
  ledgerCode?: string;
  groupCode: string;
  className: string;
  balanceType: BalanceType;
  openingBalance?: string;
  organizationUnit?: string;
  gstApplicable?: boolean;
  status?: Status;
}[] = [
  // AG005 - Cash & Cash Equivalents
  { ledgerName: "Cash in Hand", groupCode: "AG005", className: "Cash in Hand", balanceType: "debit" },
  { ledgerName: "Petty Cash", groupCode: "AG005", className: "Petty Cash", balanceType: "debit" },

  // AG006 - Bank Accounts
  { ledgerName: "Main Current Account", groupCode: "AG006", className: "Current Accounts", balanceType: "debit" },

  // AG007 - Accounts Receivable
  { ledgerName: "Sundry Debtors", groupCode: "AG007", className: "Trade Receivables", balanceType: "debit" },

  // AG014 - Accounts Payable
  { ledgerName: "Sundry Creditors", groupCode: "AG014", className: "Trade Payables", balanceType: "credit" },

  // AG015 - GST Payable
  { ledgerName: "Output CGST", groupCode: "AG015", className: "Output GST", balanceType: "credit" },
  { ledgerName: "Output SGST", groupCode: "AG015", className: "Output GST", balanceType: "credit" },
  { ledgerName: "Output IGST", groupCode: "AG015", className: "Output GST", balanceType: "credit" },

  // AG019 - Sales - Retail
  { ledgerName: "Retail Sales", groupCode: "AG019", className: "Retail Sales", balanceType: "credit", gstApplicable: true },
];

async function main() {
  console.log(`Seeding ${LEDGERS.length} ledgers...`);

  for (const l of LEDGERS) {
    const group = await prisma.accountGroup.findUnique({
      where: { groupCode: l.groupCode },
    });
    if (!group) {
      throw new Error(
        `AccountGroup with code "${l.groupCode}" not found for ledger "${l.ledgerName}". Seed account groups first.`
      );
    }

    const accountClass = await prisma.accountClass.findUnique({
      where: {
        className_accountGroupId: {
          className: l.className,
          accountGroupId: group.id,
        },
      },
    });
    if (!accountClass) {
      throw new Error(
        `AccountClass "${l.className}" not found under group "${l.groupCode}" for ledger "${l.ledgerName}". Seed account classes first.`
      );
    }

    // "All Units" in the form = no organization unit (null).
    let organizationUnitId: number | null = null;
    if (l.organizationUnit) {
      const unit = await prisma.organizationUnit.findFirst({
        where: { organizationUnit: l.organizationUnit },
      });
      if (!unit) {
        throw new Error(
          `OrganizationUnit "${l.organizationUnit}" not found for ledger "${l.ledgerName}". Seed org units first.`
        );
      }
      organizationUnitId = unit.id;
    }

    await prisma.ledger.upsert({
      where: {
        ledgerName_accountClassId: {
          ledgerName: l.ledgerName,
          accountClassId: accountClass.id,
        },
      },
      // openingBalance and status are deliberately NOT updated on re-runs, so
      // balances or statuses changed in the app aren't overwritten.
      update: {
        accountGroupId: group.id,
        balanceType: l.balanceType,
        organizationUnitId,
        gstApplicable: l.gstApplicable ?? false,
        ...(l.ledgerCode && { ledgerCode: l.ledgerCode }),
        updatedBy: ADMIN_USER_ID,
      },
      create: {
        ledgerName: l.ledgerName,
        ledgerCode: l.ledgerCode,
        accountClassId: accountClass.id,
        accountGroupId: group.id,
        balanceType: l.balanceType,
        openingBalance: l.openingBalance ?? "0",
        organizationUnitId,
        gstApplicable: l.gstApplicable ?? false,
        ...(l.status && { status: l.status }),
        createdBy: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ Ledgers seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });