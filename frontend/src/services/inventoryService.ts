import { InventoryStat, InventoryPeriod } from '@/types/inventory'
import { MOCK_STATS, MOCK_PERIODS } from '@/mocks/inventoryMonths.mock'
import axios from 'axios'

const API_BASE = '/api/organization/inventory_months'

export const inventoryService = {
  getStats: async (): Promise<InventoryStat[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS) {
      return MOCK_STATS
    }
    return axios.get(`${API_BASE}/stats`).then(res => res.data)
  },
  
  getPeriods: async (): Promise<InventoryPeriod[]> => {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS) {
      return MOCK_PERIODS
    }
    return axios.get(`${API_BASE}/periods`).then(res => res.data)
  }
}