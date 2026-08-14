import prisma from '../../../config/prisma.js';
// Function to generate a unique ledger code
async function generateLedgerCode(tx: any): Promise<string> {
  // Find the highest existing LED-### code and increment it.
  // Runs inside the same transaction as the create, so two concurrent
  // requests can't both generate the same code.
  const last = await tx.ledger.findFirst({
    where: { ledgerCode: { startsWith: 'LED-' } },
    orderBy: { ledgerCode: 'desc' },
    select: { ledgerCode: true },
  });

  let nextNumber = 1;
  if (last?.ledgerCode) {
    const match = last.ledgerCode.match(/^LED-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `LED-${String(nextNumber).padStart(3, '0')}`;
}
//service to handle ledger operations
export const ledgerService = {
  // Function to create a new ledger
  createLedger: async (input: any, userId?: number) => {
    const {
      ledgerName,
      accountClassId,
      accountGroupId,
      balanceType,
      openingBalance,
      currencyId,
      organizationUnitId,
      gstApplicable,
      status,
    } = input;
    // ledgerCode intentionally not destructured from input — it's always
    // server-generated, never accepted from the frontend

    const accountClass = await prisma.accountClass.findUnique({ where: { id: Number(accountClassId) } });
    if (!accountClass || accountClass.accountGroupId !== Number(accountGroupId)) {
      const err: any = new Error("Selected Account Class does not belong to the selected Account Group");
      err.code = "MISMATCHED_GROUP_CLASS";
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      const ledgerCode = await generateLedgerCode(tx);

      return tx.ledger.create({
        data: {
          ledgerName: ledgerName.trim(),
          ledgerCode,
          accountClassId: Number(accountClassId),
          accountGroupId: Number(accountGroupId),
          balanceType,
          openingBalance: openingBalance ?? 0,
          currencyId: currencyId ? Number(currencyId) : null,
          organizationUnitId: organizationUnitId ? Number(organizationUnitId) : null,
          gstApplicable: gstApplicable ?? false,
          status: status ?? "active",
          createdBy: userId ?? null,
          updatedBy: userId ?? null,
        },
        include: {
          accountClass: { select: { id: true, className: true } },
          accountGroup: { select: { id: true, rootGroupName: true } },
          currency: { select: { id: true, currencyCode: true, symbol: true } },
          organizationUnit: { select: { id: true, organizationUnit: true } },
        },
      });
    });
  },
// Function to get all ledgers
  getLedgers: async () => {
    return await prisma.ledger.findMany({
      include: {
        accountClass: { select: { id: true, className: true } },
        accountGroup: { select: { id: true, rootGroupName: true } },
        currency: { select: { id: true, currencyCode: true, symbol: true } },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
// Function to get a ledger by ID
  getLedgerById: async (id: number) => {
    return await prisma.ledger.findUnique({
      where: { id },
      include: {
        accountClass: { select: { id: true, className: true } },
        accountGroup: { select: { id: true, rootGroupName: true } },
        currency: { select: { id: true, currencyCode: true, symbol: true } },
        organizationUnit: { select: { id: true, organizationUnit: true } },
      },
    });
  },
  // Function to update a ledger
  updateLedger: async (id: number, input: any, userId?: number) => {
  const {
    ledgerName,
    accountClassId,
    accountGroupId,
    balanceType,
    openingBalance,
    currencyId,
    organizationUnitId,
    gstApplicable,
    status,
  } = input;

  const existing = await prisma.ledger.findUnique({ where: { id } });
  if (!existing) {
    const err: any = new Error("Ledger not found");
    err.code = "NOT_FOUND";
    throw err;
  }

  const accountClass = await prisma.accountClass.findUnique({ where: { id: Number(accountClassId) } });
  if (!accountClass || accountClass.accountGroupId !== Number(accountGroupId)) {
    const err: any = new Error("Selected Account Class does not belong to the selected Account Group");
    err.code = "MISMATCHED_GROUP_CLASS";
    throw err;
  }

  return prisma.ledger.update({
    where: { id },
    data: {
      ledgerName: ledgerName.trim(),
      accountClassId: Number(accountClassId),
      accountGroupId: Number(accountGroupId),
      balanceType,
      openingBalance: openingBalance ?? existing.openingBalance,
      currencyId: currencyId ? Number(currencyId) : null,
      organizationUnitId: organizationUnitId ? Number(organizationUnitId) : null,
      gstApplicable: gstApplicable ?? existing.gstApplicable,
      status: status ?? existing.status,
      updatedBy: userId ?? null,
    },
    // MUST match createLedger's include shape — the frontend's mapToLedger()
    // depends on accountClass/accountGroup being nested objects, not just
    // the flat accountClassId/accountGroupId scalar columns.
    include: {
      accountClass: { select: { id: true, className: true } },
      accountGroup: { select: { id: true, rootGroupName: true } },
      currency: { select: { id: true, currencyCode: true, symbol: true } },
      organizationUnit: { select: { id: true, organizationUnit: true } },
    },
  });
},
  // Function to delete a ledger (soft delete)
  deleteLedger: async (id: number, userId?: number) => {
  const existing = await prisma.ledger.findUnique({ where: { id } });
  if (!existing) {
    const err: any = new Error("Ledger not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  return prisma.ledger.update({
    where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId ?? null,
        status: "inactive",
      },
  });
},
};