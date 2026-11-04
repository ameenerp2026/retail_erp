import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uomPermissions = [
  { code: 'UOM_VIEW', name: 'View UOM',  module: "Inventory",screen: "UOM",description: 'View units of measure' },
  { code: 'UOM_CREATE', name: 'Create UOM', module: "Inventory", screen: "UOM", description: 'Create units of measure' },
  { code: 'UOM_EDIT', name: 'Edit UOM', module: "Inventory", screen: "UOM", description: 'Edit and activate or deactivate UOM' },
]

   
for (const p of uomPermissions) {
  await prisma.permission.upsert({
    where: { code: p.code },
    update: {},
    create: { ...p, module: 'Inventory', screen: 'UOM' },
  })
}