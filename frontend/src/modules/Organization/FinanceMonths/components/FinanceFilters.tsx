import { Filter } from 'lucide-react'
import type { FinancePeriodStatus } from '@/types/finance'

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

const FY_OPTIONS = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24']
const ORG_OPTIONS = ['RetailShop India', 'RetailShop UAE', 'RetailShop KSA']
//const STATUS_OPTIONS: FinanceFilterState['status'][] = ['All', 'Open', 'Closed', 'Provisional', 'Future']

type Props = {
  /** Draft filter values (controlled by the parent) */
  value: FinanceFilterState
  onChange: (next: FinanceFilterState) => void
  /** Called when the user clicks Apply Filters */
  onApply: () => void
}

const selectClass =
  'h-10 w-full rounded-xl border border-slate-200 bg-[#F5F7FB] px-3 text-xs text-slate-600 outline-none focus:border-[#043793]/40 focus:ring-2 focus:ring-[#043793]/10'

export default function FinanceFilters({ value, onChange, onApply }: Props) {
  const set = <K extends keyof FinanceFilterState>(key: K, v: FinanceFilterState[K]) =>
    onChange({ ...value, [key]: v })

  return (
    <div className="mb-5 rounded-[14px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Filter size={13} />
          <span className="uppercase tracking-wide">Filters</span>
        </div>

        {/* Financial Year */}
        <select
          value={value.fy}
          onChange={(e) => set('fy', e.target.value)}
          className={`${selectClass} lg:w-44`}
        >
          {FY_OPTIONS.map((fy) => (
            <option key={fy} value={fy}>
              {fy}
            </option>
          ))}
        </select>

        {/* Organization */}
        <select
          value={value.organization}
          onChange={(e) => set('organization', e.target.value)}
          className={`${selectClass} lg:w-48`}
        >
          <option value="">Organization</option>
          {ORG_OPTIONS.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>

        {/* Search month */}
        <input
          type="text"
          value={value.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search month..."
          className={`${selectClass} min-w-0 flex-1 placeholder:text-slate-400`}
        />

        {/* Status */}
        {/* <select
          value={value.status}
          onChange={(e) => set('status', e.target.value as FinanceFilterState['status'])}
          className={`${selectClass} lg:w-40`}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Status' : status}
            </option>
          ))}
        </select> */}

        {/* Apply */}
        <button
          type="button"
          onClick={onApply}
          className="h-10 shrink-0 rounded-xl bg-[linear-gradient(#093055,#043793)] px-6 text-xs font-semibold text-white transition hover:opacity-95"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
