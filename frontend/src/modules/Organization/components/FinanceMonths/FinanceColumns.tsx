import type { ColumnsType } from 'antd/es/table'
import type { FinancePeriod } from '@/types/finance'
import StatusTag from '@/components/shared/StatusTags'
import { MoreVertical } from 'lucide-react'

const MAX_TXNS = 4500

export function getFinanceSetupColumns(): ColumnsType<FinancePeriod> {
  return [
    {
      title: 'PERIOD NAME',
      dataIndex: 'period',
      key: 'period',
      render: (_text, record) => (
        <div className="min-w-[100px]">
          <p className="text-sm font-semibold text-[#043793]">{record.period}</p>
          <p className="text-[11px] text-slate-400">ID: {record.periodId}</p>
        </div>
      ),
    },
    {
      title: 'START DATE',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => <span className="text-sm text-[#1A2332]">{text}</span>,
    },
    {
      title: 'END DATE',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => <span className="text-sm text-[#1A2332]">{text}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'financeStatus',
      key: 'financeStatus',
      render: (status: FinancePeriod['financeStatus']) => (
        <StatusTag status={status} variant="icon" />
      ),
    },
    {
      title: 'TRANSACTIONS',
      dataIndex: 'transactions',
      key: 'transactions',
      render: (count: number) => {
        const pct = Math.min(100, Math.round((count / MAX_TXNS) * 100))
        return (
          <div className="min-w-[88px]">
            <p className="text-sm font-medium text-[#043793]">
              {count > 0 ? count.toLocaleString() : '—'}
            </p>
            {count > 0 && (
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#3B82F6]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: 'LAST CLOSED BY',
      dataIndex: 'lastClosedBy',
      key: 'lastClosedBy',
      render: (name: string | null) => (
        <span className="text-sm text-[#1A2332]">{name ?? '—'}</span>
      ),
    },
    {
      title: 'LAST UPDATED',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text) => <span className="text-sm text-[#1A2332]">{text}</span>,
    },
    {
      title: 'ACTIONS',
      key: 'action',
      width: 64,
      align: 'center',
      render: () => (
        <button
          type="button"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Row actions"
        >
          <MoreVertical size={16} />
        </button>
      ),
    },
  ]
}
