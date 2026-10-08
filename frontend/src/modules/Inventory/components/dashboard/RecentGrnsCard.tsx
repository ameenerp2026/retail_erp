import type { RecentGrn, GrnStatus } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

const STATUS_STYLES: Record<GrnStatus, { dot: string; text: string; bg: string }> = {
  Completed: { dot: 'bg-[#00BC7D]', text: 'text-[#007A55]', bg: 'bg-[#ECFDF5]' },
  'Under QC': { dot: 'bg-[#2B7FFF]', text: 'text-[#1447E6]', bg: 'bg-[#EFF6FF]' },
  'Pending QC': { dot: 'bg-[#FF8904]', text: 'text-[#CA3500]', bg: 'bg-[#FFF7ED]' },
}

function StatusPill({ status }: { status: GrnStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 ${s.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      <span className={`text-[11px] font-medium ${s.text}`}>{status}</span>
    </span>
  )
}

/** Latest goods receipts: GRN id, status pill, vendor, location · items · value. */
export default function RecentGrnsCard({ items }: { items: RecentGrn[] }) {
  return (
    <DashboardCard
      title="Recent GRNs"
      action={
        <button type="button" className="text-xs font-medium text-[#155DFC] hover:underline">
          View all
        </button>
      }
    >
      <div className="divide-y divide-slate-100">
        {items.map((grn) => (
          <div key={grn.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-[13px] font-bold text-[#155DFC]">{grn.grnNo}</span>
                <StatusPill status={grn.status} />
              </div>
              <span className="shrink-0 text-[11px] text-slate-400">{grn.timeLabel}</span>
            </div>
            <p className="mt-1 truncate text-[13px] font-medium text-[#314158]">{grn.vendor}</p>
            <p className="mt-0.5 text-xs text-slate-400">{grn.location}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
