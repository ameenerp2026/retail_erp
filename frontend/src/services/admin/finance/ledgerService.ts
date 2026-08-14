// services/admin/finance/ledgerService.ts
import apiClient from '@/services/apiClient'
import type {
  CreateLedgerRequest,
  UpdateLedgerRequest,
  AccountClassOption,
  AccountGroupOption,
  OrgUnitOption,
  LedgerGroupStat,
  Ledger,
  LedgerAccountGroup,
} from '@/types/ledger'

// Shape actually returned by the backend (raw Prisma include result).
// accountGroupId / organizationUnitId are the plain scalar FK columns —
// present alongside the nested include objects.
type RawLedger = {
  id: number
  ledgerName: string
  ledgerCode: string | null
  balanceType: 'debit' | 'credit'
  openingBalance: string | number
  gstApplicable: boolean
  status: 'active' | 'inactive'
  accountGroupId: number
  organizationUnitId: number | null
  accountClass: { id: number; className: string } | null
  accountGroup: { id: number; rootGroupName: string }
}

function mapToLedger(raw: RawLedger): Ledger {
  return {
    id: String(raw.id),
    ledgerId: raw.ledgerCode ?? `LED-${raw.id}`,
    name: raw.ledgerName,
    accountClass: raw.accountClass ? { id: raw.accountClass.id, className: raw.accountClass.className } : null,
    accountGroup: raw.accountGroup.rootGroupName as LedgerAccountGroup,
    accountGroupId: raw.accountGroupId,
    organizationUnitId: raw.organizationUnitId,
    openingBalance: `₹${Number(raw.openingBalance).toLocaleString('en-IN')}`,
    openingBalanceRaw: Number(raw.openingBalance),
    balanceType: raw.balanceType === 'debit' ? 'Debit' : 'Credit',
    gstEnabled: raw.gstApplicable,
    status: raw.status === 'active' ? 'Active' : 'Inactive',
  }
}

export const ledgerService = {
  getAccountClassesByGroup: async (accountGroupId: number): Promise<AccountClassOption[]> => {
    const res = await apiClient.get<{ success: boolean; data: AccountClassOption[] }>(
      `/api/finance/account-class/by-group/${accountGroupId}`
    )
    return res.data.data
  },

  getAccountGroups: async (): Promise<AccountGroupOption[]> => {
    const res = await apiClient.get<{ success: boolean; data: AccountGroupOption[] }>(
      '/api/finance/account-groups'
    )
    return res.data.data
  },

  getOrgUnits: async (): Promise<OrgUnitOption[]> => {
    const res = await apiClient.get<{ success: boolean; data: OrgUnitOption[] }>(
      '/api/organizationUnit/org-unit'
    )
    return res.data.data
  },

  create: async (payload: CreateLedgerRequest): Promise<Ledger> => {
    const res = await apiClient.post<{ success: boolean; data: RawLedger }>('/api/finance/ledgers', payload)
    return mapToLedger(res.data.data)
  },

  update: async (id: string, payload: UpdateLedgerRequest): Promise<Ledger> => {
    const res = await apiClient.put<{ success: boolean; data: RawLedger }>(`/api/finance/ledgers/${id}`, payload)
    return mapToLedger(res.data.data)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/finance/ledgers/${id}`)
  },

  getStats: async (): Promise<LedgerGroupStat[]> => {
    const res = await apiClient.get<{ success: boolean; data: LedgerGroupStat[] }>(
      '/api/finance/ledgers/stats'
    )
    return res.data.data
  },

  getLedgers: async (): Promise<Ledger[]> => {
    const res = await apiClient.get<{ success: boolean; data: RawLedger[] }>('/api/finance/ledgers')
    return res.data.data.map(mapToLedger)
  },
}