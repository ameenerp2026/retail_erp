import type { StatusType } from '@/components/shared/StatusTags'

export type FinanceStatType = 'activeFy' | 'open' | 'closed' | 'entries'

export type FinanceStat = {
  id: string
  type: FinanceStatType
  label: string
  /** Primary display value (e.g. "FY 2025-26", "7 Open", "23,155 Txns") */
  value: string
  count?: number
}

export type FinancePeriodStatus = Extract<StatusType, 'Open' | 'Closed' | 'Future' | 'Provisional'>

export type FinancePeriod = {
  id: number
  periodId: string
  period: string
  startDate: string
  endDate: string
  financeStatus: FinancePeriodStatus
  // transactions: number
  // lastClosedBy: string | null
  lastUpdated: string
  /** Kept for shared period filters used by inventory screens */
  // invStatus?: StatusType
  // cogsStatus?: StatusType
  // lastModified?: string
}
