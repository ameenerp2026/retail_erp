import { useState } from 'react'
import { RefreshCw, Lock, DollarSign } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import StatCards from '@/components/shared/StatCards'
import PeriodTable from '../components/FinanceMonths/FinanceTable'
import PeriodDetailPanel from '../components/FinanceMonths/FinanceDetailPanel'
import { financeService } from '@/services/financeService'
import type { FinancePeriod } from '@/types/finance'
import FilterBar from '@/components/shared/FilterBar'
import { usePeriodFilter } from '@/hooks/usePeriodFilter'
import { PERIOD_FILTER_FIELDS } from '@/config/filterConfig'
import { CARD_CONFIG } from '@/config/cardConfig'

export default function FinanceMonths() {
  // sidepanel state: which period is currently selected (if any)
  const [selectedPeriod, setSelectedPeriod] = useState<FinancePeriod | null>(null)
   const { data: periods = [], isLoading: periodsLoading } = useQuery({
    queryKey: ['finance-periods'],
    queryFn: financeService.getPeriods
  })
  //Filter state for the table
  const { filteredItems, setFilters } = usePeriodFilter(periods)
  // Fetch finance stats and periods using react-query
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: financeService.getStats
  })

  if (statsLoading || periodsLoading) {
    return <div className="p-6">Loading...</div>
  }
  console.log('stats',stats)
// const financeCards = stats.map((stat) => ({
//   id:          stat.id,
//   label:       stat.label,
//   count:       stat.count,
//   logo:        CARD_CONFIG[stat.type].logo,
//   logoBgColor: CARD_CONFIG[stat.type].logoBgColor,
// }))
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
      {/* //<StatCards cards={financeCards} /> */}

      {/* Filters */}
      <FilterBar fields={PERIOD_FILTER_FIELDS} onApply={setFilters} />

      {/* Table + Side Panel */}
      <div className="flex gap-4 w-full">

        {/* Table — takes all remaining space */}
        <div className="flex-1 min-w-0">
          <PeriodTable
            periods={filteredItems}
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