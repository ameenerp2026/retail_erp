import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('BusinessLocation API', () => {
  it('creates a business location and returns 201', async () => {
    const orgUnit = await prisma.organizationUnit.create({ data: { name: 'Test Org' } });
    const gstin = await prisma.gSTIN.create({ data: { number: '29ABCDE1234F1Z5' } });

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