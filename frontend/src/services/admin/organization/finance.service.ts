import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import { MOCK_PERIODS, MOCK_STATS, MOCK_FINANCE_ACTIVITY } from '@/mocks/financeMonths.mock'
import type { FinancePeriod, FinanceStat } from '@/types/finance'
import type { ActivityItem } from '@/components/shared/DetailPanel'

export const getFinanceData = async (): Promise<FinancePeriod[]> => {
  return fromMockOrApi(MOCK_PERIODS, async () => {
    try {
      const response = await apiClient.get('/api/financeMonth/finance-month')
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      }
      return MOCK_PERIODS
    } catch {
      return MOCK_PERIODS
    }
  })
}

export const getFinanceStats = async (): Promise<FinanceStat[]> => {
  return fromMockOrApi(MOCK_STATS, async () => {
    return MOCK_STATS
  })
}

export const getActivity = async (_periodId?: number | string): Promise<ActivityItem[]> => {
  return fromMockOrApi(MOCK_FINANCE_ACTIVITY, async () => {
    return MOCK_FINANCE_ACTIVITY
  })
}

export const financeService = {
  getFinanceData,
  getFinanceStats,
  getActivity,
}