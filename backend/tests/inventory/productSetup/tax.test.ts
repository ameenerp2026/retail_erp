import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { Prisma } from '@prisma/client'

// Mock Prisma before importing app so DB calls run deterministically against in-memory rows
const mockHsnRows = [
  { id: 1, code: '8517', description: 'Telephone sets, smartphones', gstRate: new Prisma.Decimal('18.00') },
  { id: 2, code: '1101', description: 'Wheat or meslin flour', gstRate: new Prisma.Decimal('5.00') },
  { id: 3, code: '3004', description: 'Medicaments', gstRate: new Prisma.Decimal('12.00') },
  { id: 4, code: '2523', description: 'Cement', gstRate: new Prisma.Decimal('28.00') },
  { id: 5, code: '4901', description: 'Printed books', gstRate: new Prisma.Decimal('0.00') },
]

interface MockTaxRow {
  id: number
  taxId: string
  productCode: string
  productName: string
  hsnSac: string | null
  taxGroup: string
  gstRate: Prisma.Decimal
  cess: Prisma.Decimal
  effectiveDate: Date
  isDefault: boolean
  createdById: number | null
  updatedById: number | null
  createdAt: Date
  updatedAt: Date
}

let mockTaxStore: MockTaxRow[] = []

vi.mock('../../../src/config/prisma.js', () => {
  const taxConfigApi = {
    findMany: vi.fn(async (args?: { where?: unknown; select?: { taxId?: boolean } }) => {
      if (args?.select?.taxId) {
        return mockTaxStore.map((r) => ({ taxId: r.taxId }))
      }
      return [...mockTaxStore]
    }),
    findUnique: vi.fn(async ({ where }: { where: { id: number } }) => {
      return mockTaxStore.find((r) => r.id === where.id) ?? null
    }),
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      const nextId = mockTaxStore.reduce((m, r) => Math.max(m, r.id), 0) + 1
      const row: MockTaxRow = {
        id: nextId,
        taxId: String(data.taxId),
        productCode: String(data.productCode),
        productName: String(data.productName),
        hsnSac: (data.hsnSac as string | null) ?? null,
        taxGroup: String(data.taxGroup),
        gstRate: data.gstRate as Prisma.Decimal,
        cess: (data.cess as Prisma.Decimal) ?? new Prisma.Decimal('0.00'),
        effectiveDate: (data.effectiveDate as Date) ?? new Date('2026-04-01T00:00:00Z'),
        isDefault: Boolean(data.isDefault),
        createdById: (data.createdById as number | null) ?? null,
        updatedById: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockTaxStore.push(row)
      return row
    }),
    update: vi.fn(async ({ where, data }: { where: { id: number }; data: Record<string, unknown> }) => {
      const idx = mockTaxStore.findIndex((r) => r.id === where.id)
      if (idx === -1) throw new Error('Not found')
      mockTaxStore[idx] = {
        ...mockTaxStore[idx],
        ...data,
        updatedAt: new Date(),
      } as MockTaxRow
      return mockTaxStore[idx]
    }),
    delete: vi.fn(async ({ where }: { where: { id: number } }) => {
      const idx = mockTaxStore.findIndex((r) => r.id === where.id)
      const [removed] = mockTaxStore.splice(idx, 1)
      return removed
    }),
  }

  const hsnCodeApi = {
    findMany: vi.fn(async (args?: { where?: { code?: { in?: string[] } } }) => {
      const inList = args?.where?.code?.in
      if (inList) {
        return mockHsnRows.filter((h) => inList.includes(h.code))
      }
      return [...mockHsnRows]
    }),
  }

  const auditLogApi = {
    create: vi.fn(async () => ({ id: 1 })),
  }

  const prismaMock = {
    taxConfig: taxConfigApi,
    hsnCode: hsnCodeApi,
    auditLog: auditLogApi,
    $transaction: vi.fn(async (cb: (tx: unknown) => Promise<unknown>) =>
      cb({ taxConfig: taxConfigApi, hsnCode: hsnCodeApi }),
    ),
  }

  return { default: prismaMock }
})

import app from '../../../src/app.js'
import prisma from '../../../src/config/prisma.js'
import {
  calculateProductTax,
  deriveGstComponents,
  validatePercentageRate,
} from '../../../src/utils/inventory/gstCalculations.js'

const TAX_BASE = '/api/productSetup/tax'

describe('GST Calculation Utilities', () => {
  it('derives CGST = GST / 2, SGST = GST / 2, IGST = GST for standard slabs', () => {
    expect(deriveGstComponents(5)).toEqual({ gstRate: 5, cgst: 2.5, sgst: 2.5, igst: 5 })
    expect(deriveGstComponents(12)).toEqual({ gstRate: 12, cgst: 6, sgst: 6, igst: 12 })
    expect(deriveGstComponents(18)).toEqual({ gstRate: 18, cgst: 9, sgst: 9, igst: 18 })
    expect(deriveGstComponents(28)).toEqual({ gstRate: 28, cgst: 14, sgst: 14, igst: 28 })
    expect(deriveGstComponents(0)).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
    expect(deriveGstComponents(18.5)).toEqual({ gstRate: 18.5, cgst: 9.25, sgst: 9.25, igst: 18.5 })
  })

  it('handles empty, null, undefined, and negative inputs safely without NaN', () => {
    expect(deriveGstComponents('')).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
    expect(deriveGstComponents(null)).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
    expect(deriveGstComponents(undefined)).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
    expect(deriveGstComponents(-5)).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
    expect(deriveGstComponents('abc')).toEqual({ gstRate: 0, cgst: 0, sgst: 0, igst: 0 })
  })

  it('validates percentage inputs (non-negative, max 2 decimal places, <= 100)', () => {
    expect(validatePercentageRate('', 'GST %', { required: true })).toEqual({
      valid: false,
      error: 'GST % is required',
    })
    expect(validatePercentageRate('-1', 'GST %', { required: true })).toEqual({
      valid: false,
      error: 'GST % cannot be negative',
    })
    expect(validatePercentageRate('-0.5', 'CESS %', { required: false })).toEqual({
      valid: false,
      error: 'CESS % cannot be negative',
    })
    expect(validatePercentageRate('18.123', 'GST %', { required: true })).toEqual({
      valid: false,
      error: 'GST % supports at most 2 decimal places',
    })
    expect(validatePercentageRate('105', 'GST %', { required: true })).toEqual({
      valid: false,
      error: 'GST % cannot exceed 100%',
    })
    expect(validatePercentageRate('5', 'GST %', { required: true })).toEqual({
      valid: true,
      value: 5,
    })
    expect(validatePercentageRate('12.50', 'GST %', { required: true })).toEqual({
      valid: true,
      value: 12.5,
    })
    expect(validatePercentageRate('', 'CESS %', { required: false, defaultValue: 0 })).toEqual({
      valid: true,
      value: 0,
    })
  })

  it('applies CGST + SGST for intra-state and IGST for inter-state, never both, plus CESS separately', () => {
    const intra = calculateProductTax({
      taxableAmount: 1000,
      gstRate: 18,
      cessRate: 2,
      transactionType: 'intra_state',
    })
    expect(intra).toEqual({
      taxableAmount: 1000,
      gstRate: 18,
      cessRate: 2,
      transactionType: 'intra_state',
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgstAmount: 90,
      sgstAmount: 90,
      igstAmount: 0,
      gstAmount: 180,
      cessAmount: 20,
      totalTaxAmount: 200,
      totalAmount: 1200,
    })

    const inter = calculateProductTax({
      taxableAmount: 1000,
      gstRate: 18,
      cessRate: 2,
      transactionType: 'inter_state',
    })
    expect(inter).toEqual({
      taxableAmount: 1000,
      gstRate: 18,
      cessRate: 2,
      transactionType: 'inter_state',
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 18,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 180,
      gstAmount: 180,
      cessAmount: 20,
      totalTaxAmount: 200,
      totalAmount: 1200,
    })
  })
})

describe('Product Setup Tax API Routes', () => {
  beforeEach(() => {
    mockTaxStore = [
      {
        id: 1,
        taxId: 'TAX-001',
        productCode: 'ELE-SAM-A54',
        productName: 'Samsung Galaxy A54 5G',
        hsnSac: '8517 12 90',
        taxGroup: 'Standard',
        gstRate: new Prisma.Decimal('18.00'),
        cess: new Prisma.Decimal('0.00'),
        effectiveDate: new Date('2026-04-01T00:00:00Z'),
        isDefault: false,
        createdById: 1,
        updatedById: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    vi.clearAllMocks()
  })

  it('fetches existing HSN codes and gstRate from the backend hsn_codes table', async () => {
    const res = await request(app).get(`${TAX_BASE}/hsn-codes`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(5)
    expect(res.body.data[0]).toMatchObject({ code: '8517', gstRate: 18 })
  })

  it('looks up HSN gstRate by prefix for full 8-digit HSN/SAC codes like 8517 12 90', async () => {
    const res = await request(app).get(`${TAX_BASE}/hsn-rate`).query({ code: '1101 00 20' })
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ code: '1101', gstRate: 5 })
  })

  it('lists tax configs and derives CGST, SGST, and IGST from gstRate', async () => {
    const res = await request(app).get(TAX_BASE)
    expect(res.status).toBe(200)
    expect(res.body.data[0]).toMatchObject({
      taxId: 'TAX-001',
      gstRate: 18,
      cgst: 9,
      sgst: 9,
      igst: 18,
      cess: 0,
    })
  })

  it('creates a tax configuration saving gstRate into DB without duplicate cgst/sgst/igst DB columns', async () => {
    const res = await request(app).post(TAX_BASE).send({
      productCode: 'FMCG-RICE-01',
      productName: 'Basmati Rice 5Kg',
      taxGroup: 'Essential',
      hsnSac: '1006',
      gstRate: 5,
      cess: 1.5,
      effectiveDate: '2026-04-01',
      isDefault: false,
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      taxId: 'TAX-002',
      gstRate: 5,
      cgst: 2.5,
      sgst: 2.5,
      igst: 5,
      cess: 1.5,
    })

    const createCall = vi.mocked(prisma.taxConfig.create).mock.calls[0][0]
    expect(createCall.data).not.toHaveProperty('cgst')
    expect(createCall.data).not.toHaveProperty('sgst')
    expect(createCall.data).not.toHaveProperty('igst')
    expect(Number(createCall.data.gstRate)).toBe(5)
    expect(Number(createCall.data.cess)).toBe(1.5)
  })

  it('auto-resolves gstRate from backend HSN table if gstRate is omitted during create', async () => {
    const res = await request(app).post(TAX_BASE).send({
      productCode: 'PHR-TAB-01',
      productName: 'Paracetamol 500mg',
      taxGroup: 'Pharma',
      hsnSac: '3004 90 99',
      cess: 0,
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      gstRate: 12,
      cgst: 6,
      sgst: 6,
      igst: 12,
      cess: 0,
    })
  })

  it('fetches saved gstRate by id for edit form and populates derived rates', async () => {
    const res = await request(app).get(`${TAX_BASE}/1`)
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      taxId: 'TAX-001',
      gstRate: 18,
      cgst: 9,
      sgst: 9,
      igst: 18,
    })
  })

  it('updates gstRate cleanly and keeps CESS independent from CGST/SGST/IGST', async () => {
    const res = await request(app).put(`${TAX_BASE}/1`).send({
      gstRate: 28,
      cess: 12,
    })

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      gstRate: 28,
      cgst: 14,
      sgst: 14,
      igst: 28,
      cess: 12,
    })
  })

  it('rejects negative GST, negative CESS, and >2 decimal places with 400', async () => {
    const negGst = await request(app).post(TAX_BASE).send({
      productCode: 'P1',
      productName: 'Item 1',
      taxGroup: 'Standard',
      gstRate: -5,
      cess: 0,
    })
    expect(negGst.status).toBe(400)

    const negCess = await request(app).post(TAX_BASE).send({
      productCode: 'P1',
      productName: 'Item 1',
      taxGroup: 'Standard',
      gstRate: 18,
      cess: -1,
    })
    expect(negCess.status).toBe(400)

    const tooManyDecimals = await request(app).post(TAX_BASE).send({
      productCode: 'P1',
      productName: 'Item 1',
      taxGroup: 'Standard',
      gstRate: '18.125',
      cess: 0,
    })
    expect(tooManyDecimals.status).toBe(400)
  })

  it('calculates product tax using saved gstRate via POST /calculate for intra_state and inter_state', async () => {
    const intra = await request(app).post(`${TAX_BASE}/calculate`).send({
      taxConfigId: 1,
      taxableAmount: 2000,
      cessRate: 5,
      transactionType: 'intra_state',
    })
    expect(intra.status).toBe(200)
    expect(intra.body.data).toMatchObject({
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgstAmount: 180,
      sgstAmount: 180,
      igstAmount: 0,
      cessAmount: 100,
      totalTaxAmount: 460,
      totalAmount: 2460,
    })

    const inter = await request(app).post(`${TAX_BASE}/calculate`).send({
      taxConfigId: 1,
      taxableAmount: 2000,
      cessRate: 5,
      transactionType: 'inter_state',
    })
    expect(inter.status).toBe(200)
    expect(inter.body.data).toMatchObject({
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 18,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 360,
      cessAmount: 100,
      totalTaxAmount: 460,
      totalAmount: 2460,
    })
  })
})

