import apiClient from '@/services/apiClient'

export type TaxGroup = 'STANDARD' | 'ESSENTIAL' | 'PHARMA' | 'EXEMPT'
export type TaxStatus = 'ACTIVE' | 'INACTIVE'
export type TaxProduct = { id: number; code: string; name: string }

export type TaxConfig = {
  id: number
  taxId: string
  hsnCode: string
  taxGroup: TaxGroup
  gstRate: number
  cessRate: number
  cgstRate: number
  sgstRate: number
  igstRate: number
  effectiveFrom: string
  isDefault: boolean
  status: TaxStatus
  products: TaxProduct[]
}

export type TaxConfigFilters = {
  search?: string
  status?: TaxStatus
  taxGroup?: TaxGroup
}

export type TaxConfigPayload = {
  hsnCode: string
  taxGroup: TaxGroup
  gstRate: number
  cessRate: number
  effectiveFrom: string
  isDefault: boolean
  status: TaxStatus
}

type ApiResponse<T> = {
  message: string
  data: T
}

const TAX_CONFIG_PATH = '/api/productSetup/tax-config'

export const getTaxConfigs = async (
  filters: TaxConfigFilters = {},
): Promise<TaxConfig[]> => {
  const response = await apiClient.get<ApiResponse<TaxConfig[]>>(TAX_CONFIG_PATH, {
    params: {
      search: filters.search ?? '',
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.taxGroup ? { taxGroup: filters.taxGroup } : {}),
    },
  })

  return response.data.data
}

export const createTaxConfig = async (
  payload: TaxConfigPayload,
): Promise<TaxConfig> => {
  const response = await apiClient.post<ApiResponse<TaxConfig>>(
    TAX_CONFIG_PATH,
    payload,
  )

  return response.data.data
}

export const updateTaxConfig = async (
  id: number,
  payload: TaxConfigPayload,
): Promise<TaxConfig> => {
  const response = await apiClient.put<ApiResponse<TaxConfig>>(
    `${TAX_CONFIG_PATH}/${id}`,
    payload,
  )

  return response.data.data
}

export const updateTaxConfigStatus = async (
  id: number,
  status: TaxStatus,
): Promise<TaxConfig> => {
  const response = await apiClient.patch<ApiResponse<TaxConfig>>(
    `${TAX_CONFIG_PATH}/${id}/status`,
    { status },
  )

  return response.data.data
}
