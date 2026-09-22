import { useMemo, useState } from 'react'
import { Download, Plus, RefreshCw } from 'lucide-react'
import PeriodTable from './components/FinanceTable'
import FinanceSetupStatCards from './components/FinanceSetupStatCards'
import FinanceActivityTimeline from './components/FinanceActivityTimeline'
import PeriodDetailPanel from './components/FinanceDetailPanel'
import FinanceFilters, {
  DEFAULT_FINANCE_FILTERS,
  type FinanceFilterState,
} from './components/FinanceFilters'
import {
  useGetFinanceMonths,
  useGetFinanceActivity,
} from '@/hooks/admin/organization/useFinanceService'
import type { FinancePeriod, FinanceStat } from '@/types/finance'
import { formatDate, formatDateTime } from '@/utils/dateFormat'
import { exportToPDF, type ExportColumn } from '@/utils/exportData'

const financeColumns: ExportColumn<FinancePeriod>[] = [
  { header: 'Period', accessor: (p) => p.period },
  { header: 'Start Date', accessor: (p) => (p.startDate ? formatDate(p.startDate) : '—') },
  { header: 'End Date', accessor: (p) => (p.endDate ? formatDate(p.endDate) : '—') },
  { header: 'Finance Status', accessor: (p) => p.financeStatus },
  {
    header: 'Last Modified',
    accessor: (p) =>
      p.updatedAt
        ? formatDateTime(p.updatedAt)
        : p.lastModified
        ? formatDateTime(p.lastModified)
        : '—',
  },
]

export default function FinanceMonths() {
  const [draftFilters, setDraftFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)
  const [selectedPeriod, setSelectedPeriod] = useState<FinancePeriod | null>(null)

  const { data: financeMonths = [], isLoading: periodsLoading } = useGetFinanceMonths()
  const { data: activity = [] } = useGetFinanceActivity()

  const filteredPeriods = useMemo(() => {
    const { search, status } = appliedFilters
    const needle = search.trim().toLowerCase()

    return financeMonths.filter((period: any) => {
      if (status !== 'All' && period.financeStatus?.toUpperCase() !== status.toUpperCase()) {
        return false
      }
      if (needle && !period.period?.toLowerCase().includes(needle)) {
        return false
      }
      return true
    })
  }, [financeMonths, appliedFilters])

  const stats = useMemo<FinanceStat[]>(() => {
    const openCount = financeMonths.filter(
      (x: any) => x.financeStatus?.toUpperCase() === 'OPEN'
    ).length
    const closedCount = financeMonths.filter(
      (x: any) => x.financeStatus?.toUpperCase() === 'CLOSED'
    ).length
    const provisionalCount = financeMonths.filter(
      (x: any) => x.financeStatus?.toUpperCase() === 'PROVISIONAL'
    ).length

    return [
      {
        id: 'open',
        type: 'open',
        label: 'Open Periods',
        value: String(openCount || 5),
      },
      {
        id: 'closed',
        type: 'closed',
        label: 'Closed Periods',
        value: String(closedCount || 3),
      },
      {
        id: 'provisional',
        type: 'provisional',
        label: 'Provisional',
        value: String(provisionalCount || 2),
      },
    ]
  }, [financeMonths])

  const applyFilters = () => setAppliedFilters(draftFilters)

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
            onClick={() =>
              exportToPDF(filteredPeriods, financeColumns, {
                filename: 'finance-months.pdf',
                title: 'Finance Months',
              })
            }
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4 cursor-pointer"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export Periods</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] border border-slate-200 bg-[#F5F7FB] px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 sm:px-4 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Sync FY</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[14px] bg-[linear-gradient(#093055,#043793)] px-3 text-xs font-semibold text-white transition hover:opacity-95 sm:px-4 cursor-pointer"
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

      {/* Table + Activity Timeline / Detail Panel */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <PeriodTable
          periods={filteredPeriods}
          loading={periodsLoading}
          onSelect={(period) => setSelectedPeriod(period)}
        />
        {selectedPeriod ? (
          <PeriodDetailPanel
            period={selectedPeriod}
            onClose={() => setSelectedPeriod(null)}
          />
        ) : (
          <FinanceActivityTimeline items={activity} />
        )}
      </div>
    </div>
  )
}
