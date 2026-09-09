import { createPortal } from 'react-dom'
import { Period } from '@/types/accounting'
import { X, CheckCircle2, Clock, AlertCircle, Calendar, Hash, User, ShieldCheck } from 'lucide-react'

type Props = {
  period: Period | null
  onClose: () => void
}

export default function PeriodDetailModal({ period, onClose }: Props) {
  if (!period) return null

  const normalizedStatus = String(period.status || '').toLowerCase()

  const getStatusBanner = () => {
    switch (normalizedStatus) {
      case 'closed':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
          icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
        }
      case 'open':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-[#043793]',
          icon: <span className="h-3 w-3 rounded-full bg-[#043793] shrink-0 animate-pulse" />,
        }
      case 'provisional':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-900',
          icon: <Clock size={18} className="text-amber-600 shrink-0" />,
        }
      default:
        return {
          bg: 'bg-slate-100 border-slate-200',
          text: 'text-slate-700',
          icon: <AlertCircle size={18} className="text-slate-500 shrink-0" />,
        }
    }
  }

  const banner = getStatusBanner()

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="animate-fade-in fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="animate-slide-in-right fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-6 py-5 bg-slate-50/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#043793]">
              Period Details
            </h2>
            <p className="text-xs text-slate-400">
              {period.accountingYear} • {period.month} {period.year}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Status banner */}
          <div className={`flex items-center gap-3 rounded-xl border p-4 ${banner.bg}`}>
            {banner.icon}
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${banner.text}`}>
                {period.month} {period.year} — {period.status}
              </p>
              <p className="text-xs text-slate-500">
                Sequence {period.sequenceNumber}
              </p>
            </div>
            {period.isCurrentPeriod && (
              <span className="rounded-md bg-[#043793] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Current
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              General Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailCard label="Period Name" value={`${period.month} ${period.year}`} icon={<Calendar size={14} />} />
              <DetailCard label="Accounting Year" value={period.accountingYear} icon={<Calendar size={14} />} />
              <DetailCard label="Sequence" value={period.sequenceNumber} icon={<Hash size={14} />} />
              <DetailCard label="Status" value={period.status} icon={<ShieldCheck size={14} />} />
              <DetailCard label="Start Date" value={period.startDate} />
              <DetailCard label="End Date" value={period.endDate} />
              <DetailCard label="Current Period" value={period.isCurrentPeriod ? 'Yes' : 'No'} />
              <DetailCard label="Created By" value={period.createdBy ?? 'Admin'} icon={<User size={14} />} />
              <DetailCard label="Created On" value={period.createdOn ?? '—'} />
              <DetailCard label="Last Updated" value={period.updatedOn ?? '—'} />
            </div>
          </div>

          {/* Audit activity */}
          {period.auditLog && period.auditLog.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Audit Activity
                </span>
              </div>
              <ul className="space-y-2.5">
                {period.auditLog.map((event, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#043793]" />
                    <div className="min-w-0">
                      <div className="font-medium text-slate-700">{event.action}</div>
                      <div className="text-[11px] text-slate-400">
                        {event.by} • {event.date}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100 shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string
  value?: string | null
  icon?: React.ReactNode
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="truncate text-xs sm:text-sm font-semibold text-slate-800">
        {value || '—'}
      </div>
    </div>
  )
}
