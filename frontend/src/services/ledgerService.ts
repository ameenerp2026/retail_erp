import type { Ledger, LedgerStat } from '@/types/ledger'
import { MOCK_LEDGERS, MOCK_LEDGER_STATS } from '@/mocks/ledger.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/finance/ledgers'

export const ledgerService = {
  getStats: () =>
    fromMockOrApi(MOCK_LEDGER_STATS, () =>
      apiClient.get<LedgerStat[]>(`${API_BASE}/stats`).then((res) => res.data)
    ),

  getLedgers: () =>
    fromMockOrApi(MOCK_LEDGERS, () =>
      apiClient.get<Ledger[]>(API_BASE).then((res) => res.data)
    ),
}
