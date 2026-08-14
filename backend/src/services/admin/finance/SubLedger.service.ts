// services/admin/finance/SubLedger.service.ts
import prisma from '../../../config/prisma.js'

const FIXED_TYPES = ['Customer', 'Vendor', 'Employee'] as const

async function resolveSubLedgerTypeId(typeName: string): Promise<number> {
  const type = await prisma.subLedgerType.findUnique({ where: { typeName } })
  if (!type) {
    const err: any = new Error(
      `Sub Ledger Type "${typeName}" is not set up. Expected one of: ${FIXED_TYPES.join(', ')}`
    )
    err.code = 'INVALID_TYPE'
    throw err
  }
  return type.id
}

const includeShape = {
  ledger: { select: { id: true, ledgerName: true } },
  subLedgerType: { select: { id: true, typeName: true } },
}

export const subLedgerService = {
  createSubLedger: async (input: any, userId?: number) => {
    const {
      subLedgerName,
      ledgerId,
      type, // typeName string: 'Customer' | 'Vendor' | 'Employee'
      balanceType,
      openingBalance,
      creditLimit,
      status,
    } = input

    const ledger = await prisma.ledger.findUnique({ where: { id: Number(ledgerId) } })
    if (!ledger) {
      const err: any = new Error('Selected Linked Ledger does not exist')
      err.code = 'INVALID_LEDGER'
      throw err
    }

    const subLedgerTypeId = await resolveSubLedgerTypeId(type)

    return prisma.subLedger.create({
      data: {
        subLedgerName: subLedgerName.trim(),
        ledgerId: Number(ledgerId),
        subLedgerTypeId,
        balanceType: balanceType ?? 'debit',
        openingBalance: openingBalance ?? 0,
        creditLimit: creditLimit ? Number(creditLimit) : null,
        status: status ?? 'active',
        createdBy: userId ?? null,
        updatedBy: userId ?? null,
      },
      include: includeShape,
    })
  },

  updateSubLedger: async (id: number, input: any, userId?: number) => {
    const {
      subLedgerName,
      ledgerId,
      type,
      balanceType,
      openingBalance,
      creditLimit,
      status,
    } = input

    const existing = await prisma.subLedger.findUnique({ where: { id } })
    if (!existing) {
      const err: any = new Error('Sub Ledger not found')
      err.code = 'NOT_FOUND'
      throw err
    }

    const ledger = await prisma.ledger.findUnique({ where: { id: Number(ledgerId) } })
    if (!ledger) {
      const err: any = new Error('Selected Linked Ledger does not exist')
      err.code = 'INVALID_LEDGER'
      throw err
    }

    const subLedgerTypeId = await resolveSubLedgerTypeId(type)

    return prisma.subLedger.update({
      where: { id },
      data: {
        subLedgerName: subLedgerName.trim(),
        ledgerId: Number(ledgerId),
        subLedgerTypeId,
        balanceType: balanceType ?? existing.balanceType,
        openingBalance: openingBalance ?? existing.openingBalance,
        creditLimit: creditLimit ? Number(creditLimit) : null,
        status: status ?? existing.status,
        updatedBy: userId ?? null,
      },
      include: includeShape,
    })
  },

  deleteSubLedger: async (id: number, userId?: number) => {
    const existing = await prisma.subLedger.findUnique({ where: { id } })
    if (!existing) {
      const err: any = new Error('Sub Ledger not found')
      err.code = 'NOT_FOUND'
      throw err
    }
    return prisma.subLedger.update({
    where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId ?? null,
        status: "inactive",
      },
  });
  },

  getSubLedgers: async () => {
    return prisma.subLedger.findMany({
      include: includeShape,
      orderBy: { createdAt: 'asc' },
    })
  },
}