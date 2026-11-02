import request from 'supertest'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import app from '../../../src/app.js'
import prisma from '../../../src/config/prisma.js'

const base = '/api/productSetup/uom'
let token: string

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'TestPassword123!' })
  token = res.body.token // check your real response shape
})

beforeEach(async () => { await prisma.uom.deleteMany() })
afterAll(async () => { await prisma.$disconnect() })
beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'TestPassword123!' })
  token = res.body.token
  if (!token) throw new Error(`Login failed (${res.status}): run tests/seed.ts first`)
})

describe('GET /uom', () => {
  it('returns 401 without a token', async () => {
     const res = await request(app).get(base)
    expect(res.status).toBe(401)
  })
  it('returns 200 with valid token', async()=>{
    const res = await request(app)
    .get(base)
    .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
    it('filters by status', async () => {
    await prisma.uom.createMany({
      data: [
        { code: 'PCS', name: 'Pieces', status: 'ACTIVE', createdById: 1 },
        { code: 'BOX', name: 'Box', status: 'INACTIVE', createdById: 1 },
      ],
    })
    const res = await request(app)
      .get(base)
      .query({ status: 'INACTIVE' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].code).toBe('BOX')
})
  // cases 2 to 5: you write them
})

describe('POST /uom', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post(base)
      .send({ code: 'PCS', name: 'Pieces' })
    expect(res.status).toBe(401)
  })

  it('returns 400 when the code has a digit', async () => {
    const res = await request(app)
      .post(base)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'P1S', name: 'Pieces' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when the name is only spaces', async () => {
    const res = await request(app)
      .post(base)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'PCS', name: '   ' })
    expect(res.status).toBe(400)
  })

  it('returns 201 and uppercases the code', async () => {
    const res = await request(app)
      .post(base)
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'pcs', name: 'Pieces' })
    expect(res.status).toBe(201)
    expect(res.body.data.code).toBe('PCS')
  })

  it('returns 409 for a duplicate code', async () => {
    const body = { code: 'PCS', name: 'Pieces' }
    await request(app).post(base).set('Authorization', `Bearer ${token}`).send(body)
    const res = await request(app).post(base).set('Authorization', `Bearer ${token}`).send(body)
    expect(res.status).toBe(409)
  })
})

describe('PATCH /uom/:id/status', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .patch(`${base}/1/status`)
      .send({ status: 'INACTIVE' })
    expect(res.status).toBe(401)
  })

  it('returns 200 and changes the status', async () => {
    const uom = await prisma.uom.create({
      data: { code: 'PCS', name: 'Pieces', status: 'ACTIVE', createdById: 1 },
    })
    const res = await request(app)
      .patch(`${base}/${uom.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'INACTIVE' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('INACTIVE')
  })

  it('returns 400 for a lowercase status', async () => {
    const uom = await prisma.uom.create({
      data: { code: 'PCS', name: 'Pieces', status: 'ACTIVE', createdById: 1 },
    })
    const res = await request(app)
      .patch(`${base}/${uom.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'active' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for an invalid id', async () => {
    const res = await request(app)
      .patch(`${base}/abc/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ACTIVE' })
    expect(res.status).toBe(400)
  })

  it('returns 404 when the UOM does not exist', async () => {
    const res = await request(app)
      .patch(`${base}/999999/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'ACTIVE' })
    expect(res.status).toBe(404)
  })
})