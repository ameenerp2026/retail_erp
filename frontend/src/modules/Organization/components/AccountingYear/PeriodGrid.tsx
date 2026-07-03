import { AccountingYear, Period } from '@/types/accounting'
import PeriodCard from './PeriodCard'

type Props = {
  year: AccountingYear
  periods: Period[]
  onGenerate: () => void
}

export default function PeriodGrid({ year, periods, onGenerate }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-semibold text-[#043793]">
            {year.label} — Period Grid
          </h2>
          <p className="text-sm text-slate-400">{year.dateRange}</p>
        </div>
        <button 
          onClick={onGenerate}
          className="text-sm font-medium text-[#043793] border border-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-2 bg-blue-50"
        >
          <span>▶</span> Generate Periods
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {periods.map((period) => (
          <PeriodCard key={period.month} period={period} />
        ))}
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span>Open / Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  )
}