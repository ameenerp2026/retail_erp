import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import {
  MOCK_DASHBOARD_KPIS,
  MOCK_PLATFORM_ACTIVITY,
  MOCK_MODULE_USAGE,
  MOCK_AUDIT_LOGS,
  MOCK_PENDING_APPROVALS,
  MOCK_STORAGE_USAGE,
  MOCK_QUICK_ACTIONS,
} from '@/mocks/dashboard.mock'
import type {
  DashboardKpi,
  PlatformActivityPoint,
  ModuleUsageSlice,
  AuditLogItem,
  PendingApproval,
  StorageUsageItem,
  QuickAction,
} from '@/types/dashboard'

const API_BASE = '/api/dashboard'

export const dashboardService = {
  getKpis: () =>
    fromMockOrApi(MOCK_DASHBOARD_KPIS, () =>
      apiClient.get<DashboardKpi[]>(`${API_BASE}/kpis`).then((res) => res.data)
    ),

  getPlatformActivity: () =>
    fromMockOrApi(MOCK_PLATFORM_ACTIVITY, () =>
      apiClient.get<PlatformActivityPoint[]>(`${API_BASE}/platform-activity`).then((res) => res.data)
    ),

  getModuleUsage: () =>
    fromMockOrApi(MOCK_MODULE_USAGE, () =>
      apiClient.get<ModuleUsageSlice[]>(`${API_BASE}/module-usage`).then((res) => res.data)
    ),

  getAuditLogs: () =>
    fromMockOrApi(MOCK_AUDIT_LOGS, () =>
      apiClient.get<AuditLogItem[]>(`${API_BASE}/audit-logs`).then((res) => res.data)
    ),

  getPendingApprovals: () =>
    fromMockOrApi(MOCK_PENDING_APPROVALS, () =>
      apiClient.get<PendingApproval[]>(`${API_BASE}/pending-approvals`).then((res) => res.data)
    ),

  getStorageUsage: () =>
    fromMockOrApi(MOCK_STORAGE_USAGE, () =>
      apiClient.get<StorageUsageItem[]>(`${API_BASE}/storage`).then((res) => res.data)
    ),

  getQuickActions: () =>
    fromMockOrApi(MOCK_QUICK_ACTIONS, () =>
      apiClient.get<QuickAction[]>(`${API_BASE}/quick-actions`).then((res) => res.data)
    ),
}
