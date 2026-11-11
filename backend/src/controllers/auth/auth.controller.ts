import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { createAuditLog } from "../../services/admin/userLogs.service.js";

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


const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not set');
}
 const JWT_SECRET = secret;
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
       { expiresIn: '1d' }
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


const logAuthAction = async(
  req: AuthRequest,
  action:string,
  description:string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {
  try{
    await createAuditLog({
      level,
      action,
      module:'Auth',
      userId:req.user?.id ?? null,
      userName : req.user?.email ?? null,
      description,
      ipAddress:req.ip
    })
  }
  catch (error) {
    console.error("Failed to login", error);
     
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      await logAuthAction(
        req,
        "LOGIN_FAILED",
        `Failed login attempt for email: ${email}`,
         "ERROR"
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      await logAuthAction(
        req,
        "LOGIN_FAILED",
        'Invalid password',
          "ERROR"
      );
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Retrieve permissions assigned through the user's roles
//     console.log("Prisma userRole model:", prisma.userRole);
// console.log(
//   "Prisma client location:",
//   require.resolve("@prisma/client")
// );
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: {
                  select: { code: true },
                },
              },
            },
          },
        },
      },
    });

    const permissions = [
      ...new Set(
        userRoles.flatMap((userRole) =>
          userRole.role.rolePermissions.map(
            (rolePermission) =>
              rolePermission.permission.code
          )
        )
      ),
    ];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");
      await logAuthAction(
        req,
        "LOGIN_FAILED",
        "Server authentication configuration error",
          "ERROR" 
      );
      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        mail: user.email,
      },
      secret,
      { expiresIn: "1d" }
    );
 await logAuthAction(
      req,
      "LOGIN_SUCCESS",
      `User logged in successfully: ${user.email}`,
      "SUCCESS"
    );
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};
