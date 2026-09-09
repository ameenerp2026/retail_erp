import { useMemo, useState } from 'react'
import { Download, Plus, RefreshCw } from 'lucide-react'
import PeriodTable from './components/FinanceTable'
import FinanceSetupStatCards from './components/FinanceSetupStatCards'
import FinanceFilters, {
  DEFAULT_FINANCE_FILTERS,
  type FinanceFilterState,
} from './components/FinanceFilters'
import { useGetFinanceMonths } from '@/hooks/admin/organization/useFinanceService'
import type { FinancePeriod, FinanceStat } from "@/types/finance";
import { formatDate, formatDateTime } from "@/utils/dateFormat";
import { exportToPDF, ExportColumn } from '@/utils/exportData';

const financeColumns: ExportColumn<FinancePeriod>[] = [
  { header: 'Period', accessor: (p) => p.period },
  { header: 'Start Date', accessor: (p) => (p.startDate ? formatDate(p.startDate) : '—') },
  { header: 'End Date', accessor: (p) => (p.endDate ? formatDate(p.endDate) : '—') },
  { header: 'Finance Status', accessor: (p) => p.financeStatus },
  { header: 'Last Modified', accessor: (p) => (p.updatedAt ? formatDateTime(p.updatedAt) : '—') },
]

export default function FinanceMonths() {
  // Draft filters (edited in the UI) vs. applied filters (committed on "Apply Filters")
  const [draftFilters, setDraftFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<FinanceFilterState>(DEFAULT_FINANCE_FILTERS)

 const {
  data: financeMonths = [],
} = useGetFinanceMonths();


  const filteredPeriods = useMemo(() => {
    const { search, status } = appliedFilters
    const needle = search.trim().toLowerCase()

    return financeMonths.filter((period: any) => {
      if (status !== 'All' && period.financeStatus !== status) return false
      if (needle && !period.period.toLowerCase().includes(needle)) return false
      return true
    })
  }, [financeMonths, appliedFilters])

const stats = useMemo<FinanceStat[]>(() => [
  {
    id: "open",
    type: "open",
    label: "Open",
    value: String(
      financeMonths.filter(
        (x: any) => x.financeStatus === "OPEN"
      ).length
    ),
  },
  {
    id: "closed",
    type: "closed",
    label: "Closed",
    value: String(
      financeMonths.filter(
        (x: any) => x.financeStatus === "CLOSED"
      ).length
    ),
  },
  {
    id: "provisional",
    type: "provisional",
    label: "Provisional",
    value: String(
      financeMonths.filter(
        (x: any) => x.financeStatus === "PROVISIONAL"
      ).length
    ),
  },
], [financeMonths]);


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
       {/* // <FinanceActivityTimeline items={activity} /> */}
      </div>
    </div>
  )
}
