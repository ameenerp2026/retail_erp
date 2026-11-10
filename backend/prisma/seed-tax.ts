import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_TAX_ITEMS = [
  {
    taxId: 'TAX-001',
    productCode: 'ELE-SAM-A54',
    productName: 'Samsung Galaxy A54 5G',
    hsnSac: '8517 12 90',
    hsnLookupCode: '8517',
    taxGroup: 'Standard',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
  {
    taxId: 'TAX-002',
    productCode: 'APP-NIK-AM270',
    productName: 'Nike Air Max 270',
    hsnSac: '6402 99 00',
    hsnLookupCode: '6402',
    fallbackGstRate: 18,
    taxGroup: 'Standard',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
  {
    taxId: 'TAX-003',
    productCode: 'FMCG-DOV-BW500',
    productName: 'Dove Body Wash 500ml',
    hsnSac: '3305 90 00',
    hsnLookupCode: '3401',
    taxGroup: 'Standard',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
  {
    taxId: 'TAX-004',
    productCode: 'HRD-BSH-DR600',
    productName: 'Bosch Drill Machine 600W',
    hsnSac: '8467 11 00',
    hsnLookupCode: '8471',
    taxGroup: 'Standard',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
  {
    taxId: 'TAX-005',
    productCode: 'FMCG-ITC-AASH500',
    productName: 'Aashirvaad Atta 5Kg',
    hsnSac: '1101 00 20',
    hsnLookupCode: '1101',
    taxGroup: 'Essential',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: true,
  },
  {
    taxId: 'TAX-006',
    productCode: 'PHR-CIP-AZTH500',
    productName: 'Azithromycin 500mg Strip',
    hsnSac: '3004 90 99',
    hsnLookupCode: '3004',
    taxGroup: 'Pharma',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
  {
    taxId: 'TAX-007',
    productCode: 'ELE-APL-IPH15',
    productName: 'Apple iPhone 15 128GB',
    hsnSac: '8517 12 10',
    hsnLookupCode: '8517',
    taxGroup: 'Standard',
    cess: 0,
    effectiveDate: new Date('2026-04-01T00:00:00.000Z'),
    isDefault: false,
  },
]

async function main() {
  const hsnCodes = await prisma.hsnCode.findMany({
    select: { code: true, gstRate: true },
  })
  const hsnRateMap = new Map(
    hsnCodes.map((h) => [h.code, h.gstRate !== null ? Number(h.gstRate) : null]),
  )

  for (const item of SEED_TAX_ITEMS) {
    const dbGstRate = hsnRateMap.get(item.hsnLookupCode) ?? item.fallbackGstRate ?? 18

    await prisma.taxConfig.upsert({
      where: { taxId: item.taxId },
      update: {},
      create: {
        taxId: item.taxId,
        productCode: item.productCode,
        productName: item.productName,
        hsnSac: item.hsnSac,
        taxGroup: item.taxGroup,
        gstRate: new Prisma.Decimal(dbGstRate.toFixed(2)),
        cess: new Prisma.Decimal(item.cess.toFixed(2)),
        effectiveDate: item.effectiveDate,
        isDefault: item.isDefault,
      },
    })
  }

  console.log(`Seeded ${SEED_TAX_ITEMS.length} tax configurations.`)
}

main()
  .catch((e) => {
    console.error('Tax seed failed:', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

