import React from 'react'

type RunStatCardProps = {
  label: string
  count: number | string
  icon: React.ReactNode
  iconBgColor: string  
}

export default function RunStatCard({
  label,
  count,
  icon,
  iconBgColor,
}: RunStatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      {/* Icon circle — just border, no bg */}
      <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0 mb-3`}>
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="stat-value mb-1 text-[#1A2332]">{count}</p>
        <p className="text-xs uppercase tracking-wide text-[#6B7A99] whitespace-nowrap">{label}</p>
      </div>
    </div>
  )
}