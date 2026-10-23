import { AccountingYear, Period } from '@/types/accounting'
import PeriodCard from './PeriodCard'
import { CalendarDays} from 'lucide-react'

type Props = {
  year: AccountingYear
  periods: Period[]
  onPeriodClick?: (period: Period) => void
}

export default function PeriodGrid({ year, periods, onPeriodClick }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#043793]">
              {year.label} — Period Grid
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <CalendarDays size={13} className="text-slate-400" />
            {year.dateRange}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 mb-6">
        {periods.map((period) => (
          <PeriodCard
            key={period.month}
            period={period}
            onClick={() => onPeriodClick?.(period)}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100" />
          <span>Open / Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-slate-100" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  )
}