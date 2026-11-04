import apiClient from '@/services/apiClient'

export type UomStatus = 'ACTIVE' | 'INACTIVE'

export interface Uom {
  id: number
  code: string
  name: string
  status: UomStatus
  createdAt: string
}

export interface UomFilters {
  search?: string
  status?: UomStatus
}

export interface CreateUomPayload {
  code: string
  name: string
}

export const getUoms = async (filters: UomFilters = {}): Promise<Uom[]> => {
  const response = await apiClient.get('/api/productSetup/uom', {
    params: {
      search: filters.search ?? '',
      ...(filters.status ? { status: filters.status } : {}),
    },
  })

  return response.data.data
}

export const createUom = async (payload: CreateUomPayload): Promise<Uom> => {
  const response = await apiClient.post('/api/productSetup/uom', payload)
  return response.data.data
}

export const updateUomStatus = async (
  id: number,
  status: UomStatus,
): Promise<Uom> => {
  const response = await apiClient.patch(`/api/productSetup/uom/${id}/status`, {
    status,
  })

  return response.data.data
}
