import type { ColumnsType } from 'antd/es/table'
import { Pencil, Trash2, Layers } from 'lucide-react'
import ActiveInactiveBadge from '@/components/shared/ActiveInactiveBadge'
import ParentGroupBadge from '@/components/shared/ParentGroupBadge'
import type { AccountClassRecord } from '@/types/accountClass'

export function getAccountClassColumns(
  onEdit:   (record: AccountClassRecord) => void,
  onDelete: (record: AccountClassRecord) => void,
): ColumnsType<AccountClassRecord> {
  return [
    {
      title: "CLASS NAME",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {/* Colored icon */}
          <div className={`w-8 h-8 rounded-lg ${record.iconBgColor} flex items-center justify-center flex-shrink-0`}>
            <Layers size={14} className={`${record.iconColor}`} />
          </div>
          <div>
            <p className="text-[#043793] font-medium text-sm">{record.name}</p>
            <p className="text-[11px] text-[#9CA3AF] font-mono">{record.code}</p>
          </div>
        </div>
      ),
    },
    {
      title: "PARENT GROUP",
      dataIndex: "parentGroup",
      key: "parentGroup",
      render: (_, record) => (
        <ParentGroupBadge
          label={record.parentGroup}
          colorClass={record.parentGroupColor}
        />
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="text-sm text-[#6B7280] line-clamp-1">{text}</span>
      ),
    },
    {
      title: "LINKED LEDGERS",
      dataIndex: "linkedLedgers",
      key: "linkedLedgers",
      render: (count) => (
        <button className="text-[#0B4D8C] text-sm font-medium hover:underline">
          {count} ledgers
        </button>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => <ActiveInactiveBadge status={status} />,
    },
    {
      title: "LAST UPDATED",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (val) => <span className="text-sm text-[#9CA3AF]">{val}</span>,
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(record)}
            className="text-[#4FC3F7] hover:text-blue-500 transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(record)}
            className="text-[#CBD5E1] hover:text-red-500 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]
}