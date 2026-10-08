import { Search } from 'lucide-react'
import { useState } from 'react'

type TabToolbarProps = {
  title: string
  count?: number | string
  searchPlaceholder?: string
  onSearch?: (q: string) => void
  actions?: React.ReactNode
}

/**
 * Per-tab header row used by Product Setup tabs:
 * "Products  8 records   [Search...] [Filters]  [actions...]"
 */
export default function TabToolbar({
  title,
  count,
  searchPlaceholder = 'Search...',
  onSearch,
  actions,
}: TabToolbarProps) {
  const [q, setQ] = useState('')

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-[#043793]">{title}</h2>
        {count !== undefined && (
          <span className="text-sm text-slate-400">{count} records</span>
        )}
        <div className="relative ml-2 hidden sm:block">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              onSearch?.(e.target.value)
            }}
            placeholder={searchPlaceholder}
            className="h-9 w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-[#314158] placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20"
          />
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Secondary button (Export / Import / Filters / Print Labels). */
export function GhostButton({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
  )
}

/** Primary blue action button (+ New Product / + Generate Barcode). */
export function PrimaryButton({
  icon,
  label,
  onClick,
}: {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-2 rounded-lg bg-[#155DFC] px-3.5 text-sm font-medium text-white transition hover:bg-[#1447E6]"
    >
      {icon}
      {label}
    </button>
  )
}
