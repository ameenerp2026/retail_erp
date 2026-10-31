
import type { Request, Response } from 'express'
import * as roleService from '../../../services/admin/securities/roles.service.js'
import { createAuditLog } from '../../../services/admin/userLogs.service.js'
import { AuthRequest } from '../../../middleware/auth.middleware.js'

const logRoleAction = async (req: Request,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS"
): Promise<void> => {
  try {
    const user = (req as AuthRequest).user
    await createAuditLog({
      level,
      action,
      module: "Roles",
      userId: user?.id ?? null,
      userName: user?.email ?? null,
      description,
      ipAddress: req.ip,
    })
  } catch (error) {
    console.error("Failed to create Roles audit log", error)

  }
}

const parseId = (value: string | string[] | undefined): number | null => {
  if (typeof value !== 'string') return null

  const id = Number(value)

  return Number.isInteger(id) && id > 0 ? id : null
}
const handleError = (res: Response, error: unknown) => {
  const code = error instanceof Error ? error.message : ''

  const errors: Record<string, [number, string]> = {
    ROLE_NOT_FOUND: [404, 'Role not found'],
    ORGANIZATION_GROUP_NOT_FOUND: [400, 'Organization group not found'],
    PERMISSION_NOT_FOUND: [400, 'One or more permissions do not exist'],
    INVALID_PERMISSION_IDS: [400, 'Invalid permission IDs'],
    ROLE_NAME_REQUIRED: [400, 'Role name is required'],
    ROLE_ASSIGNED_TO_USERS: [
      409,
      'Reassign users before deleting this role',
    ],
    SUPER_ADMIN_DELETION_NOT_ALLOWED: [
      403,
      'Super Admin role cannot be deleted',
    ],
    SUPER_ADMIN_MODIFICATION_NOT_ALLOWED: [
      403,
      'Super Admin role cannot be modified',
    ],
  }

  const mapped = errors[code]

  if (mapped) {
    return res.status(mapped[0]).json({ message: mapped[1] })
  }

  // Prisma P2002 indicates a unique constraint violation.
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    return res.status(409).json({
      message: 'A role with this name already exists in this group',
    })
  }

  console.error('Role controller error:', error)
  return res.status(500).json({ message: 'An unexpected error occurred' })
}

export const getRolesHandler = async (_req: Request, res: Response) => {
  try {
    const roles = await roleService.getRoles()

    return res.status(200).json({
      message: 'Roles fetched successfully',
      data: roles.map((role) => ({
        ...role,
        userCount: role._count.userRoles,
        permissionCount: role._count.rolePermissions,
      })),
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const getRoleByIdHandler = async (
  req: Request,
  res: Response,
) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Invalid role ID' })

  try {
    const role = await roleService.getRoleById(id)

    if (!role) return res.status(404).json({ message: 'Role not found' })

    return res.status(200).json({
      message: 'Role fetched successfully',
      data: {
        ...role,
        permissionIds: role.rolePermissions.map((item) => item.permissionId),
      },
    })
  } catch (error) {
    return handleError(res, error)
  }
}

export const createRoleHandler = async (
  req: Request,
  res: Response,
) => {
  const {
    name,
    description,
    roleType,
    scope,
    priority,
    status,
    organizationGroupId,
    permissionIds,
  } = req.body

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    !Number.isInteger(organizationGroupId) ||
    !Array.isArray(permissionIds) ||
    !['STANDARD', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(roleType) ||
    !['GROUP', 'UNIT'].includes(scope) ||
    !Number.isInteger(priority) ||
    (status !== undefined && !['ACTIVE', 'INACTIVE'].includes(status))
  ) {
    return res.status(400).json({ message: 'Invalid role data' })
  }

  try {
    const role = await roleService.createRole({
      name,
      description,
      roleType,
      scope,
      priority,
      status,
      organizationGroupId,
      permissionIds,
    })


    await logRoleAction(
      req,
      "CREATED ROLE",
      `Role created: ${name}`,
      "SUCCESS"
    )
    return res.status(201).json({
      message: 'Role created successfully',
      data: role,
    })
  } catch (error) {
    await logRoleAction(
      req,
      "Role",
      `Failed to create role: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    )
    return handleError(res, error)
  }
}

export const updateRoleHandler = async (
  req: Request,
  res: Response,
) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Invalid role ID' })

  try {
    const role = await roleService.updateRole(id, req.body)

    await logRoleAction(
      req,
      "UPDATED ROLE",
      `Role updated: ID ${id}`,
      "SUCCESS"
    )

    return res.status(200).json({
      message: 'Role updated successfully',
      data: role,
    })
  } catch (error) {
    await logRoleAction(
      req,
      "Role",
      `Failed to update role ID ${id}: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    )
    return handleError(res, error)
  }
}

export const deleteRoleHandler = async (
  req: Request,
  res: Response,
) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Invalid role ID' })

  try {
    await roleService.deleteRole(id)
    await logRoleAction(
      req,
      "DELETED ROLE",
      `Role deleted: ID ${id}`,
      "SUCCESS"
    )
    return res.status(200).json({
      message: 'Role deleted successfully',
    })
  } catch (error) {

    await logRoleAction(
      req,
      "Role",
      `Failed to delete role ID ${id}: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    )
    return handleError(res, error)
  }
}

export const cloneRoleHandler = async (
  req: Request,
  res: Response,
) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ message: 'Invalid role ID' })

  if (req.body.name !== undefined && typeof req.body.name !== 'string') {
    return res.status(400).json({ message: 'Role name must be a string' })
  }

  try {
    const role = await roleService.cloneRole(id, req.body.name)
    await logRoleAction(
      req,
      "CLONED ROLE",
      `Role cloned from ID ${id}`,
      "SUCCESS"
    )
    return res.status(201).json({
      message: 'Role cloned successfully',
      data: role,
    })
  } catch (error) {
    await logRoleAction(
      req,
      "Role",
      `Failed to clone role from ID ${id}: ${error instanceof Error ? error.message : "Unknown error"
      }`,
      "ERROR"
    )
    return handleError(res, error)
  }
}