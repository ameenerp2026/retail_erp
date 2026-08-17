import {Request,Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {}
    const emailInput = typeof body.email === 'string'
      ? body.email
      : typeof body.username === 'string'
        ? body.username
        : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    const email = emailInput.trim().toLowerCase()

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ error: 'Email taken' })

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    })

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'erp-secret'
    )

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return res.status(500).json({ error: error?.message || 'Registration failed' })
  }
}
export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {}
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email!' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password!' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        mail: user.email
      },
      process.env.JWT_SECRET || 'erp-secret',
      { expiresIn: '1d' }
    )

    return res.json({
            message : ' Login Successful!',
            token,

            user:{
                id:user.id,
                email:user.email,
                  name: user.name,
    role: user.role
            },
        
        })
    
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' })
  }
}