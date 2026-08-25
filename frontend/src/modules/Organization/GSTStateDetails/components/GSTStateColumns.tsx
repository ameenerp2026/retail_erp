// components/GSTStateDetails/GSTStateColumns.tsx
import type { ColumnsType } from 'antd/es/table'
import { ChevronRight } from 'lucide-react'
import YesNoBadge from '@/components/shared/YesNoBadge'
import SEZBadge from './SEZBadge'
import type { GSTStateRecord } from '@/types/gstState'

export function getGSTStateColumns(
  onView: (record: GSTStateRecord) => void,
  // onLinkedClick: (record: GSTStateRecord) => void,
  onToggleField: (record: GSTStateRecord, field: 'igst' | 'cgstSgst') => void
): ColumnsType<GSTStateRecord> {
 
  return [
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      width: 70,
      render: (code) => (
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
          {code}
        </div>
      ),
    },
    {
      title: "STATE NAME",
      dataIndex: "stateName",
      key: "stateName",
      render: (text) => (
        <span className="text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: "IGST",
      dataIndex: "igst",
      key: "igst",
      render: (val, record) => (
        <YesNoBadge value={val} onToggle={() => onToggleField(record, 'igst')} />
      ),
    },
    {
      title: "CGST + SGST",
      dataIndex: "cgstSgst",
      key: "cgstSgst",
      render: (val, record) => (
        <YesNoBadge value={val} onToggle={() => onToggleField(record, 'cgstSgst')} />
      ),
    },
    {
      title: "SEZ",
      dataIndex: "sez",
      key: "sez",
      render: (val) => <SEZBadge value={val} />,
    },
    {
      title: "LINKED STORES",
      dataIndex: "linkedGstins",
      key: "linkedGstins",
      render: (count, record) => (
        <button
          onClick={() => onView(record)}
          className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
        >
          {count}
          <ChevronRight size={14} />
        </button>
      ),
    },
    {
      title: "LAST UPDATED",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (val) => <span className="text-slate-400">{val}</span>,
    },
    {
      title: "CREATED BY",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (val) => <span className="text-slate-400">{val}</span>,
    },
    // {
    //   title: "ACTIONS",
    //   key: "actions",
    //   render: (_, record) => (
    //     <button
    //       onClick={() => onView(record)}
    //       className="text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-1.5 rounded-full font-medium transition"
    //     >
    //       View
    //     </button>
    //   ),
    // },
  ]
}
