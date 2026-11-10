import axios from 'axios'
import apiClient from '@/services/apiClient'
import type { HsnRateOption, TaxConfig, TaxDraft } from '@/types/inventorySetup'
import { MOCK_TAX_CONFIGS } from '@/mocks/inventorySetup.mock'
import { deriveGstComponents, normalizeHsnCode, toIsoDateInput } from '@/utils/gstCalculations'

const TAX_API_BASE = '/api/productSetup/tax'

type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  data: T
}

export type SaveTaxConfigPayload = {
  productCode: string
  productName: string
  taxGroup: string
  hsnSac: string
  gstRate: number
  cess: number
  effectiveDate: string
  isDefault: boolean
}

function normalizeTaxConfigRecord(raw: Partial<TaxConfig> & { gstRate?: number | string }): TaxConfig {
  const gstNum = Number(raw.gstRate ?? 0)
  const { gstRate, cgst, sgst, igst } = deriveGstComponents(gstNum)

  return {
    id: String(raw.id ?? ''),
    taxId: raw.taxId ?? '',
    productCode: raw.productCode ?? '',
    productName: raw.productName ?? '',
    hsnSac: raw.hsnSac ?? '',
    taxGroup: raw.taxGroup ?? 'Standard',
    gstRate,
    cgst,
    sgst,
    igst,
    cess: Number(raw.cess ?? 0),
    effectiveDate: toIsoDateInput(raw.effectiveDate),
    isDefault: Boolean(raw.isDefault),
  }
}

function isApiUnavailableError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  // No response (backend offline/CORS/network) or 5xx/404 when DB/route isn't available
  if (!error.response) return true
  const status = error.response.status
  return status >= 500 || status === 404
}

export const taxService = {
  /** Fetch all tax configurations from the backend database (falls back if backend/DB offline). */
  async getTaxConfigs(filters?: { search?: string; taxGroup?: string }): Promise<{
    items: TaxConfig[]
    fromFallback: boolean
  }> {
    try {
      const res = await apiClient.get<ApiEnvelope<TaxConfig[]>>(TAX_API_BASE, {
        params: {
          ...(filters?.search ? { search: filters.search } : {}),
          ...(filters?.taxGroup && filters.taxGroup !== 'All'
            ? { taxGroup: filters.taxGroup }
            : {}),
        },
      })
      const list = Array.isArray(res.data?.data) ? res.data.data : []
      return {
        items: list.map(normalizeTaxConfigRecord),
        fromFallback: false,
      }
    } catch (error) {
      if (isApiUnavailableError(error)) {
        console.warn('[taxService] Backend unavailable; using fallback tax dataset.', error)
        return {
          items: MOCK_TAX_CONFIGS.map(normalizeTaxConfigRecord),
          fromFallback: true,
        }
      }
      throw error
    }
  },

  /** Fetch a single saved tax configuration (including its `gstRate`) when editing. */
  async getTaxConfigById(id: string): Promise<TaxConfig | null> {
    try {
      const res = await apiClient.get<ApiEnvelope<TaxConfig>>(`${TAX_API_BASE}/${id}`)
      return res.data?.data ? normalizeTaxConfigRecord(res.data.data) : null
    } catch (error) {
      if (isApiUnavailableError(error)) {
        return null
      }
      throw error
    }
  },

  /** Fetch existing HSN codes and their `gstRate` from the backend `hsn_codes` table. */
  async getHsnRates(): Promise<HsnRateOption[]> {
    try {
      const res = await apiClient.get<ApiEnvelope<HsnRateOption[]>>(`${TAX_API_BASE}/hsn-codes`)
      const list = Array.isArray(res.data?.data) ? res.data.data : []
      return list.map((item) => ({
        id: item.id,
        code: item.code,
        description: item.description,
        gstRate: item.gstRate !== null && item.gstRate !== undefined ? Number(item.gstRate) : null,
      }))
    } catch (error) {
      if (isApiUnavailableError(error)) {
        return []
      }
      throw error
    }
  },

  /** Look up a single HSN/SAC code's `gstRate` from the backend table. */
  async lookupHsnRate(hsnSac: string): Promise<HsnRateOption | null> {
    const normalized = normalizeHsnCode(hsnSac)
    if (normalized.length < 2) return null

    try {
      const res = await apiClient.get<ApiEnvelope<HsnRateOption | null>>(
        `${TAX_API_BASE}/hsn-rate`,
        { params: { code: hsnSac.trim() } },
      )
      const data = res.data?.data
      if (!data) return null
      return {
        id: data.id,
        code: data.code,
        description: data.description,
        gstRate: data.gstRate !== null && data.gstRate !== undefined ? Number(data.gstRate) : null,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 404 || isApiUnavailableError(error))) {
        return null
      }
      throw error
    }
  },

  /** Create a tax configuration in backend saving `gstRate` (CGST/SGST/IGST derived). */
  async createTaxConfig(payload: SaveTaxConfigPayload): Promise<{
    item: TaxConfig
    persistedToBackend: boolean
  }> {
    try {
      const res = await apiClient.post<ApiEnvelope<TaxConfig>>(TAX_API_BASE, payload)
      return {
        item: normalizeTaxConfigRecord(res.data.data),
        persistedToBackend: true,
      }
    } catch (error) {
      if (isApiUnavailableError(error)) {
        const { gstRate, cgst, sgst, igst } = deriveGstComponents(payload.gstRate)
        return {
          item: {
            id: String(Date.now()),
            taxId: '',
            productCode: payload.productCode,
            productName: payload.productName,
            hsnSac: payload.hsnSac,
            taxGroup: payload.taxGroup,
            gstRate,
            cgst,
            sgst,
            igst,
            cess: Number(payload.cess ?? 0),
            effectiveDate: toIsoDateInput(payload.effectiveDate),
            isDefault: Boolean(payload.isDefault),
          },
          persistedToBackend: false,
        }
      }
      throw error
    }
  },

  /** Update an existing tax configuration in backend saving updated `gstRate`. */
  async updateTaxConfig(
    id: string,
    payload: Partial<SaveTaxConfigPayload> & Partial<TaxDraft>,
  ): Promise<{
    item: TaxConfig
    persistedToBackend: boolean
  }> {
    try {
      const res = await apiClient.put<ApiEnvelope<TaxConfig>>(`${TAX_API_BASE}/${id}`, payload)
      return {
        item: normalizeTaxConfigRecord(res.data.data),
        persistedToBackend: true,
      }
    } catch (error) {
      if (isApiUnavailableError(error)) {
        const { gstRate, cgst, sgst, igst } = deriveGstComponents(payload.gstRate ?? 0)
        return {
          item: {
            id,
            taxId: '',
            productCode: payload.productCode ?? '',
            productName: payload.productName ?? '',
            hsnSac: payload.hsnSac ?? '',
            taxGroup: payload.taxGroup ?? 'Standard',
            gstRate,
            cgst,
            sgst,
            igst,
            cess: Number(payload.cess ?? 0),
            effectiveDate: toIsoDateInput(payload.effectiveDate),
            isDefault: Boolean(payload.isDefault),
          },
          persistedToBackend: false,
        }
      }
      throw error
    }
  },

  /** Delete a tax configuration by id. */
  async deleteTaxConfig(id: string): Promise<{ deletedInBackend: boolean }> {
    try {
      await apiClient.delete(`${TAX_API_BASE}/${id}`)
      return { deletedInBackend: true }
    } catch (error) {
      if (isApiUnavailableError(error)) {
        return { deletedInBackend: false }
      }
      throw error
    }
  },
}

