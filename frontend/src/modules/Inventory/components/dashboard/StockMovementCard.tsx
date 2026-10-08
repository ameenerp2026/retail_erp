import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { StockMovementWeek } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Weekly receipts vs issues vs adjustments, W1–W6. */
export default function StockMovementCard({ data }: { data: StockMovementWeek[] }) {
  return (
    <DashboardCard title="Stock Movement" subtitle="Weekly receipts vs issues">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -16, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              ticks={[0, 400, 800, 1200, 1600]}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
            <Bar dataKey="receipts" name="Receipts" fill="#00BC7D" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="issues" name="Issues" fill="#2B7FFF" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="adjustments" name="Adjustments" fill="#FE9A00" radius={[3, 3, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
