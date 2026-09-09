import { Period } from '@/types/accounting'

type Props = {
  period: Period
  onClick?: () => void
}

export default function PeriodCard({ period, onClick }: Props) {
  const getCardStyles = () => {
    if (period.status === 'Closed') return 'bg-green-50 border-green-200 text-green-600 hover:border-green-300'
    if (period.status === 'Open') return 'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-300'
    return 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#043793]/30 ${getCardStyles()}`}
    >
      <p className="text-sm font-semibold text-[#043793]">{period.month}</p>
      <p className="mb-1.5 text-xs text-slate-400">{period.year}</p>

      <span className="flex items-center gap-1 text-xs font-medium">
        {period.status === 'Closed' && (
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {period.status === 'Open' && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
        {period.status === 'Pending' && <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />}
        {period.status}
      </span>
    </button>
  )
}
