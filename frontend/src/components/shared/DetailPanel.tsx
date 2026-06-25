// components/shared/DetailPanel.tsx

import { ActivityIcon, UserIcon, X } from 'lucide-react'

type DetailRow = {
  label: string
  value: string | number
  type: 'badge' | 'text' | 'number'
  badgeComponent?: React.ReactNode
  numberColor?: string
  textColor?: string
}

type ActivityItem = {
  id: number
  title: string
  date: string
  user: string
  bgColor: string
  iconColor: string
  icon: string
}

type DetailPanelProps = {
  title: string
  sectionTitle?: string
  rows: DetailRow[]
  activityItems: ActivityItem[]
  onClose: () => void
}

export default function DetailPanel({
  title,
  sectionTitle = "Details",
  rows,
  activityItems,
  onClose,
}: DetailPanelProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Month Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-xs text-[#6B7A99] uppercase tracking-wide">
            {sectionTitle}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X size={14} />
          </button>
        </div>

        {/* Title */}
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-[#043793]">{title}</h2>
        </div>

        {/* Detail Rows */}
        <div className="px-4 py-3 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm text-[#6B7A99]">{row.label}</span>
             {row.type === 'badge' && (
  <div className="ml-auto">
    {row.badgeComponent}
  </div>
)}
              {row.type === 'text' && (
                <span className={`text-sm font-medium ${row.textColor ?? ''}`}>{row.value}</span>
              )}
              {row.type === 'number' && (
                <span className={`text-xs font-bold ${row.numberColor}`}>{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-700 tracking-wide">
            Activity Timeline
          </span>
          <ActivityIcon className="w-3 h-3 text-gray-400" />
        </div>

        {/* Timeline Items */}
        <div className="px-4 py-4">
          <div className="space-y-0">
            {activityItems.map((item, idx) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full ${item.bgColor} ${item.iconColor} flex items-center justify-center text-xs flex-shrink-0 z-10`}>
                    {item.icon}
                  </div>
                  {idx < activityItems.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-2.5 h-2.5 text-slate-400" />
                    <p className="text-[11px] text-slate-400">{item.user}</p>
                  </div>                
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export type { DetailRow, ActivityItem }