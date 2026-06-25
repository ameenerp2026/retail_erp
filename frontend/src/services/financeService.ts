import { FinanceStat, FinancePeriod } from '@/types/finance'
import { MOCK_STATS, MOCK_PERIODS } from '@/mocks/financeMonths.mock'
import axios from 'axios'

const API_BASE = '/api/organization/finance_months'

export const financeService = {
  getStats: async (): Promise<FinanceStat[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS) {
      return MOCK_STATS
    }
    return axios.get(`${API_BASE}/stats`).then(res => res.data)
  },
  
  getPeriods: async (): Promise<FinancePeriod[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS) {
      return MOCK_PERIODS
    }
    return axios.get(`${API_BASE}/periods`).then(res => res.data)
  }
}