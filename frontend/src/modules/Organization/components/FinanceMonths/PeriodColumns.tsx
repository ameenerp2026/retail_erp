// PeriodColumns.tsx
import type { ColumnsType } from "antd/es/table"
import type { FinancePeriod } from "@/types/finance"
import StatusTag from "./StatusTags"
import { MoreHorizontal } from "lucide-react"

export function getPeriodColumns(
  onRowClick: (period: FinancePeriod) => void
): ColumnsType<FinancePeriod> {
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
    { title: "START DATE",     dataIndex: "startDate",    key: "startDate",    sorter: false,render: (text) => <span className="text-[#1A2332]">{text}</span> },
    { title: "END DATE",       dataIndex: "endDate",      key: "endDate",      sorter: false,render: (text) => <span className="text-[#1A2332]">{text}</span> },
    { title: "FINANCE STATUS", dataIndex: "financeStatus",key: "financeStatus",sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "INV. STATUS",    dataIndex: "invStatus",    key: "invStatus",    sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "COGS STATUS",    dataIndex: "cogsStatus",   key: "cogsStatus",   sorter: false, render: (s) => <StatusTag status={s} /> },
    { title: "LAST MODIFIED",  dataIndex: "lastModified", key: "lastModified", sorter: false,render: (text) => <span className="text-[#1A2332]">{text}</span> },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      render: () => (
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      ),
    },
  ]
}