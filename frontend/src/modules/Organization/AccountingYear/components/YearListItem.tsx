import { AccountingYear, YearStatus } from '@/types/accounting'

type Props = {
  year: AccountingYear
  isSelected: boolean
  onSelect: () => void
}

export default function YearListItem({ year, isSelected, onSelect }: Props) {
  const getStatusStyles = (status: YearStatus) => {
    switch(status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200'
      case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-200' 
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const getProgressColor = (status: YearStatus) => {
    switch(status) {
      case 'Active': return 'bg-teal-500'
      case 'Closed': return 'bg-teal-500'
      case 'Pending': return 'bg-slate-300'
    }
  }

  const progress = (year.closedPeriods / year.totalPeriods) * 100

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all
        ${isSelected? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200 hover:border-slate-300'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="font-semibold text-[#043793]">{year.label}</p>
        <span className={`text-xs px-2 py-0.5 rounded-md border ${getStatusStyles(year.status)}`}>
          {year.status}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{year.dateRange}</p>
      
      <div className="space-y-1.5">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor(year.status)} transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 text-right">
          {year.closedPeriods}/{year.totalPeriods} closed
        </p>
      </div>
    </div>
  )
}