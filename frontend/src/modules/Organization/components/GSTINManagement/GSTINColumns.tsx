// components/GSTINManagement/GSTINColumns.tsx
import type { ColumnsType } from 'antd/es/table'
import { RotateCw } from 'lucide-react'
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
    { title: "ORG UNIT", dataIndex: "orgUnit", key: "orgUnit" },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
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
      dataIndex: "lastVerified",
      key: "lastVerified",
      render: (val) => (
        <span className="text-[#94A3B8]">{val ?? "—"}</span>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <button
          onClick={() => onReVerify(record)}
          className="flex items-center gap-1.5 text-xs text-[#21B6A8] bg-[#21B6A81A] hover:bg-[#21B6A81A] px-3 py-1.5 rounded-full transition"
        >
          <RotateCw size={12} />
          Re-verify
        </button>
      ),
    },
  ]
}