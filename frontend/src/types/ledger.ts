export type LedgerAccountGroup = 'Assets' | 'Liabilities' | 'Income' | 'Expenses'
export type LedgerBalanceType = 'Debit' | 'Credit'
export type LedgerStatus = 'Active' | 'Inactive'

export type LedgerStat = {
  id: string
  group: LedgerAccountGroup
  value: string
  ledgerCount: number
}

export type Ledger = {
  id: string
  ledgerId: string
  name: string
  accountClass: string
  accountGroup: LedgerAccountGroup
  openingBalance: string
  balanceType: LedgerBalanceType
  gstEnabled: boolean
  status: LedgerStatus
}
