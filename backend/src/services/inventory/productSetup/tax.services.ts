import { Prisma } from '@prisma/client'
import prisma from '../../../config/prisma.js'
import {
  calculateProductTax,
  deriveGstComponents,
  normalizeHsnCode,
  roundGstPrecision,
  type SupplyTransactionScope,
} from '../../../utils/inventory/gstCalculations.js'

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status })

export interface TaxConfigDTO {
  id: string
  taxId: string
  productCode: string
  productName: string
  hsnSac: string
  taxGroup: string
  gstRate: number
  cgst: number
  sgst: number
  igst: number
  cess: number
  effectiveDate: string
  isDefault: boolean
}

export interface HsnRateDTO {
  id: number
  code: string
  description: string | null
  gstRate: number | null
}

function formatIsoDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseEffectiveDate(value: string | Date | undefined): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value.trim())
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export function formatTaxConfigRow(row: {
  id: number
  taxId: string
  productCode: string
  productName: string
  hsnSac: string | null
  taxGroup: string
  gstRate: Prisma.Decimal | number
  cess: Prisma.Decimal | number
  effectiveDate: Date
  isDefault: boolean
}): TaxConfigDTO {
  const gstRate = Number(row.gstRate)
  const { cgst, sgst, igst } = deriveGstComponents(gstRate)

  return {
    id: String(row.id),
    taxId: row.taxId,
    productCode: row.productCode,
    productName: row.productName,
    hsnSac: row.hsnSac ?? '',
    taxGroup: row.taxGroup,
    gstRate: roundGstPrecision(gstRate, 2),
    cgst,
    sgst,
    igst,
    cess: roundGstPrecision(Number(row.cess ?? 0), 2),
    effectiveDate: formatIsoDate(row.effectiveDate),
    isDefault: Boolean(row.isDefault),
  }
}

export interface SaveTaxConfigInput {
  productCode: string
  productName: string
  hsnSac?: string
  taxGroup: string
  gstRate?: number
  cess?: number
  effectiveDate?: string
  isDefault?: boolean
}

export const taxService = {
  /** Fetch all HSN codes and their saved `gstRate` values from `finance.hsn_codes`. */
  async listHsnRates(): Promise<HsnRateDTO[]> {
    const rows = await prisma.hsnCode.findMany({
      select: { id: true, code: true, description: true, gstRate: true },
      orderBy: { code: 'asc' },
    })

    return rows.map((row) => ({
      id: row.id,
      code: row.code,
      description: row.description,
      gstRate: row.gstRate !== null ? Number(row.gstRate) : null,
    }))
  },

  /** Lookup an HSN code (exact or heading prefix match like 8517 12 90 -> 8517). */
  async findHsnRateByCode(rawCode: string): Promise<HsnRateDTO | null> {
    const normalized = normalizeHsnCode(rawCode)
    if (!normalized) return null

    const candidates = Array.from(
      new Set(
        [normalized, normalized.slice(0, 6), normalized.slice(0, 4), normalized.slice(0, 2)].filter(
          (c) => c.length >= 2,
        ),
      ),
    )

    const matches = await prisma.hsnCode.findMany({
      where: { code: { in: candidates } },
      select: { id: true, code: true, description: true, gstRate: true },
    })

    if (matches.length === 0) return null

    // Pick longest matching prefix
    matches.sort((a, b) => b.code.length - a.code.length)
    const best = matches[0]
    return {
      id: best.id,
      code: best.code,
      description: best.description,
      gstRate: best.gstRate !== null ? Number(best.gstRate) : null,
    }
  },

  /** Fetch all Tax Configurations and derive CGST, SGST, IGST from `gstRate`. */
  async list(filters?: { search?: string; taxGroup?: string }): Promise<TaxConfigDTO[]> {
    const search = filters?.search?.trim()
    const taxGroup = filters?.taxGroup?.trim()

    const where: Prisma.TaxConfigWhereInput = {
      ...(search
        ? {
            OR: [
              { taxId: { contains: search, mode: 'insensitive' } },
              { productCode: { contains: search, mode: 'insensitive' } },
              { productName: { contains: search, mode: 'insensitive' } },
              { hsnSac: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(taxGroup && taxGroup !== 'All' ? { taxGroup } : {}),
    }

    const rows = await prisma.taxConfig.findMany({
      where,
      orderBy: { id: 'asc' },
    })

    return rows.map(formatTaxConfigRow)
  },

  /** Fetch a single Tax Configuration by numeric ID or TAX-XXX code. */
  async getById(id: number): Promise<TaxConfigDTO> {
    const row = await prisma.taxConfig.findUnique({ where: { id } })
    if (!row) throw httpError(404, 'Tax configuration not found')
    return formatTaxConfigRow(row)
  },

  /** Create a Tax Configuration, persisting `gstRate` as the single source of truth. */
  async create(input: SaveTaxConfigInput, createdById?: number): Promise<TaxConfigDTO> {
    let resolvedGstRate = input.gstRate

    if (resolvedGstRate === undefined && input.hsnSac) {
      const matchedHsn = await this.findHsnRateByCode(input.hsnSac)
      if (matchedHsn?.gstRate !== null && matchedHsn?.gstRate !== undefined) {
        resolvedGstRate = matchedHsn.gstRate
      }
    }

    if (resolvedGstRate === undefined || !Number.isFinite(resolvedGstRate) || resolvedGstRate < 0) {
      throw httpError(400, 'Valid GST % is required')
    }

    const cess = input.cess ?? 0
    if (!Number.isFinite(cess) || cess < 0) {
      throw httpError(400, 'CESS % cannot be negative')
    }

    const created = await prisma.$transaction(async (tx) => {
      const existing = await tx.taxConfig.findMany({ select: { taxId: true } })
      const maxNum = existing.reduce((max, row) => {
        const match = row.taxId.match(/\d+/)
        const n = match ? parseInt(match[0], 10) : 0
        return Number.isNaN(n) ? max : Math.max(max, n)
      }, 0)

      const nextTaxId = `TAX-${String(maxNum + 1).padStart(3, '0')}`

      return tx.taxConfig.create({
        data: {
          taxId: nextTaxId,
          productCode: input.productCode.trim(),
          productName: input.productName.trim(),
          hsnSac: input.hsnSac?.trim() || null,
          taxGroup: input.taxGroup.trim(),
          gstRate: new Prisma.Decimal(roundGstPrecision(resolvedGstRate!, 2).toFixed(2)),
          cess: new Prisma.Decimal(roundGstPrecision(cess, 2).toFixed(2)),
          effectiveDate: parseEffectiveDate(input.effectiveDate),
          isDefault: Boolean(input.isDefault),
          createdById: createdById ?? null,
        },
      })
    })

    return formatTaxConfigRow(created)
  },

  /** Update an existing Tax Configuration, persisting `gstRate` cleanly. */
  async update(
    id: number,
    input: Partial<SaveTaxConfigInput>,
    updatedById?: number,
  ): Promise<TaxConfigDTO> {
    const existing = await prisma.taxConfig.findUnique({ where: { id } })
    if (!existing) throw httpError(404, 'Tax configuration not found')

    let nextGstRate = input.gstRate
    if (nextGstRate === undefined && input.hsnSac && !existing.gstRate) {
      const matchedHsn = await this.findHsnRateByCode(input.hsnSac)
      if (matchedHsn?.gstRate !== null && matchedHsn?.gstRate !== undefined) {
        nextGstRate = matchedHsn.gstRate
      }
    }

    if (nextGstRate !== undefined && (!Number.isFinite(nextGstRate) || nextGstRate < 0)) {
      throw httpError(400, 'GST % cannot be negative')
    }

    if (input.cess !== undefined && (!Number.isFinite(input.cess) || input.cess < 0)) {
      throw httpError(400, 'CESS % cannot be negative')
    }

    const updated = await prisma.taxConfig.update({
      where: { id },
      data: {
        ...(input.productCode !== undefined ? { productCode: input.productCode.trim() } : {}),
        ...(input.productName !== undefined ? { productName: input.productName.trim() } : {}),
        ...(input.hsnSac !== undefined ? { hsnSac: input.hsnSac.trim() || null } : {}),
        ...(input.taxGroup !== undefined ? { taxGroup: input.taxGroup.trim() } : {}),
        ...(nextGstRate !== undefined
          ? { gstRate: new Prisma.Decimal(roundGstPrecision(nextGstRate, 2).toFixed(2)) }
          : {}),
        ...(input.cess !== undefined
          ? { cess: new Prisma.Decimal(roundGstPrecision(input.cess, 2).toFixed(2)) }
          : {}),
        ...(input.effectiveDate !== undefined
          ? { effectiveDate: parseEffectiveDate(input.effectiveDate) }
          : {}),
        ...(input.isDefault !== undefined ? { isDefault: Boolean(input.isDefault) } : {}),
        updatedById: updatedById ?? null,
      },
    })

    return formatTaxConfigRow(updated)
  },

  /** Delete a Tax Configuration by numeric ID. */
  async remove(id: number): Promise<TaxConfigDTO> {
    const existing = await prisma.taxConfig.findUnique({ where: { id } })
    if (!existing) throw httpError(404, 'Tax configuration not found')

    await prisma.taxConfig.delete({ where: { id } })
    return formatTaxConfigRow(existing)
  },

  /**
   * Compute final product tax using `gstRate` from TaxConfig / HSN or explicit rate,
   * applying CGST+SGST for intra-state and IGST for inter-state, plus CESS separately.
   */
  async calculateTaxForProduct(params: {
    taxConfigId?: number
    hsnCode?: string
    gstRate?: number
    cessRate?: number
    taxableAmount: number
    transactionType: SupplyTransactionScope
  }) {
    let gstRate = params.gstRate
    let cessRate = params.cessRate

    if (params.taxConfigId !== undefined) {
      const config = await this.getById(params.taxConfigId)
      if (gstRate === undefined) gstRate = config.gstRate
      if (cessRate === undefined) cessRate = config.cess
    } else if (gstRate === undefined && params.hsnCode) {
      const hsn = await this.findHsnRateByCode(params.hsnCode)
      if (!hsn || hsn.gstRate === null) {
        throw httpError(404, `No GST rate found for HSN code ${params.hsnCode}`)
      }
      gstRate = hsn.gstRate
    }

    if (gstRate === undefined || !Number.isFinite(gstRate) || gstRate < 0) {
      throw httpError(400, 'Valid gstRate is required to calculate product tax')
    }

    return calculateProductTax({
      taxableAmount: params.taxableAmount,
      gstRate,
      cessRate: cessRate ?? 0,
      transactionType: params.transactionType,
    })
  },
}

