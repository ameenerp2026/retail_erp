import { AccountingYear, YearStatus } from '@/types/accounting'
import { Calendar } from 'lucide-react'

type Props = {
  year: AccountingYear
  isSelected: boolean
  onSelect: () => void
}

export default function YearListItem({ year, isSelected, onSelect }: Props) {
  const getStatusBadge = (status: YearStatus) => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        }
      case 'Closed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200/80',
          dot: 'bg-slate-500',
        }
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        }
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200/80',
          dot: 'bg-slate-400',
        }
    }
  }

  const getProgressColor = (status: YearStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-teal-500'
      case 'Closed':
        return 'bg-emerald-500'
      case 'Pending':
        return 'bg-slate-300'
      default:
        return 'bg-teal-500'
    }
  }

  const closed = year.closedPeriods ?? 0
  const total = year.totalPeriods ?? 12
  const progress = total > 0 ? (closed / total) * 100 : 0
  const badge = getStatusBadge(year.status)

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-4.5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-white border-[#043793] ring-2 ring-[#043793]/15 shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <p className="font-bold text-base text-[#043793] tracking-tight">{year.label}</p>
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {year.status}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3.5 flex items-center gap-1.5">
        <Calendar size={13} className="text-slate-400" />
        {year.dateRange}
      </p>

      <div className="space-y-1.5">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(year.status)} rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">{Math.round(progress)}% completed</span>
          <span className="font-semibold text-slate-600">
            {closed}/{total} closed
          </span>
        </div>
      </div>
    </div>
  )
}
