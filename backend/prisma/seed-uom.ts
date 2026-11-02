import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const uoms = [
  { code: 'PCS', name: 'Pieces' },
  { code: 'BOX', name: 'Box' },
  { code: 'CTN', name: 'Carton' },
  { code: 'KG', name: 'Kilogram' },
  { code: 'GM', name: 'Grams' },
  { code: 'MT', name: 'Metric Ton' },
  { code: 'LTR', name: 'Litre' },
  { code: 'ML', name: 'Millilitre' },
  { code: 'MTR', name: 'Metre' },
  { code: 'CM', name: 'Centimetre' },
  { code: 'BTL', name: 'Bottle' },
  { code: 'PKT', name: 'Packet' },
  { code: 'STR', name: 'Strip' },
  { code: 'DOZ', name: 'Dozen' },
  { code: 'PAIR', name: 'Pair' },
  { code: 'SET', name: 'Set' },
  { code: 'ROLL', name: 'Roll' },
  { code: 'BAG', name: 'Bag' },
  { code: 'CAN', name: 'Can' },
  { code: 'TUB', name: 'Tube' },
]

async function main() {
  const user = await prisma.user.findFirst({ orderBy: { id: 'asc' }, select: { id: true } })
  if (!user) throw new Error('No user found: create a user first')

  for (const u of uoms) {
    await prisma.uom.upsert({
      where: { code: u.code },
      update: {},
      create: { ...u, createdById: user.id },
    })
  }
  console.log(`Seeded ${uoms.length} UOMs (createdById = ${user.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())