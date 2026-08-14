
import type { StatusType } from '@/components/shared/StatusTags'
export type FinanceStatType =
  | 'open'
  | 'closed'
  | 'provisional'
  //| 'activeFy'

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
  accountingYearId: string
  period: string
  startDate: string
  endDate: string
  financeStatus: FinanceStatType
  updatedAt: string
  
}
