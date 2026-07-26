import type { SubLedger, SubLedgerStat } from '@/types/subLedger'
import { MOCK_SUB_LEDGERS, MOCK_SUB_LEDGER_STATS } from '@/mocks/subLedger.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/finance/sub-ledgers'

export const subLedgerService = {
  getStats: () =>
    fromMockOrApi(MOCK_SUB_LEDGER_STATS, () =>
      apiClient.get<SubLedgerStat[]>(`${API_BASE}/stats`).then((res) => res.data)
    ),

  getSubLedgers: () =>
    fromMockOrApi(MOCK_SUB_LEDGERS, () =>
      apiClient.get<SubLedger[]>(API_BASE).then((res) => res.data)
    ),
}
