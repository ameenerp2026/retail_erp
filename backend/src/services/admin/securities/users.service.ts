
import prisma from '../../../config/prisma.js'
import bcrypt from 'bcrypt'

const LOGIN_ACTION = 'LOGIN_SUCCESS'

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status })

export const usersService = {
 
  async list(search?: string) {
    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              {
                userRoles: {
                  some: { role: { name: { contains: search, mode: 'insensitive' } } },
                },
              },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true, // password is NOT selected
        userRoles: {
          select: {
            role: { select: { id: true, name: true } },
            organizationUnit: { select: { id: true, organizationUnit: true } },
          },
        },
      },
      orderBy: { id: 'asc' },
    })

    // lastLogin for ALL users in ONE query
    const logins = await prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        userId: { in: users.map((u) => u.id) },
        action: LOGIN_ACTION,
      },
      _max: { createdAt: true },
    })

    const lastLoginByUser = new Map<number, Date | null>()
    for (const l of logins) {
      if (l.userId !== null) lastLoginByUser.set(l.userId, l._max.createdAt)
    }

    return users.map((u) => ({
      id: u.id,
      code: `USR-${String(u.id).padStart(3, '0')}`,
      name: u.name,
      email: u.email,
      role: u.userRoles[0]?.role ?? null,
        orgUnit: u.userRoles[0]?.organizationUnit
        ? {
            id: u.userRoles[0].organizationUnit.id,
            name: u.userRoles[0].organizationUnit.organizationUnit,
          }
        : null,
      onboarded: true, // TODO: derive once the team decides
      lastLogin: lastLoginByUser.get(u.id) ?? null,
      isActive: u.isActive,
    }))
  },

  async counts() {
    const [total, active] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
    ])
    return { total, active }
  },

  // ---------- CREATE (Add User) ----------
  async create(
    input: {
      name: string
      email: string
      password: string
      roleId: number
      organizationUnitId?: number | null
      reportingManagerId?: number | null
    },
    actingUserId: number,
  ) {
    const role = await prisma.role.findUnique({
      where: { id: input.roleId },
      select: { id: true, status: true, organizationGroupId: true },
    })
    if (!role || role.status !== 'ACTIVE') throw httpError(400, 'Invalid or inactive role')

    if (input.organizationUnitId) {
      const unit = await prisma.organizationUnit.findUnique({
        where: { id: input.organizationUnitId },
        select: { organizationGroupId: true },
      })
      if (!unit) throw httpError(400, 'Invalid org unit')
      if (unit.organizationGroupId !== role.organizationGroupId) {
        throw httpError(400, 'Org unit and role belong to different groups')
      }
    }

    if (input.reportingManagerId) {
      const manager = await prisma.user.findUnique({
        where: { id: input.reportingManagerId },
        select: { isActive: true },
      })
      if (!manager || !manager.isActive) throw httpError(400, 'Invalid reporting manager')
    }

    const hashed = await bcrypt.hash(input.password, 10)

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashed,
          reportingManagerId: input.reportingManagerId ?? null,
        },
        select: { id: true, name: true, email: true },
      })

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
          organizationGroupId: role.organizationGroupId,
          organizationUnitId: input.organizationUnitId ?? null,
          assignedById: actingUserId,
        },
      })

      await tx.auditLog.create({
        data: {
          action: 'USER_CREATED',
          module: 'Securities',
          userId: actingUserId,
          description: `Created user ${user.name} (id ${user.id})`,
        },
      })

      return user
    })
  },

  // ---------- ACTIVATE / DEACTIVATE ----------
  async setActive(targetId: number, isActive: boolean, actingUserId: number) {
    if (!isActive && targetId === actingUserId) {
      throw httpError(400, 'You cannot deactivate your own account')
    }

    const target = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        name: true,
        isActive: true,
        userRoles: { select: { role: { select: { roleType: true } } } },
      },
    })
    if (!target) throw httpError(404, 'User not found')
   if (target.isActive === isActive) return { id: target.id, isActive: target.isActive } 

    const isSuperAdmin = target.userRoles.some((ur) => ur.role.roleType === 'SUPER_ADMIN')

    if (!isActive && isSuperAdmin) {
      const otherActiveSuperAdmins = await prisma.user.count({
        where: {
          id: { not: targetId },
          isActive: true,
          userRoles: { some: { role: { roleType: 'SUPER_ADMIN' } } },
        },
      })
      if (otherActiveSuperAdmins === 0) {
        throw httpError(409, 'Cannot deactivate the last active Super Admin')
      }
    }

    const [updated] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetId },
        data: { isActive },
        select: { id: true, isActive: true },
      }),
      prisma.auditLog.create({
        data: {
          action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
          module: 'Securities',
          userId: actingUserId,
          description: `${isActive ? 'Activated' : 'Deactivated'} user ${target.name} (id ${targetId})`,
        },
      }),
    ])

    return updated
  },


  // ---------- GET ONE (fills the Edit modal) ----------
  async getById(id: number) {
    const u = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        reportingManager: { select: { id: true, name: true } },
        userRoles: {
          select: {
            role: { select: { id: true, name: true } },
            organizationUnit: { select: { id: true, organizationUnit: true } },
          },
        },
      },
    })
    if (!u) throw httpError(404, 'User not found')

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      role: u.userRoles[0]?.role ?? null,
      orgUnit: u.userRoles[0]?.organizationUnit
        ? {
            id: u.userRoles[0].organizationUnit.id,
            name: u.userRoles[0].organizationUnit.organizationUnit,
          }
        : null,
      reportingManager: u.reportingManager,
    }
  },

  // ---------- EDIT ----------
  async update(
    targetId: number,
    input: {
      name: string
      email: string
      roleId: number
      organizationUnitId?: number | null
      reportingManagerId?: number | null
    },
    actingUserId: number,
  ) {
    const target = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        isActive: true,
        userRoles: { select: { role: { select: { roleType: true } } } },
      },
    })
    if (!target) throw httpError(404, 'User not found')

    // role must exist and be ACTIVE
    const role = await prisma.role.findUnique({
      where: { id: input.roleId },
      select: { id: true, status: true, roleType: true, organizationGroupId: true },
    })
    if (!role || role.status !== 'ACTIVE') throw httpError(400, 'Invalid or inactive role')


    if (input.organizationUnitId) {
     const unit = await prisma.organizationUnit.findUnique({
  where: { id: input.organizationUnitId },
  select: { id: true, organizationGroupId: true },
})
if (!unit) throw httpError(400, 'Invalid org unit')
if (unit.organizationGroupId !== role.organizationGroupId) {
  throw httpError(400, 'Org unit and role belong to different groups')
}
    }

    // reporting manager rules (if given)
    if (input.reportingManagerId) {
      if (input.reportingManagerId === targetId) {
        throw httpError(400, 'A user cannot report to themselves')
      }
      // walk up the chain: if we meet the target, it would be a loop
      let currentId: number | null = input.reportingManagerId
      while (currentId !== null) {
        if (currentId === targetId) throw httpError(400, 'Reporting manager would create a loop')
        const next: { reportingManagerId: number | null } | null =
          await prisma.user.findUnique({
            where: { id: currentId },
            select: { reportingManagerId: true },
          })
        if (!next && currentId === input.reportingManagerId) {
          throw httpError(400, 'Invalid reporting manager')
        }
        currentId = next?.reportingManagerId ?? null
      }
    }

    // do not demote the last active Super Admin
    const wasSuperAdmin = target.userRoles.some((ur) => ur.role.roleType === 'SUPER_ADMIN')
    if (wasSuperAdmin && target.isActive && role.roleType !== 'SUPER_ADMIN') {
      const others = await prisma.user.count({
        where: {
          id: { not: targetId },
          isActive: true,
          userRoles: { some: { role: { roleType: 'SUPER_ADMIN' } } },
        },
      })
      if (others === 0) throw httpError(409, 'Cannot change the role of the last active Super Admin')
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: targetId },
        data: {
          name: input.name,
          email: input.email,
          reportingManagerId: input.reportingManagerId ?? null,
        },
        select: { id: true, name: true, email: true },
      })

      // one role per user: replace the row
      await tx.userRole.deleteMany({ where: { userId: targetId } })
      await tx.userRole.create({
        data: {
          userId: targetId,
          roleId: role.id,
          organizationGroupId: role.organizationGroupId,
          organizationUnitId: input.organizationUnitId ?? null,
          assignedById: actingUserId,
        },
      })

      await tx.auditLog.create({
        data: {
          action: 'USER_UPDATED',
          module: 'Securities',
          userId: actingUserId,
          description: `Updated user ${updated.name} (id ${targetId})`,
        },
      })

      return updated
    })
  },
}

  