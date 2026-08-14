import { Building2, Pencil, Trash2, User } from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import type { SubLedger, SubLedgerRisk, SubLedgerType } from '@/types/subLedger'

const TYPE_STYLE: Record<SubLedgerType, { className: string; icon: typeof User }> = {
  Customer: { className: 'bg-blue-50 text-blue-700', icon: User },
  Vendor: { className: 'bg-teal-50 text-teal-700', icon: Building2 },
  Employee: { className: 'bg-violet-50 text-violet-700', icon: User },
}

const RISK_LABEL: Record<SubLedgerRisk, string> = {
  Low: 'Low Risk — Within safe limits',
  Med: 'Medium Risk — Approaching limit',
  High: 'High Risk — Near or over limit',
}

const RISK_DOT: Record<SubLedgerRisk, string> = {
  Low: 'bg-emerald-500',
  Med: 'bg-amber-500',
  High: 'bg-rose-500',
}

const BAR_STYLE: Record<SubLedgerRisk, string> = {
  Low: 'bg-emerald-500',
  Med: 'bg-amber-500',
  High: 'bg-rose-500',
}

type SubLedgerDetailDrawerProps = {
  isOpen: boolean
  onClose: () => void
  subLedger: SubLedger | null
  onEdit?: (row: SubLedger) => void
  onDelete?: (row: SubLedger) => void
}

export default function SubLedgerDetailDrawer({
  isOpen,
  onClose,
  subLedger,
  onEdit,
  onDelete,
}: SubLedgerDetailDrawerProps) {
  if (!subLedger) return null

  const config = TYPE_STYLE[subLedger.type]
  const Icon = config.icon

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#043793]">{subLedger.name}</h2>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-[#06B6D4]">{subLedger.code}</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
          >
            <Icon size={12} />
            {subLedger.type}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <p className="text-[11px] font-medium text-slate-400">Linked Ledger</p>
          <p className="mt-1 text-sm font-semibold text-[#043793]">{subLedger.linkedLedger}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <p className="text-[11px] font-medium text-slate-400">Opening Balance</p>
          <p className="mt-1 text-sm font-semibold text-[#043793]">{subLedger.openingBalance}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <p className="text-[11px] font-medium text-slate-400">Credit Limit</p>
          <p className="mt-1 text-sm font-semibold text-[#043793]">
            {subLedger.creditLimit ?? '—'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <p className="text-[11px] font-medium text-slate-400">Balance Type</p>
          <p className="mt-1 text-sm font-semibold text-[#043793]">{subLedger.balanceType}</p>
        </div>
      </div>

      {/* Credit exposure */}
      {subLedger.creditLimit && subLedger.creditUsagePct != null && (
        <div className="mt-4 rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Credit Exposure</p>
            <p className="text-xs font-semibold text-slate-500">
              {subLedger.creditUsagePct}% utilized
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${BAR_STYLE[subLedger.risk]}`}
              style={{ width: `${subLedger.creditUsagePct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{subLedger.openingBalance} used</span>
            <span>{subLedger.creditLimit} limit</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${RISK_DOT[subLedger.risk]}`} />
            <span className="text-[11px] font-medium text-slate-500">
              {RISK_LABEL[subLedger.risk]}
            </span>
          </div>
        </div>
      )}

      {/* Recent transactions — placeholder until a transactions API exists */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-slate-600">Recent Transactions</p>
        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-400">
            Transaction history isn't wired up yet — this needs a ledger entries API.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => onEdit?.(subLedger)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(subLedger)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </Drawer>
  )
}