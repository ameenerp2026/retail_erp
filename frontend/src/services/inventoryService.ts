import type { InventoryStat, InventoryPeriod, COGSRun, RecalculateCOGS } from '@/types/inventory'
import {
  MOCK_STATS,
  MOCK_PERIODS,
  MOCK_COGS,
  MOCK_COGS_SUMMARY_CARDS,
  MOCK_RECALCULATE_SUMMARY,
  MOCK_RECALCULATE_MONTHS,
  MOCK_RECALCULATE_LOGS,
  MOCK_UNPOSTED_DOCUMENTS,
} from '@/mocks/inventoryMonths.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/organization/inventory-months'

export const inventoryService = {
  getStats: () =>
    fromMockOrApi(MOCK_STATS, () =>
      apiClient.get<InventoryStat[]>(`${API_BASE}/stats`).then((res) => res.data)
    ),

  getPeriods: () =>
    fromMockOrApi(MOCK_PERIODS, () =>
      apiClient.get<InventoryPeriod[]>(`${API_BASE}/periods`).then((res) => res.data)
    ),

  getCogsRuns: () =>
    fromMockOrApi(MOCK_COGS, () =>
      apiClient.get<COGSRun[]>(`${API_BASE}/cogs-runs`).then((res) => res.data)
    ),

  getCogsSummaryCards: (): Promise<typeof MOCK_COGS_SUMMARY_CARDS> =>
    fromMockOrApi(MOCK_COGS_SUMMARY_CARDS, () =>
      apiClient.get(`${API_BASE}/cogs-summary`).then((res) => res.data)
    ),

  getRecalculateSummary: (): Promise<typeof MOCK_RECALCULATE_SUMMARY> =>
    fromMockOrApi(MOCK_RECALCULATE_SUMMARY, () =>
      apiClient.get(`${API_BASE}/recalculate/summary`).then((res) => res.data)
    ),

  getRecalculateMonths: (): Promise<RecalculateCOGS[]> =>
    fromMockOrApi(MOCK_RECALCULATE_MONTHS as RecalculateCOGS[], () =>
      apiClient.get<RecalculateCOGS[]>(`${API_BASE}/recalculate/months`).then((res) => res.data)
    ),

  getRecalculateLogs: (): Promise<typeof MOCK_RECALCULATE_LOGS> =>
    fromMockOrApi(MOCK_RECALCULATE_LOGS, () =>
      apiClient.get(`${API_BASE}/recalculate/logs`).then((res) => res.data)
    ),

  getUnpostedDocuments: (): Promise<typeof MOCK_UNPOSTED_DOCUMENTS> =>
    fromMockOrApi(MOCK_UNPOSTED_DOCUMENTS, () =>
      apiClient.get(`${API_BASE}/unposted-documents`).then((res) => res.data)
    ),
}
