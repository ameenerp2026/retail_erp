import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ReservationPoint } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Reserved vs fulfilled vs pending lines through July 2025. */
export default function ReservationTrendCard({ data }: { data: ReservationPoint[] }) {
  return (
    <DashboardCard title="Reservation Trend" subtitle="Reserved vs fulfilled (July 2025)">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#EEF2F6" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              ticks={[0, 150, 300, 450, 600]}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
            <Line type="monotone" dataKey="reserved" name="Reserved" stroke="#2B7FFF" strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="fulfilled" name="Fulfilled" stroke="#00BC7D" strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="pending" name="Pending" stroke="#FE9A00" strokeWidth={1.8} strokeDasharray="5 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
