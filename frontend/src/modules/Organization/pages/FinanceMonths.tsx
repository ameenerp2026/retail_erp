import { useMemo, useState } from 'react'
import { Download, Plus, RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import PeriodTable from '../components/FinanceMonths/FinanceTable'
import FinanceSetupStatCards from '../components/FinanceMonths/FinanceSetupStatCards'
import FinanceActivityTimeline from '../components/FinanceMonths/FinanceActivityTimeline'
import FinanceFilters, {
  DEFAULT_FINANCE_FILTERS,
  type FinanceFilterState,
} from '../components/FinanceMonths/FinanceFilters'
import { financeService } from '@/services/financeService'

export default function FinanceMonths() {
  // Draft filters (edited in the UI) vs. applied filters (committed on "Apply Filters")
  const [draftFilters, setDraftFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)

  const { data: periods = [], isLoading: periodsLoading } = useQuery({
    queryKey: ['finance-periods'],
    queryFn: financeService.getPeriods,
  })

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: financeService.getStats,
  })

  const { data: activity = [] } = useQuery({
    queryKey: ['finance-activity'],
    queryFn: () => financeService.getActivity(),
  })

  const filteredPeriods = useMemo(() => {
    const { search, status } = appliedFilters
    const needle = search.trim().toLowerCase()

    return periods.filter((period) => {
      if (status !== 'All' && period.financeStatus !== status) return false
      if (needle && !period.period.toLowerCase().includes(needle)) return false
      return true
    })
  }, [periods, appliedFilters])

  const applyFilters = () => setAppliedFilters(draftFilters)

  if (statsLoading || periodsLoading) {
    return <div className="page-shell text-sm text-slate-500">Loading...</div>
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Finance Months</h1>
          <p className="page-subtitle">
            Manage and monitor finance period status across all organization units
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export Periods</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Sync FY</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white sm:px-4"
          >
            <Plus size={13} />
            <span className="hidden xs:inline sm:inline">Create Adjustment</span>
          </button>
        </div>
      </div>

      {/* Stat Cards — Open / Closed / Provisional */}
      <FinanceSetupStatCards stats={stats} />

      {/* Filters — FY · Organization · Search · Status · Apply */}
      <FinanceFilters value={draftFilters} onChange={setDraftFilters} onApply={applyFilters} />

      {/* Table + Activity Timeline */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <PeriodTable periods={filteredPeriods} />
        <FinanceActivityTimeline items={activity} />
      </div>
    </div>
  )
}
