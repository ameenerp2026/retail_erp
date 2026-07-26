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
  type: SubLedgerType
  openingBalance: string
  creditLimit: string | null
  creditUsagePct: number | null
  risk: SubLedgerRisk
  status: SubLedgerStatus
}
