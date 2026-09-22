import type { ColumnsType } from 'antd/es/table'
import type { FinancePeriod } from '@/types/finance'
import { formatDate, formatDateTime } from '@/utils/dateFormat'
import StatusTag, { type StatusType } from '@/components/shared/StatusTags'

type ColumnOptions = {
  onSelect?: (period: FinancePeriod) => void
}

function normalizeStatus(status?: string): StatusType {
  if (!status) return 'Open'
  const cap = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  if (cap === 'Open' || cap === 'Closed' || cap === 'Provisional') {
    return cap
  }
  return 'Open'
}

export function getFinanceSetupColumns({ onSelect }: ColumnOptions = {}): ColumnsType<FinancePeriod> {
  return [
    {
      title: 'PERIOD',
      dataIndex: 'period',
      key: 'period',
      sorter: (a, b) => a.period.localeCompare(b.period),
      render: (_text, record) => (
        <button
          type="button"
          onClick={() => onSelect?.(record)}
          className="text-sm font-semibold text-[#043793] hover:underline cursor-pointer"
        >
          {record.period}
        </button>
      ),
    },
    {
      title: 'START DATE',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''),
      render: (text: string) => <span className="text-sm text-[#1A2332]">{formatDate(text)}</span>,
    },
    {
      title: 'END DATE',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => (a.endDate ?? '').localeCompare(b.endDate ?? ''),
      render: (text: string) => <span className="text-sm text-[#1A2332]">{formatDate(text)}</span>,
    },
    {
      title: 'FINANCE STATUS',
      dataIndex: 'financeStatus',
      key: 'financeStatus',
      sorter: (a, b) => (a.financeStatus ?? '').localeCompare(b.financeStatus ?? ''),
      render: (status: string) => (
        <StatusTag status={normalizeStatus(status)} variant="dot" />
      ),
    },
    {
      title: 'LAST MODIFIED',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => (a.updatedAt ?? a.lastModified ?? '').localeCompare(b.updatedAt ?? b.lastModified ?? ''),
      render: (text: string, record) => (
        <span className="text-sm text-[#1A2332]">
          {formatDateTime(text || record.lastModified || '')}
        </span>
      ),
    },
  ]
}
