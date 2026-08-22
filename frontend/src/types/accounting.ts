export type YearStatus = 'Active' | 'Closed' | 'Pending'
export type PeriodStatus = 'Closed' | 'Open' | 'Pending'
export type FinanceMonth = {
  id: number;
  period: string;
  startDate: string;
  endDate: string;
  financeStatus: "Open" | "Closed" | "Provisional";
};
export type AccountingYear = {
  id: number
  label: string
  dateRange: string
  status: YearStatus
  closedPeriods: number
  totalPeriods: number,
  createdBy?: string,
  createdOn?: string,
  updatedBy?: string,
  updatedOn?: string,
    financeMonths: FinanceMonth[];

}


export type AuditEvent = {
  action: string   // e.g. "Periods Generated", "Period Opened", "Period Closed"
  by: string
  date: string
}

export type Period = {
  month: string
  year: string
  status: PeriodStatus
  sequenceNumber: string
  accountingYear: string
  startDate: string
  endDate: string
  isCurrentPeriod: boolean
  createdBy?: string
  createdOn?: string
  updatedBy?: string
  updatedOn?: string
  auditLog?: AuditEvent[]
}
