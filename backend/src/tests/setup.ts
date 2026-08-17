// tests/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.businessLocation.deleteMany();
  await prisma.gSTIN.deleteMany();
  await prisma.organizationUnit.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});