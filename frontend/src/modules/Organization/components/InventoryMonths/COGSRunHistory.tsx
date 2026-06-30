import { CheckCircle2, Download } from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import ReusableTable from '@/components/shared/ReusableTable'
import RunStatCard from '@/components/shared/RunStatCard'
import StatusTag from '@/components/shared/StatusTags'
import type { ColumnsType } from 'antd/es/table'
import { XCircle, Clock, TrendingUp } from 'lucide-react'
import { COGSRun, COGSRunHistoryProps } from '@/types/inventory'
import { MOCK_COGS } from '@/mocks/inventoryMonths.mock'

const COGS_Cards = [
  { id: 1, label: "Total Runs",    count: 8,      icon: <Clock size={18} className="text-[#155DFC]" />,  iconBgColor: "bg-[#EFF6FF]", iconColor: "text-blue-500" },
  { id: 2, label: "Completed",     count: 6,      icon: <CheckCircle2 size={18} className="text-[#009966]"/>, iconBgColor: "bg-[#ECFDF5]", iconColor: "text-green-500" },
  { id: 3, label: "Failed",        count: 1,      icon: <XCircle size={18} className="text-[#E7000B]" />,   iconBgColor: "bg-[#FEF2F2]", iconColor: "text-red-500" },
  { id: 4, label: "Avg. Runtime",  count: "2m 58s", icon: <Clock size={18} className="text-[#E17100]" />,  iconBgColor: "bg-[#FFFBEB]", iconColor: "text-orange-500" },
  { id: 5, label: "Success Rate",  count: "75%",  icon: <TrendingUp size={18} className="text-[#7F22FE]" />,iconBgColor: "bg-[#F5F3FF]", iconColor: "text-purple-500" },
]

const columns: ColumnsType<COGSRun> = [
  {
    title: "MONTH",
    dataIndex: "month",
    key: "month",
    render: (text) => <span className="text-[#0F4C9A] font-semibold">{text}</span>
  },
  { title: "START TIME", dataIndex: "startTime", key: "startTime" },
  { title: "END TIME",   dataIndex: "endTime",   key: "endTime"   },
  { title: "RUNTIME",    dataIndex: "runtime",   key: "runtime"   },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (status) => <StatusTag status={status} />
  },
  { title: "RUN BY", dataIndex: "runBy", key: "runBy" },
]

export default function COGSRunHistory({ isOpen, onClose}: COGSRunHistoryProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="COGS Run History"
      description="View all past COGS calculation runs and their results"
      size="xl"
    >
      {/* RunStat Cards */}
      
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        {COGS_Cards.map((stat) => (
        <RunStatCard
          key={stat.label} // or idx
          label={stat.label}
          count={stat.count}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
        />
      ))}
      </div>

      {/* Search + Filter + Export bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1.5 flex-1 max-w-xs">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search runs..."
            className="text-sm outline-none flex-1 bg-transparent"
          />
        </div>

        <button className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M10 12h4" />
          </svg>
          Filter
        </button>

        <button className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 ml-auto">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={MOCK_COGS}
        rowKey="id"
      />
    </Drawer>
  )
}