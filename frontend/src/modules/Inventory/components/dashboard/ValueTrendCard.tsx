import { Download } from 'lucide-react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ValueTrendPoint } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Blue actual-value area with dashed amber target line, Jan–Dec. */
export default function ValueTrendCard({ data }: { data: ValueTrendPoint[] }) {
  return (
    <DashboardCard
      title="Inventory Value Trend"
      subtitle="Monthly inventory value vs target (₹ Crore)"
      action={
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          aria-label="Download"
        >
          <Download size={14} />
        </button>
      }
    >
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="valueTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2B7FFF" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#2B7FFF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              ticks={[0, 15, 30, 45, 60]}
              domain={[0, 60]}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual Value"
              stroke="#2B7FFF"
              strokeWidth={2.2}
              fill="url(#valueTrendFill)"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#FE9A00"
              strokeWidth={1.8}
              strokeDasharray="6 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
