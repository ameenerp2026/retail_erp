import { Period, PeriodStatus } from '@/types/accounting'

type Props = {
  period: Period | null
  onClose: () => void
}

const statusStyles: Record<PeriodStatus, { bg: string; text: string; icon: string }> = {
  Closed: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  Open: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '●' },
  Pending: { bg: 'bg-slate-100', text: 'text-slate-500', icon: '○' },
}

export default function PeriodDetailModal({ period, onClose }: Props) {
    console.log('PeriodDetailModal',period)
  if (!period) return null

  const style = statusStyles[period.status]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Accounting Period Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Status banner */}
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 ${style.bg} ${style.text}`}>
            <span className="w-5 h-5 rounded-full bg-white/60 flex items-center justify-center text-xs">
              {style.icon}
            </span>
            <span className="font-medium">
              {period.month} {period.year} — {period.status}
            </span>
            <span className="ml-auto text-xs opacity-70">Sequence {period.sequenceNumber}</span>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <Detail label="Period Name" value={`${period.month} ${period.year}`} />
            <Detail label="Accounting Year" value={period.accountingYear} />
            <Detail label="Sequence Number" value={period.sequenceNumber} />
            <Detail label="Start Date" value={period.startDate} />
            <Detail label="End Date" value={period.endDate} />
            <Detail label="Is Current Period" value={period.isCurrentPeriod ? 'Yes' : 'No'} />
            <Detail label="Created By" value={period.createdBy??'-'} />
            <Detail label="Created On" value={period.createdOn??'-'} />
            <Detail label="Updated By" value={period.updatedBy??'-'} />
            <Detail label="Updated On" value={period.updatedOn??'-'} />
          </div>

          {/* Audit activity */}
          {period.auditLog && period.auditLog.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-500 tracking-wide">
                  RECENT AUDIT ACTIVITY
                </span>
                <button className="text-xs font-medium text-[#043793]">View All</button>
              </div>
              <ul className="space-y-3">
                {period.auditLog.map((event, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <div className="text-slate-700">{event.action}</div>
                      <div className="text-xs text-slate-400">
                        {event.by} · {event.date}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-slate-400 text-xs mb-0.5">{label}</div>
      <div className="text-slate-800 font-medium">{value}</div>
    </div>
  )
}