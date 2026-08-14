// services/currencyService.ts
import type { CurrencyRecord, CreateCurrencyRequest, UpdateCurrencyRequest } from '@/types/currency'
import { MOCK_CURRENCIES } from '@/mocks/currencyMocks'
import apiClient from '@/services/apiClient'

const API_BASE = '/api/finance/currencies'
const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'

type RawCurrency = {
  id: number
  currencyCode: string
  currencyName: string
  symbol: string
  exchangeRate: string | number
  isBase: boolean
  updatedAt: string
}

function mapToCurrencyRecord(raw: RawCurrency): CurrencyRecord {
  return {
    id: String(raw.id),
    code: raw.currencyCode,
    name: raw.currencyName,
    symbol: raw.symbol,
    exchangeRate: Number(raw.exchangeRate),
    isBase: raw.isBase,
    lastUpdated: new Date(raw.updatedAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  }
}

export const currencyService = {
  getAll: async (): Promise<CurrencyRecord[]> => {
    if (USE_MOCKS) return MOCK_CURRENCIES
    const res = await apiClient.get<{ success: boolean; data: RawCurrency[] }>(API_BASE)
    return res.data.data.map(mapToCurrencyRecord)
  },

  create: async (payload: CreateCurrencyRequest): Promise<CurrencyRecord> => {
    const res = await apiClient.post<{ success: boolean; data: RawCurrency }>(API_BASE, payload)
    return mapToCurrencyRecord(res.data.data)
  },

  update: async (id: string, payload: UpdateCurrencyRequest): Promise<CurrencyRecord> => {
    const res = await apiClient.put<{ success: boolean; data: RawCurrency }>(`${API_BASE}/${id}`, payload)
    return mapToCurrencyRecord(res.data.data)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`)
  },

  refreshRate: async (id: string): Promise<CurrencyRecord> => {
    const res = await apiClient.post<{ success: boolean; data: RawCurrency }>(`${API_BASE}/${id}/refresh`)
    return mapToCurrencyRecord(res.data.data)
  },
}