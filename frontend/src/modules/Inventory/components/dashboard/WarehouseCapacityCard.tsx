import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import type { WarehouseCapacity } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Used vs available (%) horizontal bars, blue fill on grey track. */
export default function WarehouseCapacityCard({ data }: { data: WarehouseCapacity[] }) {
  const chartData = data.map((w) => ({ ...w, ghost: 100 - w.used }))

  return (
    <DashboardCard title="Warehouse Capacity" subtitle="Used vs available (%)">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
            barSize={16}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={78}
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" horizontal={false} />
            {/* blue used segment first, grey track continues to 100 */}
            <Bar dataKey="used" name="Used" stackId="cap" fill="#2B7FFF" radius={[8, 0, 0, 8]} />
            <Bar dataKey="ghost" name="Available" stackId="cap" fill="#EEF2F6" radius={[0, 8, 8, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
