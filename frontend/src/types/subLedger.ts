export type SubLedgerType = 'Customer' | 'Vendor' | 'Employee'
export type SubLedgerRisk = 'Low' | 'Med' | 'High'
export type SubLedgerStatus = 'Active' | 'Inactive'

export type SubLedgerStat = {
  id: string
  label: string
  value: string
  tone: 'default' | 'teal' | 'danger'
}

export type SubLedger = {
  id: string
  name: string
  code: string
  linkedLedger: string
  linkedLedgerId: number
  type: SubLedgerType
  openingBalance: string
  openingBalanceRaw: number
  balanceType: 'Debit' | 'Credit'
  creditLimit: string | null
  creditLimitRaw: number | null
  creditUsagePct: number | null
  risk: SubLedgerRisk
  status: SubLedgerStatus
}

// dropdown option for "Linked Ledger"
export type LedgerOption = {
  id: number
  name: string
}

export type CreateSubLedgerRequest = {
  subLedgerName: string
  ledgerId: number
  type: SubLedgerType
  balanceType: 'debit' | 'credit'
  openingBalance?: number
  creditLimit?: number | null
  status?: 'active' | 'inactive'
}

export type UpdateSubLedgerRequest = CreateSubLedgerRequest

export type SubLedgerFieldErrors = Partial<
  Record<keyof CreateSubLedgerRequest, string[]>
>