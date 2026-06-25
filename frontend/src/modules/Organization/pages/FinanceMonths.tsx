import { useMemo, useState } from 'react'
import { RefreshCw, Lock, DollarSign } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatCards } from '../components/FinanceMonths/StatCards'
import PeriodTable from '../components/FinanceMonths/PeriodTable'
import PeriodDetailPanel from '../components/FinanceMonths/PeriodDetailPanel'
import { financeService } from '@/services/financeService'
import type { FinancePeriod } from '@/types/finance'
import FilterBar from '@/components/shared/FilterBar'

// FinanceMonths.tsx — main page component
const filterFields = [
  { key: "fy",           placeholder: "FY 2025 26",     width: "120px" },
  { key: "organization", placeholder: "Organization",    width: "150px" },
  { key: "month",        placeholder: "Search month...", width: "150px" },
  { key: "status",       placeholder: "All Status",      width: "140px" },
]

export default function FinanceMonths() {
  // sidepanel state: which period is currently selected (if any)
  const [selectedPeriod, setSelectedPeriod] = useState<FinancePeriod | null>(null)
  //Filter state for the table
  const [filters, setFilters] = useState<Record<string, string>>({})
  // Fetch finance stats and periods using react-query
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: financeService.getStats
  })

  const { data: periods = [], isLoading: periodsLoading } = useQuery({
    queryKey: ['finance-periods'],
    queryFn: financeService.getPeriods
  })
    // Filtered data based on the current filters
  const filteredData = useMemo(() => {
      return periods.filter((item) => {
        if (filters.fy && !item.period.toLowerCase().includes(filters.fy.toLowerCase())) return false
        if (filters.month && !item.period.toLowerCase().includes(filters.month.toLowerCase())) return false
        if (filters.status &&
          !item.financeStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
          !item.invStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
          !item.cogsStatus.toLowerCase().includes(filters.status.toLowerCase())
        ) return false
        return true
      })
  }, [filters, periods])

  if (statsLoading || periodsLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] text-[#043793] font-bold">Finance Months</h1>
          <p className="text-sm text-gray-500 mt-1 sm:whitespace-nowrap">
            Manage and monitor finance period status across all organization units
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 bg-white rounded-full hover:bg-gray-50 text-[#1A2332]">
            <RefreshCw size={12} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 bg-white rounded-full hover:bg-gray-50 text-[#1A2332]">
            <Lock size={12} /> Close Period
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[#043793] text-white rounded-full">
            <DollarSign size={12} /> Open Finance Period
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards stats={stats} />

      {/* Filters */}
      <FilterBar fields={filterFields} onApply={setFilters} />

      {/* Table + Side Panel */}
      <div className="flex gap-4 w-full">

        {/* Table — takes all remaining space */}
        <div className="flex-1 min-w-0">
          <PeriodTable
            periods={filteredData}
            onRowClick={setSelectedPeriod}  // ← clicking a row sets selectedPeriod
          />
        </div>

        {/* Side panel — only renders when a row is clicked */}
        {selectedPeriod && (
          <div className="w-[320px] flex-shrink-0 max-h-[calc(100vh-100px)] overflow-y-auto">
            <PeriodDetailPanel
              period={selectedPeriod}
              onClose={() => setSelectedPeriod(null)}
            />
          </div>
      )}
      </div>
    </div>
  )
}