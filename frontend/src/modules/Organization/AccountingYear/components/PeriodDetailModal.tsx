import { createPortal } from 'react-dom'
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
  if (!period) return null

  // Backend can send a status outside the union (e.g. "Provisional") — fall back instead of crashing.
  const style = statusStyles[period.status] ?? statusStyles.Pending

  return createPortal(
    <>
      {/* Backdrop — sits above the sidebar (z-50) so the whole app dims */}
      <div
        className="animate-fade-in fixed inset-0 z-[100] bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="animate-slide-in-right fixed inset-y-0 right-0 z-[101] flex w-full max-w-sm flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <h2 className="min-w-0 truncate font-semibold text-slate-800">
            Accounting Period Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg px-1 text-xl leading-none text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Status banner */}
          <div className={`flex items-center gap-2 rounded-lg px-4 py-3 ${style.bg} ${style.text}`}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/60 text-xs">
              {style.icon}
            </span>
            <span className="min-w-0 truncate font-medium">
              {period.month} {period.year} — {period.status}
            </span>
            <span className="ml-auto shrink-0 text-xs opacity-70">
              Sequence {period.sequenceNumber}
            </span>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <Detail label="Period Name" value={`${period.month} ${period.year}`} />
            <Detail label="Accounting Year" value={period.accountingYear} />
            <Detail label="Sequence Number" value={period.sequenceNumber} />
            <Detail label="Start Date" value={period.startDate} />
            <Detail label="End Date" value={period.endDate} />
            <Detail label="Is Current Period" value={period.isCurrentPeriod ? 'Yes' : 'No'} />
            <Detail label="Created By" value={period.createdBy} />
            <Detail label="Created On" value={period.createdOn} />
            <Detail label="Updated By" value={period.updatedBy} />
            <Detail label="Updated On" value={period.updatedOn} />
          </div>

          {/* Audit activity */}
          {period.auditLog && period.auditLog.length > 0 && (
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-wide text-slate-500">
                  RECENT AUDIT ACTIVITY
                </span>
                <button type="button" className="shrink-0 cursor-pointer text-xs font-medium text-[#043793]">
                  View All
                </button>
              </div>
              <ul className="space-y-3">
                {period.auditLog.map((event, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <div className="min-w-0">
                      <div className="break-words text-slate-700">{event.action}</div>
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
    </>,
    document.body
  )
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <div className="mb-0.5 text-xs text-slate-400">{label}</div>
      <div className="break-words font-medium text-slate-800">{value || '—'}</div>
    </div>
  )
}
