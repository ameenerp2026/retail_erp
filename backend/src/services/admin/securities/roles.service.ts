
import prisma from '../../../config/prisma.js'

const roleInclude = {
  rolePermissions: {
    include: {
      permission: true,
    },
  },
  _count: {
    select: {
      userRoles: true,
      rolePermissions: true,
    },
  },
}

type CreateRoleInput = {
  name: string
  description?: string | null
  roleType: 'STANDARD' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'
  scope: 'GROUP' | 'UNIT'
  priority: number
  status?: 'ACTIVE' | 'INACTIVE'
  organizationGroupId: number
  permissionIds: number[]
}

type UpdateRoleInput = Partial<
  Omit<CreateRoleInput, 'organizationGroupId'>
> & {
  permissionIds?: number[]
}

async function validatePermissions(permissionIds: number[]) {
  const ids = [...new Set(permissionIds)]

  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error('INVALID_PERMISSION_IDS')
  }

  const permissions = await prisma.permission.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  })

  if (permissions.length !== ids.length) {
    throw new Error('PERMISSION_NOT_FOUND')
  }

  return ids
}

export const getRoles = async () => {
  return prisma.role.findMany({
    include: {
      _count: {
        select: {
          userRoles: true,
          rolePermissions: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getPermissions = async () => {
  return prisma.permission.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      module: true,
      screen: true,
      description: true,
    },
    orderBy: [{ module: 'asc' }, { name: 'asc' }],
  })
}

export const getRoleById = async (id: number) => {
  return prisma.role.findUnique({
    where: { id },
    include: roleInclude,
  })
}

export const createRole = async (input: CreateRoleInput) => {
  const name = input.name.trim()

  if (!name) throw new Error('ROLE_NAME_REQUIRED')

  const group = await prisma.organizationGroup.findUnique({
    where: { id: input.organizationGroupId },
    select: { id: true },
  })

  if (!group) throw new Error('ORGANIZATION_GROUP_NOT_FOUND')

  const permissionIds = await validatePermissions(input.permissionIds)

  return prisma.$transaction(async (tx) => {
    return tx.role.create({
      data: {
        name,
        description: input.description?.trim() || null,
        roleType: input.roleType,
        scope: input.scope,
        priority: input.priority,
        status: input.status ?? 'ACTIVE',
        organizationGroupId: input.organizationGroupId,
        rolePermissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      },
      include: roleInclude,
    })
  })
}

export const updateRole = async (
  id: number,
  input: UpdateRoleInput,
) => {
  const existing = await prisma.role.findUnique({
    where: { id },
  })

  if (!existing) throw new Error('ROLE_NOT_FOUND')

  if (existing.roleType === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN_MODIFICATION_NOT_ALLOWED')
  }

  if (input.name !== undefined && !input.name.trim()) {
    throw new Error('ROLE_NAME_REQUIRED')
  }

  const permissionIds =
    input.permissionIds === undefined
      ? undefined
      : await validatePermissions(input.permissionIds)

  return prisma.$transaction(async (tx) => {
    if (permissionIds !== undefined) {
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      })
    }

    return tx.role.update({
      where: { id },
      data: {
        ...(input.name !== undefined && {
          name: input.name.trim(),
        }),
        ...(input.description !== undefined && {
          description: input.description?.trim() || null,
        }),
        ...(input.roleType !== undefined && {
          roleType: input.roleType,
        }),
        ...(input.scope !== undefined && {
          scope: input.scope,
        }),
        ...(input.priority !== undefined && {
          priority: input.priority,
        }),
        ...(input.status !== undefined && {
          status: input.status,
        }),
        ...(permissionIds !== undefined && {
          rolePermissions: {
            create: permissionIds.map((permissionId) => ({
              permission: { connect: { id: permissionId } },
            })),
          },
        }),
      },
      include: roleInclude,
    })
  })
}

export const deleteRole = async (id: number) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      _count: { select: { userRoles: true } },
    },
  })

  if (!role) throw new Error('ROLE_NOT_FOUND')

  if (role.roleType === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN_DELETION_NOT_ALLOWED')
  }

  if (role._count.userRoles > 0) {
    throw new Error('ROLE_ASSIGNED_TO_USERS')
  }

  await prisma.role.delete({ where: { id } })
}

export const cloneRole = async (id: number, requestedName?: string) => {
  const source = await prisma.role.findUnique({
    where: { id },
    include: { rolePermissions: true },
  })

  if (!source) throw new Error('ROLE_NOT_FOUND')

  const name = requestedName?.trim() || `${source.name} Copy`

  if (!name) throw new Error('ROLE_NAME_REQUIRED')

  return prisma.$transaction(async (tx) => {
    return tx.role.create({
      data: {
        name,
        description: source.description,
        roleType: source.roleType,
        scope: source.scope,
        priority: source.priority,
        status: 'ACTIVE',
        organizationGroupId: source.organizationGroupId,
        rolePermissions: {
          create: source.rolePermissions.map((item) => ({
            permission: {
              connect: { id: item.permissionId },
            },
          })),
        },
      },
      include: roleInclude,
    })
  })
}
