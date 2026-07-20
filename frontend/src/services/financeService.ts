import { FinanceStat, FinancePeriod } from '@/types/finance'
import { MOCK_STATS, MOCK_PERIODS } from '@/mocks/financeMonths.mock'
import axios from 'axios'

const API_BASE = '/api/organization/finance_months'

const fallbackToMocks = () => {
  if (import.meta.env.DEV) {
    return true
  }

  return false
}

export const financeService = {
  getStats: async (): Promise<FinanceStat[]> => {
    if (fallbackToMocks()) {
      return MOCK_STATS
    }

    try {
      const res = await axios.get(`${API_BASE}/stats`)
      return Array.isArray(res.data) ? res.data : MOCK_STATS
    } catch {
      return MOCK_STATS
    }
  },
  
  getPeriods: async (): Promise<FinancePeriod[]> => {
    if (fallbackToMocks()) {
      return MOCK_PERIODS
    }

    try {
      const res = await axios.get(`${API_BASE}/periods`)
      return Array.isArray(res.data) ? res.data : MOCK_PERIODS
    } catch {
      return MOCK_PERIODS
    }
  }
}