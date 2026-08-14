// types/ledger.ts
export type BalanceType = 'debit' | 'credit'

// UI-facing capitalized variant used by CreateLedgerModal's dropdown
export type LedgerBalanceType = 'Debit' | 'Credit'

export type AccountClassOption = {
  id: number
  className: string
}

// needed for the "Account Group" dropdown
export type AccountGroupOption = {
  id: number
  rootGroupName: string
}

// needed for the "Org Unit" dropdown
export type OrgUnitOption = {
  id: number
  organizationUnit: string
}

export type CreateLedgerRequest = {
  ledgerName: string
  ledgerCode?: string | null
  accountGroupId: number
  accountClassId: number
  balanceType: BalanceType
  openingBalance?: number
  currencyId?: number | null
  organizationUnitId?: number | null
  gstApplicable?: boolean
  status?: 'active' | 'inactive'
}

export type UpdateLedgerRequest = CreateLedgerRequest

// shape of the 422 validation error response from createLedgerHandler
export type LedgerFieldErrors = Partial<
  Record<keyof CreateLedgerRequest, string[]>
>

export type ApiValidationError = {
  errors?: LedgerFieldErrors
  error?: string
}

// ---------- Ledger list page ----------

export type LedgerAccountGroup = 'Assets' | 'Liabilities' | 'Income' | 'Expenses'

export type Ledger = {
  id: string
  ledgerId: string
  name: string
  accountClass: { id: number; className: string } | null
  accountGroup: LedgerAccountGroup
  accountGroupId: number
  organizationUnitId: number | null
  openingBalance: string // formatted, e.g. "₹12,000" — for display only
  openingBalanceRaw: number // unformatted, for prefilling the edit form
  balanceType: LedgerBalanceType
  gstEnabled: boolean
  status: 'Active' | 'Inactive'
}

// one entry per account group, used for the dashboard summary cards
export type LedgerGroupStat = {
  id: string
  group: LedgerAccountGroup
  value: string // formatted total, e.g. "₹4,50,000"
  ledgerCount: number
}