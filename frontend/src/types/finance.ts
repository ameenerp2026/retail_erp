import type { StatusType } from '@/components/shared/StatusTags'

export type FinanceStatType =
  | 'open'
  | 'closed'
  | 'provisional'

export type FinanceStat = {
  id: string
  type: FinanceStatType
  label: string
  value: string
  count?: number
}

export type FinancePeriodStatus = Extract<StatusType, 'Open' | 'Closed' | 'Future' | 'Provisional'>

export type FinancePeriod = {
  id: number
  period: string
  startDate: string
  endDate: string
  financeStatus: string
  accountingYearId?: string | number
  updatedAt?: string
  lastModified?: string
  transactions?: number
  lastClosedBy?: string | null
  invStatus?: string
  cogsStatus?: string
  periodId?: string
}
