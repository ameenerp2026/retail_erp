export type YearStatus = 'Active' | 'Closed' | 'Pending'
export type PeriodStatus = 'Closed' | 'Open' | 'Pending'

export type AccountingYear = {
  id: number
  label: string
  dateRange: string
  status: YearStatus
  closedPeriods: number
  totalPeriods: number
}

export type Period = {
  month: string
  year: string
  status: PeriodStatus
}