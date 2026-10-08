import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { AgingBucket } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

const TONE_COLORS: Record<AgingBucket['tone'], string> = {
  green: '#00BC7D',
  amber: '#FE9A00',
  red: '#FB2C36',
}

/** Days-in-warehouse distribution with color-coded risk buckets. */
export default function InventoryAgingCard({ data }: { data: AgingBucket[] }) {
  return (
    <DashboardCard title="Inventory Aging" subtitle="Days in warehouse distribution">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -22, bottom: 0 }} barSize={34}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis
              dataKey="bucket"
              tick={{ fill: '#94A3B8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              ticks={[0, 15, 30, 45, 60]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
              {data.map((b) => (
                <Cell key={b.bucket} fill={TONE_COLORS[b.tone]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
