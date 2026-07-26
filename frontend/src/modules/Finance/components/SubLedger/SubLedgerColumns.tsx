import type { ColumnsType } from 'antd/es/table'
import { Building2, Pencil, Trash2, User } from 'lucide-react'
import StatusTag from '@/components/shared/StatusTags'
import type { SubLedger, SubLedgerRisk, SubLedgerType } from '@/types/subLedger'

const TYPE_STYLE: Record<SubLedgerType, { className: string; icon: typeof User }> = {
  Customer: { className: 'bg-blue-50 text-blue-700', icon: User },
  Vendor: { className: 'bg-teal-50 text-teal-700', icon: Building2 },
  Employee: { className: 'bg-violet-50 text-violet-700', icon: User },
}

const RISK_STYLE: Record<SubLedgerRisk, string> = {
  Low: 'text-emerald-600',
  Med: 'text-amber-600',
  High: 'text-rose-600',
}

const BAR_STYLE: Record<SubLedgerRisk, string> = {
  Low: 'bg-emerald-500',
  Med: 'bg-amber-500',
  High: 'bg-rose-500',
}

export function getSubLedgerColumns(): ColumnsType<SubLedger> {
  return [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (_text, record) => (
        <div>
          <p className="text-sm font-semibold text-[#043793]">{record.name}</p>
          <p className={`text-[11px] font-medium ${RISK_STYLE[record.risk]}`}>
            — {record.risk} Risk
          </p>
        </div>
      ),
    },
    {
      title: 'CODE',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => (
        <span className="text-sm font-medium text-[#06B6D4]">{text}</span>
      ),
    },
    {
      title: 'LINKED LEDGER',
      dataIndex: 'linkedLedger',
      key: 'linkedLedger',
      render: (text: string) => <span className="text-sm text-slate-500">{text}</span>,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      render: (type: SubLedgerType) => {
        const config = TYPE_STYLE[type]
        const Icon = config.icon
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
          >
            <Icon size={12} />
            {type}
          </span>
        )
      },
    },
    {
      title: 'OPENING BALANCE',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      render: (text: string) => (
        <span className="text-sm font-semibold text-[#043793]">{text}</span>
      ),
    },
    {
      title: 'CREDIT LIMIT',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      render: (_text, record) =>
        record.creditLimit ? (
          <div className="min-w-[72px]">
            <p className="text-sm font-semibold text-[#043793]">{record.creditLimit}</p>
            {record.creditUsagePct != null && (
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${BAR_STYLE[record.risk]}`}
                  style={{ width: `${record.creditUsagePct}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: SubLedger['status']) => <StatusTag status={status} />,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50">
            <Pencil size={14} />
          </button>
          <button type="button" className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]
}
