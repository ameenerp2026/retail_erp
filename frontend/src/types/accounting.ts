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
    financeMonths: FinanceMonth[];

}

export type Period = {
  month: string
  year: string
  status: PeriodStatus
}