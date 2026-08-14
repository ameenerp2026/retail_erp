// components/GSTINManagement/GSTINColumns.tsx
import type { ColumnsType } from 'antd/es/table'
import StatusTag from '@/components/shared/StatusTags'
import type { GSTINRecord } from '@/types/gstin'

export function getGSTINColumns(
  onReVerify: (record: GSTINRecord) => void
): ColumnsType<GSTINRecord> {
  return [
    {
      title: "GSTIN",
      dataIndex: "gstin",
      key: "gstin",
      render: (text) => <span className="text-[#4FC3F7] font-medium">{text}</span>,
    },
    { title: "STATE",    dataIndex: "state",   key: "state"   },
    { title: "ORG UNIT", dataIndex: ["organizationUnit", "organizationUnit"], key: "organizationUnit" },
    {
      title: "TYPE",
      dataIndex: "registrationType",
      key: "registrationType",
      render: (type) => (
        <span className="rounded-full text-[#4FC3F7] bg-[#4FC3F71A] text-xs">{type}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusTag status={status} variant="icon" />,
    },
    {
      title: "LAST VERIFIED",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) => (
        <span className="text-[#94A3B8]"> {val
        ? new Date(val).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "—"}</span>
      ),
    },
     { title: "Created By", dataIndex: ["createdBy", "name"], key: "createdBy" },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_: unknown, record) => (
        <button
          type="button"
          onClick={() => onReVerify(record)}
          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#4FC3F7] hover:bg-[#4FC3F71A]"
        >
          Re-verify
        </button>
      ),
    },
  ]
}