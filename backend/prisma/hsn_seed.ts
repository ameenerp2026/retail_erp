import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A small, varied set of real HSN/SAC codes for testing the E-Invoice form.
// GST rates here are illustrative — double-check against the current
// official rate schedule before relying on them for anything beyond testing.
const HSN_CODES: { code: string; description: string; gstRate: number }[] = [
  { code: '1006', description: 'Rice', gstRate: 5 },
  { code: '1101', description: 'Wheat or meslin flour', gstRate: 5 },
  { code: '1905', description: 'Bread, pastry, cakes, biscuits', gstRate: 5 },
  { code: '2106', description: 'Food preparations, not elsewhere specified', gstRate: 18 },
  { code: '2523', description: 'Cement', gstRate: 28 },
  { code: '3004', description: 'Medicaments (pharmaceutical products)', gstRate: 12 },
  { code: '3401', description: 'Soap, organic surface-active products', gstRate: 18 },
  { code: '3926', description: 'Other articles of plastics', gstRate: 18 },
  { code: '4820', description: 'Registers, notebooks, exercise books', gstRate: 12 },
  { code: '4901', description: 'Printed books', gstRate: 0 },
  { code: '6109', description: 'T-shirts, singlets, knitted or crocheted', gstRate: 5 },
  { code: '6203', description: "Men's suits, jackets, trousers", gstRate: 12 },
  { code: '7113', description: 'Articles of jewellery', gstRate: 3 },
  { code: '8471', description: 'Automatic data processing machines (computers)', gstRate: 18 },
  { code: '8517', description: 'Telephone sets, smartphones', gstRate: 18 },
  { code: '8528', description: 'Monitors and television receivers', gstRate: 18 },
  { code: '8544', description: 'Insulated wire, cable, optical fibre cables', gstRate: 18 },
  { code: '8703', description: 'Motor cars and vehicles for transport of persons', gstRate: 28 },
  { code: '9403', description: 'Furniture and parts thereof', gstRate: 18 },
  { code: '9503', description: 'Toys, scale models', gstRate: 12 },
  { code: '9983', description: 'Other professional, technical, business services (SAC)', gstRate: 18 },
  { code: '9985', description: 'Support services (SAC)', gstRate: 18 },
]

async function main() {
  console.log(`Seeding ${HSN_CODES.length} HSN codes...`)

  for (const hsn of HSN_CODES) {
    await prisma.hsnCode.upsert({
      where: { code: hsn.code },
      create: hsn,
      update: { description: hsn.description, gstRate: hsn.gstRate },
    })
  }

  console.log('Done.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })