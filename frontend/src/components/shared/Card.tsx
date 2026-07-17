import { ReactNode } from "react"

type CardProps = {
  count: number | string
  title?: string
  description?: string
  countColor?: string
  icon?: ReactNode
  iconBgColor?: string
  className?: string
}

function Card({
  count,
  title,
  description,
  countColor = "text-[#1A2332]",
  icon,
  iconBgColor="",
  className = ""
}: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 flex items-center gap-3 ${className}`}>
      {/* Icon in circle bg */}
      {icon && (
        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      )}

      {/* Text content */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs text-[#6B7A99] uppercase truncate whitespace-nowrap">
          {title}
        </span>
        <span className={`stat-value text-[#1A2332] ${countColor}`}>
          {count}
        </span>
      </div>
      {/* Description */}
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  )
}
export default Card