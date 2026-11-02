import apiClient from '@/services/apiClient'
import type { SecurityRole } from '@/services/admin/securities/role.service'

export interface SecurityOrganizationUnit {
  id: number
  organizationUnit: string
  organizationGroupId: number
  organizationGroup: {
    id: number
    shortName: string
  }
}

export interface SecurityUserListItem {
  id: number
  code: string
  name: string
  email: string
  role: Pick<SecurityRole, 'id' | 'name'> | null
  orgUnit: { id: number; name: string } | null
  onboarded: boolean
  lastLogin: string | null
  isActive: boolean
}

export interface SecurityUserDetails {
  id: number
  name: string
  email: string
  isActive: boolean
  role: Pick<SecurityRole, 'id' | 'name'> | null
  orgUnit: { id: number; name: string } | null
  reportingManager: { id: number; name: string } | null
}

export interface UserMutationResult {
  id: number
  name: string
  email: string
}

export interface UserListResponse {
  data: SecurityUserListItem[]
  counts: { total: number; active: number }
}

export interface UserPayload {
  name: string
  email: string
  roleId: number
  organizationUnitId: number | null
  reportingManagerId: number | null
  password?: string
}

interface ApiResponse<T> {
  data: T
}

const USERS_URL = '/api/securities/users'

export async function getUsers(): Promise<UserListResponse> {
  const response = await apiClient.get<UserListResponse>(USERS_URL)
  return response.data
}

export async function getUserById(id: number): Promise<SecurityUserDetails> {
  const response = await apiClient.get<ApiResponse<SecurityUserDetails>>(
    `${USERS_URL}/${id}`,
  )
  return response.data.data
}

export async function getUserRoles(): Promise<SecurityRole[]> {
  const response = await apiClient.get<ApiResponse<SecurityRole[]>>('/api/securities')
  return response.data.data
}

export async function getUserOrganizationUnits(): Promise<SecurityOrganizationUnit[]> {
  const response = await apiClient.get<ApiResponse<SecurityOrganizationUnit[]>>(
    '/api/organizationUnit/org-unit',
  )
  return response.data.data
}

export async function createUser(payload: UserPayload): Promise<UserMutationResult> {
  const response = await apiClient.post<ApiResponse<UserMutationResult>>(
    USERS_URL,
    payload,
  )
  return response.data.data
}

export async function updateUser(
  id: number,
  payload: Omit<UserPayload, 'password'>,
): Promise<UserMutationResult> {
  const response = await apiClient.put<ApiResponse<UserMutationResult>>(
    `${USERS_URL}/${id}`,
    payload,
  )
  return response.data.data
}

export async function updateUserStatus(
  id: number,
  isActive: boolean,
): Promise<{ id: number; isActive: boolean }> {
  const response = await apiClient.patch<ApiResponse<{ id: number; isActive: boolean }>>(
    `${USERS_URL}/${id}/status`,
    { isActive },
  )
  return response.data.data
}

export function getUserRequestError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data
      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
      ) {
        return data.message
      }
    }
  }

  return error instanceof Error ? error.message : 'Request failed'
}
