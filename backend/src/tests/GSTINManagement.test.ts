import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('BusinessLocation API', () => {
  it('creates a business location and returns 201', async () => {
    const orgGroup = await prisma.organizationGroup.create({
      data: {
        shortName: 'TestGrp',
        financialYear: '2026-2027',
        currency: 'INR',
        companyName: 'Test Company Pvt Ltd',
        cinNumber: 'U12345KA2026PTC000001',
        panNumber: 'ABCDE1234F',
        email: `org-${Date.now()}@example.com`,
        phoneNumber: '9999999999',
        address: '100 Test Avenue',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560001',
      },
    });

    const orgUnit = await prisma.organizationUnit.create({
      data: {
        organizationUnit: 'Test Org',
        unitType: 'BRANCH',
        gstIn: '29ABCDE1234F1Z5',
        manager: 'Test Manager',
        organizationGroupId: orgGroup.id,
        state: 'Karnataka',
        address: '123 Test Street',
      },
    });

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-user-${Date.now()}@example.com`,
        password: 'hashed-password-placeholder',
      },
    });

    const gstin = await prisma.gSTIN.create({
      data: {
        gstin: '29XYZDE1234F1Z9',
        state: 'Karnataka',
        registrationType: 'REGULAR',
        organizationUnitId: orgUnit.id,
        createdById: user.id,
      },
    });

    const res = await request(app)
      .post('/business-locations')
      .send({
        locationName: 'Bangalore HQ',
        parentOrganizationUnitId: orgUnit.id,
        locationType: 'WAREHOUSE',
        businessCategory: 'RETAIL',
        addressLine1: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560001',
        contactPerson: 'Rukiya Banu',
        linkedGSTINId: gstin.id,
        registrationType: 'REGULAR',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.locationName).toBe('Bangalore HQ');
    expect(res.body.status).toBe('ACTIVE');
  });
});