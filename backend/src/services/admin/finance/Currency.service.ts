import prisma  from '../../../config/prisma.js'

type CurrencyInput = {
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isBase: boolean
}

export const currencyService = {
  getCurrencies: async () => {
    return prisma.currency.findMany({
      where: { deletedAt: null },
      orderBy: [{ isBase: 'desc' }, { currencyCode: 'asc' }],
    })
  },

  createCurrency: async (body: CurrencyInput, userId?: number) => {
    return prisma.$transaction(async (tx) => {
      // only one base currency allowed at a time
      if (body.isBase) {
        await tx.currency.updateMany({
          where: { isBase: true, deletedAt: null },
          data: { isBase: false },
        })
      }

      return tx.currency.create({
        data: {
          currencyCode: body.code.trim().toUpperCase(),
          currencyName: body.name.trim(),
          symbol: body.symbol.trim(),
          exchangeRate: body.exchangeRate,
          isBase: body.isBase,
          createdBy: userId ?? null,
        },
      })
    })
  },

  updateCurrency: async (id: number, body: CurrencyInput, userId?: number) => {
    const existing = await prisma.currency.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      const err: any = new Error('Currency not found')
      err.code = 'NOT_FOUND'
      throw err
    }

    return prisma.$transaction(async (tx) => {
      if (body.isBase) {
        await tx.currency.updateMany({
          where: { isBase: true, deletedAt: null, NOT: { id } },
          data: { isBase: false },
        })
      }

      return tx.currency.update({
        where: { id },
        data: {
          currencyCode: body.code.trim().toUpperCase(),
          currencyName: body.name.trim(),
          symbol: body.symbol.trim(),
          exchangeRate: body.exchangeRate,
          isBase: body.isBase,
          updatedBy: userId ?? null,
        },
      })
    })
  },

  deleteCurrency: async (id: number, userId?: number) => {
    const existing = await prisma.currency.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      const err: any = new Error('Currency not found')
      err.code = 'NOT_FOUND'
      throw err
    }

    if (existing.isBase) {
      const err: any = new Error('The base currency cannot be deleted. Set another currency as base first.')
      err.code = 'IS_BASE_CURRENCY'
      throw err
    }

    // block delete if ledgers still reference this currency
    const linkedLedgerCount = await prisma.ledger.count({
      where: { currencyId: id },
    })
    if (linkedLedgerCount > 0) {
      const err: any = new Error('Currency linked with ledgers. Only deactivation allowed.')
      err.code = 'HAS_LINKED_LEDGERS'
      throw err
    }

    return prisma.currency.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId ?? null,
        status: 'inactive',
      },
    })
  },

  // Placeholder — no external FX rate provider wired up yet.
  // For now this just re-saves the current rate and bumps updatedAt so the UI reflects a "refresh" action.
  // Replace the exchangeRate value below once a real FX API (e.g. exchangerate.host, Open Exchange Rates) is integrated.
  refreshRate: async (id: number, userId?: number) => {
    const existing = await prisma.currency.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) {
      const err: any = new Error('Currency not found')
      err.code = 'NOT_FOUND'
      throw err
    }

    return prisma.currency.update({
      where: { id },
      data: {
        updatedBy: userId ?? null,
        // exchangeRate: <fetched live rate>,  // TODO once FX provider is wired up
      },
    })
  },
}