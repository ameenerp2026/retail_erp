import type { StatusType } from '@/modules/Organization/components/FinanceMonths/StatusTags'

export type FinanceStatType = 'open' | 'closed' | 'provisional'|'pending'

export type FinanceStat = {
  id: string
  type: FinanceStatType
  label: string
  count: number
}

export type FinancePeriodStatus = 'open' | 'closed' | 'provisional' | 'pending'

export type FinancePeriod = {
  id: string
  period: string
  startDate: string
  endDate: string
  financeStatus: StatusType
  invStatus: StatusType
  cogsStatus: StatusType
  lastModified: string
}