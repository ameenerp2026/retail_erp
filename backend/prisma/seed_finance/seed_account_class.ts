import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

// ⚠️ Set this to a real admin/system user id before running.
// createdBy / updatedBy are plain Int columns here (no foreign key), so a
// wrong id won't fail, but it will record the wrong user.
const ADMIN_USER_ID = 1;

/**
 * Account classes (classifications under an account group).
 *
 * groupCode -> groupCode of an existing AccountGroup (e.g. "AG005"). It is
 *              unique, so it is the safest way to reference a group. It is
 *              resolved to accountGroupId at run time, so your main seed
 *              (groups, sub-groups, account groups) must run before this one.
 * className -> together with the group, forms the unique key
 *              (@@unique([className, accountGroupId])), so this seed uses
 *              a real upsert.
 * status    -> optional; omitted rows use the schema default ("active").
 *
 * ⚠️ The class names below are examples. The group codes match your
 * account group seed. Replace the classes with your real chart of accounts.
 */
const ACCOUNT_CLASSES: {
  className: string;
  groupCode: string;
  description?: string;
  status?: Status;
}[] = [
  // AG005 - Cash & Cash Equivalents
  { className: "Cash in Hand", groupCode: "AG005", description: "Physical cash held at the business" },
  { className: "Petty Cash", groupCode: "AG005", description: "Small cash float for day-to-day expenses" },

  // AG006 - Bank Accounts
  { className: "Current Accounts", groupCode: "AG006", description: "Business current accounts" },
  { className: "Savings Accounts", groupCode: "AG006", description: "Business savings accounts" },

  // AG007 - Accounts Receivable
  { className: "Trade Receivables", groupCode: "AG007", description: "Amounts owed by customers" },

  // AG014 - Accounts Payable
  { className: "Trade Payables", groupCode: "AG014", description: "Amounts owed to suppliers" },

  // AG015 - GST Payable
  { className: "Output GST", groupCode: "AG015", description: "GST collected on sales" },

  // AG019 - Sales - Retail
  { className: "Retail Sales", groupCode: "AG019", description: "Revenue from retail sales" },
];

async function main() {
  console.log(`Seeding ${ACCOUNT_CLASSES.length} account classes...`);

  for (const { groupCode, ...cls } of ACCOUNT_CLASSES) {
    const group = await prisma.accountGroup.findUnique({
      where: { groupCode },
    });

    if (!group) {
      throw new Error(
        `AccountGroup with code "${groupCode}" not found for class "${cls.className}". Run the main seed (account groups) first.`
      );
    }

    await prisma.accountClass.upsert({
      where: {
        className_accountGroupId: {
          className: cls.className,
          accountGroupId: group.id,
        },
      },
      update: {
        description: cls.description,
        ...(cls.status && { status: cls.status }),
        updatedBy: ADMIN_USER_ID,
      },
      create: {
        className: cls.className,
        accountGroupId: group.id,
        description: cls.description,
        ...(cls.status && { status: cls.status }),
        createdBy: ADMIN_USER_ID,
      },
    });
  }

  console.log("✅ Account classes seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });