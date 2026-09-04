import { AccountingYear, Period } from '@/types/accounting'
import PeriodCard from './PeriodCard'
import PeriodDetailModal from './PeriodDetailModal'
import { useState } from 'react'
import { Play } from 'lucide-react'

type Props = {
  year: AccountingYear
  periods: Period[]
  onGenerate: () => void
}

export default function PeriodGrid({ year, periods, onGenerate }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)

  return (
    <div className="section-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-[#043793]">
            {year.label} — Period Grid
          </h2>
          <p className="text-sm text-slate-400">{year.dateRange}</p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start whitespace-nowrap rounded-lg border border-slate-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#043793] transition hover:bg-blue-100"
        >
          <Play size={14} /> Generate Periods
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {periods.map((period) => (
          <PeriodCard
            key={period.month}
            period={period}
            onClick={() => setSelectedPeriod(period)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Closed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Open / Current
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          Pending
        </span>
      </div>

      <PeriodDetailModal period={selectedPeriod} onClose={() => setSelectedPeriod(null)} />
    </div>
  )
}
