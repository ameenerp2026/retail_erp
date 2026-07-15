export type RoleBadge = 'Super Admin' | 'Manager' | 'Standard'
export type RoleTone = 'red' | 'blue' | 'green' | 'orange' | 'sky' | 'purple'

export type Role = {
  id: string
  name: string
  description: string
  badge: RoleBadge
  tone: RoleTone
  userCount: number
  permissionCount: number
  locked?: boolean
  deletable: boolean
}

export type UserStatus = 'Active' | 'Inactive' | 'Pending'

export type AppUser = {
  id: string
  userId: string
  name: string
  email: string
  role: string
  roleTone: RoleTone
  orgUnit: string
  onboarded: boolean
  lastLogin: string | null
  status: UserStatus
  initials: string
  avatarColor: string
}

export type AuditSeverity = 'Info' | 'Warning' | 'Error' | 'Success'

export type UserAuditLog = {
  id: string
  action: string
  module: string
  severity: AuditSeverity
  summary: string
  timestamp: string
  ip: string
  details: Record<string, unknown>
}

export type PermissionItem = {
  id: string
  label: string
}

export type PermissionGroup = {
  id: string
  name: string
  permissions: PermissionItem[]
}

export type RolePriority = 'Standard' | 'Manager' | 'Admin' | 'Super Admin'
