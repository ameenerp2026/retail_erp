import type {
  DashboardKpi,
  PlatformActivityPoint,
  ModuleUsageSlice,
  AuditLogItem,
  PendingApproval,
  StorageUsageItem,
  QuickAction,
} from '@/types/dashboard'

export const MOCK_DASHBOARD_KPIS: DashboardKpi[] = [
  {
    id: 'active-users',
    title: 'Active Users',
    value: '48',
    change: 12,
    description: 'from last month',
    iconKey: 'users',
    badgeColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'org-units',
    title: 'Org Units',
    value: '34',
    change: 3,
    description: 'This Month',
    iconKey: 'hotel',
    badgeColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'active-roles',
    title: 'Active Roles',
    value: '22',
    change: -1,
    description: 'vs last month',
    iconKey: 'shield',
    badgeColor: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    id: 'pending',
    title: 'Pending',
    value: '7',
    change: 2,
    description: 'Needs Action',
    iconKey: 'alert',
    badgeColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 'failed-logins',
    title: 'Failed Logins',
    value: '156',
    change: 18,
    description: 'last 24 hours',
    iconKey: 'alert',
    badgeColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
]

export const MOCK_PLATFORM_ACTIVITY: PlatformActivityPoint[] = [
  { month: 'Nov', value: 2400 },
  { month: 'Dec', value: 2800 },
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 2900 },
  { month: 'Mar', value: 3600 },
  { month: 'Apr', value: 4100 },
  { month: 'May', value: 4800 },
]

export const MOCK_MODULE_USAGE: ModuleUsageSlice[] = [
  { name: 'Finance', value: 38, color: '#0F5CA8' },
  { name: 'Organization', value: 24, color: '#22B8B0' },
  { name: 'Securities', value: 20, color: '#4FC3F7' },
  { name: 'Utilities', value: 18, color: '#F59E0B' },
]

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  { user: 'Priya Sharma', module: 'Finance', action: 'Created Ledger', time: '2m ago', color: 'bg-teal-500' },
  { user: 'Raj Kumar', module: 'Organization', action: 'Updated Org Unit', time: '12m ago', color: 'bg-sky-400' },
  { user: 'Admin User', module: 'Securities', action: 'Role Permission Changed', time: '34m ago', color: 'bg-sky-400' },
  { user: 'Meena Joshi', module: 'Utilities', action: 'E-Invoice Generated', time: '1h ago', color: 'bg-teal-500' },
  { user: 'System', module: 'Auth', action: 'Failed Login Attempt (3x)', time: '1h ago', color: 'bg-red-500' },
  { user: 'Arun Patel', module: 'Utilities', action: 'Data Import Completed', time: '2h ago', color: 'bg-green-500' },
]

export const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'ORG-091',
    title: 'New Branch — Mumbai West',
    requestedBy: 'Raj Kumar',
    priority: 'High',
    priorityClass: 'bg-red-50 text-red-500',
  },
  {
    id: 'FIN-204',
    title: 'Ledger Opening Balance Update',
    requestedBy: 'Priya Sharma',
    priority: 'Medium',
    priorityClass: 'bg-orange-50 text-orange-500',
  },
  {
    id: 'SEC-047',
    title: 'Admin Role Assignment — Meena',
    requestedBy: 'Admin User',
    priority: 'High',
    priorityClass: 'bg-red-50 text-red-500',
  },
]

export const MOCK_STORAGE_USAGE: StorageUsageItem[] = [
  { label: 'Database', value: 68, color: 'bg-[#0F5CA8]' },
  { label: 'Documents', value: 42, color: 'bg-[#22B8B0]' },
  { label: 'Media', value: 85, color: 'bg-[#F59E0B]' },
]

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { label: 'Add Org Unit', icon: '🏢', bg: 'bg-slate-200' },
  { label: 'Create Ledger', icon: '📒', bg: 'bg-teal-50' },
  { label: 'Add User', icon: '👤', bg: 'bg-sky-50' },
  { label: 'Import Data', icon: '📥', bg: 'bg-orange-50' },
  { label: 'Gen E-Invoice', icon: '🧾', bg: 'bg-green-50' },
  { label: 'E-Way Bill', icon: '🚚', bg: 'bg-violet-50' },
  { label: 'Manage GSTIN', icon: '🧾', bg: 'bg-red-50' },
  { label: 'View Logs', icon: '📋', bg: 'bg-slate-100' },
]
