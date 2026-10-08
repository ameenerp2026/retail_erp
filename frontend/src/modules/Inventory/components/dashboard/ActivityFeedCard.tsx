import type { ActivityItem, ActivityTone } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'

const DOT_COLORS: Record<ActivityTone, string> = {
  blue: 'bg-[#2B7FFF]',
  green: 'bg-[#00BC7D]',
  amber: 'bg-[#FE9A00]',
  red: 'bg-[#FB2C36]',
  purple: 'bg-[#8E4EC6]',
}

/** Timeline of recent inventory events with colored dots. */
export default function ActivityFeedCard({ items }: { items: ActivityItem[] }) {
  return (
    <DashboardCard
      title="Activity Feed"
      action={
        <button type="button" className="text-xs font-medium text-[#155DFC] hover:underline">
          View all
        </button>
      }
    >
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${DOT_COLORS[item.tone]}`} />
            <div className="min-w-0">
              <p className="text-[13px] leading-snug text-[#314158]">{item.message}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.timeLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
