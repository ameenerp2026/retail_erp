import { useQuery } from '@tanstack/react-query'
import ReusableTable from '@/components/shared/ReusableTable'
import StatusTag from '@/components/shared/StatusTags'
import { inventoryService } from '@/services/inventoryService'
import type { RecalculateCOGS as RecalculateCOGSRow } from '@/types/inventory'
import type { ColumnsType } from 'antd/es/table'
import { AlertTriangle, ArrowLeft, Calendar, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const columns: ColumnsType<RecalculateCOGSRow> = [
  {
    title: 'MONTH',
    dataIndex: 'month',
    key: 'month',
    render: (text) => <span className="font-medium text-blue-600">{text}</span>,
  },
  { title: 'PERIOD', dataIndex: 'period', key: 'period' },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusTag status={status} />,
  },
]

export default function RecalculateCOGS() {
  const navigate = useNavigate()

  const { data: summaryItems = [] } = useQuery({
    queryKey: ['inventory-recalculate-summary'],
    queryFn: inventoryService.getRecalculateSummary,
  })
  const { data: months = [] } = useQuery({
    queryKey: ['inventory-recalculate-months'],
    queryFn: inventoryService.getRecalculateMonths,
  })
  const { data: logEntries = [] } = useQuery({
    queryKey: ['inventory-recalculate-logs'],
    queryFn: inventoryService.getRecalculateLogs,
  })

  return (
    <div className="page-shell">
      <div className="section-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="page-title">Recalculate COGS</h1>
            <p className="page-subtitle">Select months and run cost of goods sold recalculation</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="mt-6 rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => (
              <div key={item.label} className="rounded-[12px] bg-slate-50/80 px-4 py-3 text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#6b7a99]">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-[#1a2332]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[rgba(15,76,154,0.12)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#1a2332]">Month Selection</h2>
              <p className="text-xs text-[#6b7a99]">2 selected</p>
            </div>
            <div className="overflow-x-auto">
              <ReusableTable columns={columns} data={months} rowKey="id" />
            </div>
          </section>

          <section className="overflow-hidden rounded-[16px] border border-[rgba(15,76,154,0.12)] bg-white shadow-sm">
            <div className="border-b border-[rgba(15,76,154,0.12)] px-4 py-3">
              <h2 className="text-sm font-semibold text-[#1a2332]">Run Log</h2>
            </div>
            <div className="bg-[#0f172b] px-4 py-4 font-mono text-[11px] leading-6 text-slate-200">
              {logEntries.map((entry) => (
                <div key={`${entry.time}-${entry.message}`}>
                  <span className="text-slate-400">{entry.time}</span>{' '}
                  <span className="text-sky-300">{entry.level}</span> {entry.message}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle size={16} />
            <span>2 months selected for recalculation</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#1a2332] shadow-sm">
              Cancel
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] border border-[rgba(15,76,154,0.12)] bg-white px-4 py-2 text-sm font-medium text-[#1a2332] shadow-sm">
              <Calendar size={16} />
              Schedule Run
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] bg-[#0f4c9a] px-4 py-2 text-sm font-medium text-white shadow-sm">
              <Play size={16} />
              Run COGS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
