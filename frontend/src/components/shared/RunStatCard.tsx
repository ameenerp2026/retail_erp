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
        <p className="w-4 font-bold text-[#1A2332] leading-tight whitespace-nowrap mb-2">{count}</p>
        <p className="text-xs text-[#6B7A99] uppercase tracking-wide whitespace-nowrap">{label}</p>
      </div>
    </div>
  )
}