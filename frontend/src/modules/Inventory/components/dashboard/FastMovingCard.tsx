import type { FastMovingProduct } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

/** Top 5 by quantity sold — ranked pills with qty labels and blue progress bars. */
export default function FastMovingCard({ data }: { data: FastMovingProduct[] }) {
  const maxQty = Math.max(...data.map((d) => d.qty))

  return (
    <DashboardCard title="Fast Moving Products" subtitle="Top 5 by quantity sold this month">
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.rank}>
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                  item.rank === 1 ? 'bg-[#FFFBEB] text-[#E17100]' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.rank}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#314158]">
                {item.name}
              </span>
              <span className="shrink-0 text-xs text-slate-500">{item.qty.toLocaleString('en-IN')} pcs</span>
            </div>
            <div className="ml-8.5 mt-1.5 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-[#2B7FFF]"
                style={{ width: `${Math.max(6, (item.qty / maxQty) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
