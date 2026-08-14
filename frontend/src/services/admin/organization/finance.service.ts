import type { FinancePeriod } from '@/types/finance'
import type { ActivityItem } from '@/components/shared/DetailPanel'
//import { MOCK_STATS, MOCK_PERIODS, MOCK_FINANCE_ACTIVITY } from '@/mocks/financeMonths.mock'
import apiClient from '@/services/apiClient'
//import { fromMockOrApi } from '@/services/dataSource'

//const API_BASE = '/api/organization/finance-months'

// export const financeService = {
//   getStats: () =>
//     fromMockOrApi(MOCK_STATS, () =>
//       apiClient.get<FinanceStat[]>(`${API_BASE}/stats`).then((res) => res.data)
//     ),

//   getPeriods: () =>
//     fromMockOrApi(MOCK_PERIODS, () =>
//       apiClient.get<FinancePeriod[]>(`${API_BASE}/periods`).then((res) => res.data)
//     ),

//   getActivity: (periodId?: string) =>
//     fromMockOrApi(MOCK_FINANCE_ACTIVITY, () =>
//       apiClient
//         .get<ActivityItem[]>(`${API_BASE}/activity`, { params: { periodId } })
//         .then((res) => res.data)
//     ),
// }
export const getFinanceData=async()=>{
  const response = await apiClient.get(
    "/api/financeMonth/finance-month")
    return response.data.data
}