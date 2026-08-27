import { useQuery } from '@tanstack/react-query'
import ReusableTable from '@/components/shared/ReusableTable'
import RunStatCard from '@/components/shared/RunStatCard'
import StatusTag from '@/components/shared/StatusTags'
import { inventoryService } from '@/services/inventoryService'
import type { UnpostedDocument } from '@/types/inventory'
import type { ColumnsType } from 'antd/es/table/interface'
import { AlertTriangle, ShoppingCart, LucideCuboid, MapPin, Download, Eye, Send } from 'lucide-react'
import { exportToPDF, ExportColumn } from '@/utils/exportData'

const columns: ColumnsType<UnpostedDocument> = [
  {
    title: 'SITE',
    dataIndex: 'site',
    key: 'site',
    render: (site: string) => (
      <div className="flex items-center gap-1.5">
        <MapPin size={14} className="text-[#6B7280]" />
        <span>{site}</span>
      </div>
    ),
  },
  { title: 'ENTRY TYPE', dataIndex: 'entryType', key: 'entryType' },
  { title: 'DOCUMENT NUMBER', dataIndex: 'documentNumber', key: 'documentNumber' },
  { title: 'DOCUMENT DATE', dataIndex: 'documentDate', key: 'documentDate' },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusTag status={status} />,
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    render: () => (
      <div className="flex gap-2">
        <button type="button" className="text-slate-400 hover:text-slate-600"><Eye size={14} /></button>
        <button type="button" className="text-slate-400 hover:text-slate-600"><Send size={14} /></button>
      </div>
    ),
  },
]

const unpostedDocColumns: ExportColumn<UnpostedDocument>[] = [
  { header: 'Site', accessor: (d) => d.site },
  { header: 'Entry Type', accessor: (d) => d.entryType },
  { header: 'Document Number', accessor: (d) => d.documentNumber },
  { header: 'Document Date', accessor: (d) => d.documentDate },
  { header: 'Status', accessor: (d) => d.status },
]

const SUMMARY_ICONS = [AlertTriangle, MapPin, ShoppingCart, LucideCuboid]
const SUMMARY_COLORS = [
  { icon: 'text-[#E17100]', bg: 'bg-[#FFFBEB]' },
  { icon: 'text-[#155DFC]', bg: 'bg-[#EFF6FF]' },
  { icon: 'text-[#009966]', bg: 'bg-[#ECFDF5]' },
  { icon: 'text-[#7F22FE]', bg: 'bg-[#F5F3FF]' },
]

export default function UnpostedDocuments() {
  const { data: documents = [] } = useQuery({
    queryKey: ['inventory-unposted-documents'],
    queryFn: inventoryService.getUnpostedDocuments,
  })

  const summaryCards = [
    { label: 'Total Documents', count: String(documents.length || 6) },
    { label: 'Affected Sites', count: '4' },
    { label: 'Retail Sale Entries', count: '4' },
    { label: 'Purchase Entries', count: '2' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {summaryCards.map((card, idx) => {
          const Icon = SUMMARY_ICONS[idx] ?? AlertTriangle
          const colors = SUMMARY_COLORS[idx] ?? SUMMARY_COLORS[0]
          return (
            <RunStatCard
              key={card.label}
              label={card.label}
              count={card.count}
              icon={<Icon size={18} className={colors.icon} />}
              iconBgColor={colors.bg}
            />
          )
        })}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            exportToPDF(documents, unpostedDocColumns, {
              filename: 'unposted-documents.pdf',
              title: 'Unposted Documents',
            })
          }
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <Download size={14} /> Export
        </button>
      </div>
      <ReusableTable columns={columns} data={documents} rowKey="id" />
    </div>
  )
}
