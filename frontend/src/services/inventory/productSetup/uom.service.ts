import apiClient from '@/services/apiClient'
import type { GstUqc } from '@/services/inventory/productSetup/gstUqc.service'

export type UomStatus = 'ACTIVE' | 'INACTIVE'

export interface Uom {
  id: number
  name: string
  shortName: string
  gstUqcId: number
  gstUqc: GstUqc
  decimalPlaces: number
  status: UomStatus
  createdById: number
  updatedById: number
  createdAt: string
  updatedAt: string
}

export interface UomFilters {
  search?: string
  status?: UomStatus
}

export interface CreateUomPayload {
  name: string
  shortName: string
  gstUqcId: number
  decimalPlaces: number
  status: UomStatus
}

interface ApiResponse<T> {
  message: string
  data: T
}

export const getUoms = async (filters: UomFilters = {}): Promise<Uom[]> => {
  const response = await apiClient.get<ApiResponse<Uom[]>>('/api/productSetup/uom', {
    params: {
      search: filters.search ?? '',
      ...(filters.status ? { status: filters.status } : {}),
    },
  })

  return response.data.data
}

export const createUom = async (payload: CreateUomPayload): Promise<Uom> => {
  const response = await apiClient.post<ApiResponse<Uom>>(
    '/api/productSetup/uom',
    payload,
  )
  return response.data.data
}

export const updateUomStatus = async (
  id: number,
  status: UomStatus,
): Promise<Uom> => {
  const response = await apiClient.patch<ApiResponse<Uom>>(
    `/api/productSetup/uom/${id}/status`,
    { status },
  )

  return response.data.data
}
