import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, Download, XCircle, Clock, TrendingUp } from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import ReusableTable from '@/components/shared/ReusableTable'
import RunStatCard from '@/components/shared/RunStatCard'
import StatusTag from '@/components/shared/StatusTags'
import type { ColumnsType } from 'antd/es/table'
import type { COGSRun, COGSRunHistoryProps } from '@/types/inventory'
import { inventoryService } from '@/services/inventoryService'
import { exportToPDF, ExportColumn } from '@/utils/exportData'

const ICON_MAP = {
  clock: Clock,
  check: CheckCircle2,
  x: XCircle,
  trending: TrendingUp,
} as const

const columns: ColumnsType<COGSRun> = [
  {
    title: 'MONTH',
    dataIndex: 'month',
    key: 'month',
    render: (text) => <span className="font-semibold text-[#0F4C9A]">{text}</span>,
  },
  { title: 'START TIME', dataIndex: 'startTime', key: 'startTime' },
  { title: 'END TIME', dataIndex: 'endTime', key: 'endTime' },
  { title: 'RUNTIME', dataIndex: 'runtime', key: 'runtime' },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <StatusTag status={status} />,
  },
  { title: 'RUN BY', dataIndex: 'runBy', key: 'runBy' },
]

const cogsRunColumns: ExportColumn<COGSRun>[] = [
  { header: 'Month', accessor: (r) => r.month },
  { header: 'Start Time', accessor: (r) => r.startTime },
  { header: 'End Time', accessor: (r) => r.endTime },
  { header: 'Runtime', accessor: (r) => r.runtime },
  { header: 'Status', accessor: (r) => r.status },
  { header: 'Run By', accessor: (r) => r.runBy },
]

export default function COGSRunHistory({ isOpen, onClose }: COGSRunHistoryProps) {
  const [search, setSearch] = useState('')

  const { data: runs = [] } = useQuery({
    queryKey: ['inventory-cogs-runs'],
    queryFn: inventoryService.getCogsRuns,
    enabled: isOpen,
  })

  const { data: summaryCards = [] } = useQuery({
    queryKey: ['inventory-cogs-summary'],
    queryFn: inventoryService.getCogsSummaryCards,
    enabled: isOpen,
  })

  const filteredRuns = useMemo(() => {
    if (!search.trim()) return runs
    const term = search.toLowerCase().trim()
    return runs.filter((r) =>
      [r.month, r.status, r.runBy].some((f) => f?.toLowerCase().includes(term))
    )
  }, [runs, search])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="COGS Run History"
      description="View all past COGS calculation runs and their results"
      size="xl"
    >
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {summaryCards.map((stat) => {
          const Icon = ICON_MAP[stat.iconKey] ?? Clock
          return (
            <RunStatCard
              key={stat.id}
              label={stat.label}
              count={stat.count}
              icon={<Icon size={18} className={stat.iconColor} />}
              iconBgColor={stat.iconBgColor}
            />
          )
        })}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
          <input
            type="text"
            placeholder="Search runs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            exportToPDF(filteredRuns, cogsRunColumns, {
              filename: 'cogs-run-history.pdf',
              title: 'COGS Run History',
            })
          }
          className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          <Download size={14} />
          Export
        </button>
      </div>

      <ReusableTable columns={columns} data={filteredRuns} rowKey="id" />
    </Drawer>
  )
}
