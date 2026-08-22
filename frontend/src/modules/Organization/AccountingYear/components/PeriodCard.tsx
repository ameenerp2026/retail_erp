import { Period } from '@/types/accounting'



type Props = {
  period: Period
  onClick?: () => void
}


export default function PeriodCard({ period, onClick }: Props) {
  const getCardStyles = () => {
    if (period.status === 'Closed') return 'bg-green-50 border-green-200 text-green-600'
    if (period.status === 'Open') return 'bg-blue-50 border-blue-200 text-blue-600' 
    return 'bg-white border-slate-200 text-slate-500'
  }

  return (
    <div 
      className={`w-full h-24 border rounded-xl p-4 flex flex-col items-center justify-center ${getCardStyles()}`}
      onClick={onClick}
    >
      <p className="text-sm font-semibold text-[#043793] mb-1">{period.month}</p>
      <p className="text-xs text-slate-400 mb-2">{period.year}</p>
      
      <div className="flex flex-col items-center gap-1 text-xs font-medium">
        {period.status === 'Closed' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {period.status === 'Open' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
        {period.status === 'Pending' && <div className="w-2 h-2 rounded-full bg-slate-400" />}
        <span>{period.status}</span>
      </div>
    </div>
  )
}