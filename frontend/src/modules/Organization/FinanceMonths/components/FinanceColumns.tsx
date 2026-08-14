import type { ColumnsType } from 'antd/es/table'
import type { FinancePeriod } from '@/types/finance'
import StatusTag from '@/components/shared/StatusTags'
import { formatDate, formatDateTime } from "@/utils/dateFormat";
type ColumnOptions = {
  onSelect?: (period: FinancePeriod) => void
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
          className="text-sm font-semibold text-[#043793] hover:underline"
        >
          {record.period}
        </button>
      ),
    },
    {
      title: 'START DATE',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      render: (text: string) => <span className="text-sm text-[#1A2332]">{formatDate(text)}</span>
    //  render: (text) => <span className="text-sm text-[#1A2332]">{text}</span>,
    },
    {
      title: 'END DATE',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
     render: (text: string) => <span className="text-sm text-[#1A2332]">{formatDate(text)}</span>
    },
    // {
    //   title: 'FINANCE STATUS',
    //   dataIndex: 'financeStatus',
    //   key: 'financeStatus',
    //   sorter: (a, b) => a.financeStatus.localeCompare(b.financeStatus),
    //   render: (status: FinancePeriod['financeStatus']) => (
    //     <StatusTag status={status} variant="dot" />
    //   ),
    // },
    {
      title: 'LAST MODIFIED',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => (a.updatedAt ?? '').localeCompare(b.updatedAt ?? ''),
     render: (text: string) => <span className="text-sm text-[#1A2332]">{formatDateTime(text)}</span>
    },
  ]
}
