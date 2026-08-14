import type {
  SubLedger,
  SubLedgerStat,
  SubLedgerType,
  CreateSubLedgerRequest,
  UpdateSubLedgerRequest,
  LedgerOption,
} from '@/types/subLedger'
import { MOCK_SUB_LEDGERS, MOCK_SUB_LEDGER_STATS } from '@/mocks/subLedger.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import { ledgerService } from '@/services/admin/finance/ledgerService'

const API_BASE = '/api/finance/sub-ledgers'

type RawSubLedger = {
  id: number
  subLedgerName: string
  ledgerId: number
  balanceType: 'debit' | 'credit'
  openingBalance: string | number
  creditLimit: string | number | null
  status: 'active' | 'inactive'
  ledger: { id: number; ledgerName: string }
  subLedgerType: { id: number; typeName: SubLedgerType }
}

function deriveRisk(creditUsagePct: number | null): 'Low' | 'Med' | 'High' {
  if (creditUsagePct === null) return 'Low'
  if (creditUsagePct >= 80) return 'High'
  if (creditUsagePct >= 50) return 'Med'
  return 'Low'
}

function mapToSubLedger(raw: RawSubLedger): SubLedger {
  const openingBalanceRaw = Number(raw.openingBalance)
  const creditLimitRaw = raw.creditLimit != null ? Number(raw.creditLimit) : null
  const creditUsagePct =
    creditLimitRaw && creditLimitRaw > 0
      ? Math.min(100, Math.round((openingBalanceRaw / creditLimitRaw) * 100))
      : null

  return {
    id: String(raw.id),
    name: raw.subLedgerName,
    code: `SL-${String(raw.id).padStart(3, '0')}`,
    linkedLedger: raw.ledger.ledgerName,
    linkedLedgerId: raw.ledger.id,
    type: raw.subLedgerType.typeName,
    openingBalance: `₹${openingBalanceRaw.toLocaleString('en-IN')}`,
    openingBalanceRaw,
    balanceType: raw.balanceType === 'debit' ? 'Debit' : 'Credit',
    creditLimit: creditLimitRaw != null ? `₹${creditLimitRaw.toLocaleString('en-IN')}` : null,
    creditLimitRaw,
    creditUsagePct,
    risk: deriveRisk(creditUsagePct),
    status: raw.status === 'active' ? 'Active' : 'Inactive',
  }
}

export const subLedgerService = {
  getStats: () =>
    fromMockOrApi(MOCK_SUB_LEDGER_STATS, () =>
      apiClient.get<SubLedgerStat[]>(`${API_BASE}/stats`).then((res) => res.data)
    ),

  getSubLedgers: async (): Promise<SubLedger[]> => {
    return fromMockOrApi(MOCK_SUB_LEDGERS, async () => {
      const res = await apiClient.get<{ success: boolean; data: RawSubLedger[] }>(API_BASE)
      return res.data.data.map(mapToSubLedger)
    })
  },

  // real ledgers for the "Linked Ledger" dropdown — reuses the ledgers list
  getLedgerOptions: async (): Promise<LedgerOption[]> => {
    const ledgers = await ledgerService.getLedgers()
    return ledgers.map((l) => ({ id: Number(l.id), name: l.name }))
  },

  create: async (payload: CreateSubLedgerRequest): Promise<SubLedger> => {
    const res = await apiClient.post<{ success: boolean; data: RawSubLedger }>(API_BASE, payload)
    return mapToSubLedger(res.data.data)
  },

  update: async (id: string, payload: UpdateSubLedgerRequest): Promise<SubLedger> => {
    const res = await apiClient.put<{ success: boolean; data: RawSubLedger }>(`${API_BASE}/${id}`, payload)
    return mapToSubLedger(res.data.data)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${id}`)
  },
}