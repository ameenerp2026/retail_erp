import type {
  AppUser,
  PermissionGroup,
  Role,
  UserAuditLog,
} from '@/types/securities'
import {
  MOCK_PERMISSION_GROUPS,
  MOCK_ROLES,
  MOCK_USERS,
  MOCK_USER_LOGS,
} from '@/mocks/securities.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/securities'

export const securitiesService = {
  getRoles: () =>
    fromMockOrApi(MOCK_ROLES, () =>
      apiClient.get<Role[]>(`${API_BASE}/roles`).then((res) => res.data)
    ),

  getUsers: () =>
    fromMockOrApi(MOCK_USERS, () =>
      apiClient.get<AppUser[]>(`${API_BASE}/users`).then((res) => res.data)
    ),

  getUserLogs: () =>
    fromMockOrApi(MOCK_USER_LOGS, () =>
      apiClient.get<UserAuditLog[]>(`${API_BASE}/user-logs`).then((res) => res.data)
    ),

  getPermissionGroups: () =>
    fromMockOrApi(MOCK_PERMISSION_GROUPS, () =>
      apiClient
        .get<PermissionGroup[]>(`${API_BASE}/permissions`)
        .then((res) => res.data)
    ),
}
