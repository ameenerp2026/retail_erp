import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { WarehousePerformance } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Inbound vs outbound volumes per warehouse, this month. */
export default function WarehousePerformanceCard({ data }: { data: WarehousePerformance[] }) {
  return (
    <DashboardCard title="Warehouse Performance" subtitle="Inbound / Outbound this month">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -18, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis
              dataKey="warehouse"
              tick={{ fill: '#94A3B8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              ticks={[0, 150, 300, 450, 600]}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
            <Bar dataKey="inbound" name="Inbound" fill="#00BC7D" radius={[3, 3, 0, 0]} maxBarSize={14} />
            <Bar dataKey="outbound" name="Outbound" fill="#2B7FFF" radius={[3, 3, 0, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
