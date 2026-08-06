import { ActivityIcon, UserIcon } from 'lucide-react'
import type { ActivityItem } from '@/components/shared/DetailPanel'

type Props = {
  items: ActivityItem[]
}

/** Figma Finance Months — standalone Activity Timeline card (right column). */
export default function FinanceActivityTimeline({ items }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm font-semibold tracking-wide text-slate-700">Activity Timeline</span>
        <ActivityIcon className="h-3.5 w-3.5 text-slate-400" />
      </div>

      {/* Timeline Items */}
      <div className="px-4 py-4">
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs ${item.bgColor} ${item.iconColor}`}
              >
                {item.icon}
              </div>
              {idx < items.length - 1 && <div className="my-1 w-px flex-1 bg-slate-200" />}
            </div>
            <div className="pb-4">
              <p className="text-xs font-semibold leading-snug text-slate-700">{item.title}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.date}</p>
              <div className="flex items-center gap-1">
                <UserIcon className="h-2.5 w-2.5 text-slate-400" />
                <p className="text-[11px] text-slate-400">{item.user}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
