// PeriodColumns.tsx
import type { ColumnsType } from "antd/es/table"
import type { InventoryPeriod } from "@/types/inventory"
import StatusTag from "@/components/shared/StatusTags"
import { MoreHorizontal } from "lucide-react"
import { formatDate, formatDateTime } from "@/utils/dateFormat"

export function getInventoryColumns(
  onRowClick: (period: InventoryPeriod) => void,
  onHistoryClick: (period: InventoryPeriod) => void
): ColumnsType<InventoryPeriod> {
  return [
    {
      title: "PERIOD",
      dataIndex: "period",
      key: "period",
      sorter: false,
      render: (text, record) => (
        <button
          onClick={() => onRowClick(record)}
          className="text-[#043793] font-medium hover:underline"
        >
          {text}
        </button>
      ),
    },
    { title: "START DATE",     dataIndex: "startDate",    key: "startDate",    sorter: false,render: (text) => <span className="text-[#1A2332]">{formatDate(text)}</span> },
    { title: "END DATE",       dataIndex: "endDate",      key: "endDate",      sorter: false,render: (text) => <span className="text-[#1A2332]">{formatDate(text)}</span> },
    { title: "INV. STATUS",    dataIndex: "invStatus",    key: "invStatus",    sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "FIN. STATUS", dataIndex: "financeStatus",key: "financeStatus",sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "COGS STATUS",    dataIndex: "cogsStatus",   key: "cogsStatus",   sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "LAST MODIFIED",  dataIndex: "lastModified", key: "lastModified", sorter: false,render: (text) => <span className="text-[#1A2332]">{formatDateTime(text)}</span> },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      render: (record) => (
        <div className="flex items-center gap-3 shrink-0">
            <button 
                onClick={() => onHistoryClick(record)}
                className="gap-2 px-4 py-2 text-[#6B7A99] bg-[#EEF2F8] rounded-full hover:text-gray-600">
                History
            </button>
            <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
            </button>
        </div>
        
      ),
    },
  ]
}