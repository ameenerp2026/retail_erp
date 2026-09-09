import { AccountingYear, YearStatus } from '@/types/accounting'

type Props = {
  year: AccountingYear
  isSelected: boolean
  onSelect: () => void
}

export default function YearListItem({ year, isSelected, onSelect }: Props) {
  const getStatusStyles = (status: YearStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200'
      case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-200'
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  const getProgressColor = (status: YearStatus) => {
    switch (status) {
      case 'Active':
      case 'Closed': return 'bg-teal-500'
      default: return 'bg-slate-300'
    }
  }

  // Guard the bar width: 0 periods gives NaN%, which the browser drops as invalid.
  const closed = year.closedPeriods ?? 0
  const total = year.totalPeriods ?? 0
  const progress = total > 0 ? Math.min(100, Math.max(0, (closed / total) * 100)) : 0

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full cursor-pointer rounded-xl border bg-white p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300
        ${isSelected ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200 hover:border-slate-300'}
      `}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="min-w-0 truncate font-semibold text-[#043793]">{year.label}</p>
        <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs ${getStatusStyles(year.status)}`}>
          {year.status}
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">{year.dateRange}</p>

      <div className="space-y-1.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${getProgressColor(year.status)} transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-slate-400">
          {closed}/{total} closed
        </p>
      </div>
    </button>
  )
}
