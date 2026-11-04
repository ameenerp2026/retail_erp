import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL?.includes('retail_erp_test')) {
  throw new Error('Refusing to seed: DATABASE_URL is not the test database')
}

const prisma = new PrismaClient()
const testPassword = 'TestPassword123!'

const permissions = [
  {
    code: 'UOM_VIEW',
    name: 'View UOM',
    module: 'Inventory',
    screen: 'UOM',
    description: 'View units of measure',
  },
  {
    code: 'UOM_CREATE',
    name: 'Create UOM',
    module: 'Inventory',
    screen: 'UOM',
    description: 'Create units of measure',
  },
  {
    code: 'UOM_EDIT',
    name: 'Edit UOM',
    module: 'Inventory',
    screen: 'UOM',
    description: 'Edit units of measure',
  },
]

async function seed() {
  const password = await bcrypt.hash(testPassword, 10)

  await prisma.$transaction(async (transaction) => {
    const organizationGroup = await transaction.organizationGroup.upsert({
      where: { id: 1 },
      update: {
        shortName: 'TEST',
        financialYear: '2026-2027',
        currency: 'INR',
        companyName: 'Retail ERP Test Organization',
        cinNumber: 'TESTCIN000000001',
        panNumber: 'TESTP0000T',
        email: 'test@example.com',
        phoneNumber: '0000000000',
        address: 'Test address',
        state: 'Test State',
        country: 'India',
        pinCode: '000000',
        status: 'ACTIVE',
      },
      create: {
        id: 1,
        shortName: 'TEST',
        financialYear: '2026-2027',
        currency: 'INR',
        companyName: 'Retail ERP Test Organization',
        cinNumber: 'TESTCIN000000001',
        panNumber: 'TESTP0000T',
        email: 'test@example.com',
        phoneNumber: '0000000000',
        address: 'Test address',
        state: 'Test State',
        country: 'India',
        pinCode: '000000',
        status: 'ACTIVE',
      },
    })

    const seededPermissions = []
    for (const permission of permissions) {
      seededPermissions.push(
        await transaction.permission.upsert({
          where: { code: permission.code },
          update: {
            name: permission.name,
            module: permission.module,
            screen: permission.screen,
            description: permission.description,
          },
          create: permission,
        }),
      )
    }

    const roleData = {
      name: 'UOM Test Role',
      description: 'Test access to units of measure',
      roleType: 'STANDARD' as const,
      scope: 'GROUP' as const,
      priority: 1,
      status: 'ACTIVE' as const,
      organizationGroupId: organizationGroup.id,
    }
    const role = await transaction.role.upsert({
      where: {
        organizationGroupId_name: {
          organizationGroupId: organizationGroup.id,
          name: roleData.name,
        },
      },
      update: {
        ...roleData,
        rolePermissions: {
          deleteMany: {},
          create: seededPermissions.map((permission) => ({
            permission: { connect: { id: permission.id } },
          })),
        },
      },
      create: {
        ...roleData,
        rolePermissions: {
          create: seededPermissions.map((permission) => ({
            permission: { connect: { id: permission.id } },
          })),
        },
      },
    })

    await transaction.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        name: 'Test User',
        password,
        organizationGroupId: organizationGroup.id,
        isActive: true,
        userRoles: {
          deleteMany: {},
          create: {
            role: { connect: { id: role.id } },
            organizationGroup: { connect: { id: organizationGroup.id } },
          },
        },
      },
      create: {
        name: 'Test User',
        email: 'test@example.com',
        password,
        organizationGroupId: organizationGroup.id,
        isActive: true,
        userRoles: {
          create: {
            role: { connect: { id: role.id } },
            organizationGroup: { connect: { id: organizationGroup.id } },
          },
        },
      },
    })
  })
}

try {
  await seed()
} finally {
  await prisma.$disconnect()
}
