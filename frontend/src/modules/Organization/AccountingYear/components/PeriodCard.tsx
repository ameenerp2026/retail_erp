import { Period } from '@/types/accounting'
import { CheckCircle2 } from 'lucide-react'

export default function PeriodCard({ period }: { period: Period }) {
  const getCardStyles = () => {
    switch (period.status) {
      case 'Closed':
        return 'bg-emerald-50/70 border-emerald-200/80 text-emerald-700 hover:border-emerald-300'
      case 'Open':
        return 'bg-blue-50/80 border-blue-200 text-blue-700 ring-1 ring-blue-200 hover:border-blue-300 shadow-2xs'
      case 'Pending':
      default:
        return 'bg-slate-50/60 border-slate-200/80 text-slate-500 hover:border-slate-300'
    }
  }

  const getStatusContent = () => {
    switch (period.status) {
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={13} className="stroke-[2.5]" />
            Closed
          </span>
        )
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Open
          </span>
        )
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Pending
          </span>
        )
    }
  }

  return (
    <div
      className={`w-full min-h-[96px] border rounded-xl p-3.5 flex flex-col items-center justify-between text-center transition-all duration-150 ${getCardStyles()}`}
    >
      <div>
        <p className="text-sm font-bold text-[#043793]">{period.month}</p>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{period.year}</p>
      </div>

      <div className="mt-2">
        {getStatusContent()}
      </div>
    </div>
  )
}
