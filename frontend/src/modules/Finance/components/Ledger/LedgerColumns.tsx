// components/Ledger/LedgerColumns.tsx
import type { ColumnsType } from 'antd/es/table'
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react'
import StatusTag from '@/components/shared/StatusTags'
import type { Ledger, LedgerAccountGroup } from '@/types/ledger'

const GROUP_PILL: Record<LedgerAccountGroup, string> = {
  Assets: 'bg-blue-50 text-blue-700',
  Liabilities: 'bg-rose-50 text-rose-700',
  Income: 'bg-emerald-50 text-emerald-700',
  Expenses: 'bg-amber-50 text-amber-700',
}

type GetLedgerColumnsArgs = {
  onEdit?: (ledger: Ledger) => void
  onDelete?: (ledger: Ledger) => void
}

export function getLedgerColumns({ onEdit, onDelete }: GetLedgerColumnsArgs = {}): ColumnsType<Ledger> {
  return [
    {
      title: 'LEDGER ID',
      dataIndex: 'ledgerId',
      key: 'ledgerId',
      render: (text: string) => (
        <span className="text-sm font-medium text-[#3B82F6]">{text}</span>
      ),
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span className="text-sm font-semibold text-[#043793]">{text}</span>
      ),
    },
    {
      title: 'CLASS',
      dataIndex: 'accountClass',
      key: 'accountClass',
      render: (accountClass: { id: number; className: string } | null) => (
        <span className="text-sm text-slate-600">{accountClass?.className ?? '-'}</span>
      ),
    },
    {
      title: 'ACCOUNT GROUP',
      dataIndex: 'accountGroup',
      key: 'accountGroup',
      render: (group: LedgerAccountGroup) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${GROUP_PILL[group] ?? 'bg-slate-50 text-slate-600'}`}>
          {group}
        </span>
      ),
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
      title: 'TYPE',
      dataIndex: 'balanceType',
      key: 'balanceType',
      render: (type: Ledger['balanceType']) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            type === 'Debit'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {type}
        </span>
      ),
    },
    {
      title: 'GST',
      dataIndex: 'gstEnabled',
      key: 'gstEnabled',
      render: (enabled: boolean) =>
        enabled ? (
          <CheckCircle2 size={16} className="text-emerald-500" />
        ) : (
          <XCircle size={16} className="text-slate-300" />
        ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: Ledger['status']) => <StatusTag status={status} />,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: unknown, record: Ledger) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(record)}
            className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(record)}
            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]
}