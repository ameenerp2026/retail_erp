import { InventoryStat, InventoryPeriod } from '@/types/inventory'
import { MOCK_STATS, MOCK_PERIODS } from '@/mocks/inventoryMonths.mock'
import axios from 'axios'

const API_BASE = '/api/organization/inventory_months'

const fallbackToMocks = () => {
  if (import.meta.env.DEV) {
    return true
  }

  return false
}

export const inventoryService = {
  getStats: async (): Promise<InventoryStat[]> => {
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
  
  getPeriods: async (): Promise<InventoryPeriod[]> => {
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