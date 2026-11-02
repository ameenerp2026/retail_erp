import type { FinancePeriodStatus } from '@/types/finance'

// Shared filter state types/constants, kept in their own module so that
// component files only export components (react-refresh rule).
export type FinanceFilterState = {
  fy: string
  organization: string
  search: string
  status: 'All' | FinancePeriodStatus
}

export const DEFAULT_FINANCE_FILTERS: FinanceFilterState = {
  fy: 'FY 2025-26',
  organization: '',
  search: '',
  status: 'All',
}