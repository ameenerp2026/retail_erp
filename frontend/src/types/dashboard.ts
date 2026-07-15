export type DashboardKpi = {
  id: string
  title: string
  value: string
  change: number
  description: string
  iconKey: 'users' | 'hotel' | 'shield' | 'alert'
  badgeColor: string
  iconColor: string
}

export type PlatformActivityPoint = { month: string; value: number }

export type ModuleUsageSlice = { name: string; value: number; color: string }

export type AuditLogItem = {
  user: string
  module: string
  action: string
  time: string
  color: string
}

export type PendingApproval = {
  id: string
  title: string
  requestedBy: string
  priority: string
  priorityClass: string
}

export type StorageUsageItem = {
  label: string
  value: number
  color: string
}

export type QuickAction = {
  label: string
  icon: string
  bg: string
}
