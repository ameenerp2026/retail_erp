import { Download } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { CategorySlice } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Donut of inventory value by category with a 2-column legend. */
export default function CategoryDistributionCard({ data }: { data: CategorySlice[] }) {
  return (
    <DashboardCard
      title="Category Distribution"
      subtitle="By inventory value"
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
      <div className="mx-auto h-[190px] w-full max-w-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((slice) => (
          <div key={slice.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.color }}
              />
              <span className="truncate text-slate-600">{slice.name}</span>
            </span>
            <span className="font-semibold text-[#314158]">{slice.value}%</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
