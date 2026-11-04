import apiClient from '@/services/apiClient'

export type RoleType = 'STANDARD' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'
export type RoleScope = 'GROUP' | 'UNIT'
export type RoleStatus = 'ACTIVE' | 'INACTIVE'

export interface RolePermission {
  id: number
  code: string
  name: string
  module: string
  screen: string
  description?: string | null
}

export interface SecurityRole {
  id: number
  name: string
  description: string | null
  roleType: RoleType
  scope: RoleScope
  priority: number
  status: RoleStatus
  organizationGroupId: number
  userCount: number
  permissionCount: number
  createdAt: string
  updatedAt: string
  permissionIds?: number[]
}

export interface OrganizationGroupOption {
  id: number
  shortName: string
  companyName: string
}

export interface RolePayload {
  name: string
  description: string
  roleType: RoleType
  scope: RoleScope
  priority: number
  status: RoleStatus
  organizationGroupId: number
  permissionIds: number[]
}

interface ApiResponse<T> {
  data: T
}

export async function getRoles(): Promise<SecurityRole[]> {
  const response = await apiClient.get<ApiResponse<SecurityRole[]>>('/api/securities')
  return response.data.data
}

export async function getRoleById(id: number): Promise<SecurityRole> {
  const response = await apiClient.get<ApiResponse<SecurityRole>>(`/api/securities/${id}`)
  return response.data.data
}

export async function getRolePermissions(): Promise<RolePermission[]> {
  const response = await apiClient.get<ApiResponse<RolePermission[]>>(
    '/api/securities/permissions',
  )
  return response.data.data
}

export async function getOrganizationGroups(): Promise<OrganizationGroupOption[]> {
  const response = await apiClient.get<ApiResponse<OrganizationGroupOption[]>>(
    '/api/organization/org-group',
  )
  return response.data.data
}

export async function createRole(payload: RolePayload): Promise<SecurityRole> {
  const response = await apiClient.post<ApiResponse<SecurityRole>>(
    '/api/securities',
    payload,
  )
  return response.data.data
}

export async function updateRole(
  id: number,
  payload: RolePayload,
): Promise<SecurityRole> {
  const response = await apiClient.put<ApiResponse<SecurityRole>>(
    `/api/securities/${id}`,
    payload,
  )
  return response.data.data
}

export async function deleteRole(id: number): Promise<void> {
  await apiClient.delete(`/api/securities/${id}`)
}

export async function cloneRole(id: number): Promise<SecurityRole> {
  const response = await apiClient.post<ApiResponse<SecurityRole>>(
    `/api/securities/${id}/clone`,
  )
  return response.data.data
}

export function getRoleRequestError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = error.response
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
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
