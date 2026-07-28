import type { FinanceStat } from '@/types/finance'
import { CARD_CONFIG } from '@/config/cardConfig'

type Props = {
  stats: FinanceStat[]
}

/** Figma Finance Month Setup summary cards (Active FY / Open / Closed / Entries) */
export default function FinanceSetupStatCards({ stats }: Props) {
  if (!stats.length) return null

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
      {stats.map((stat) => {
        const config = CARD_CONFIG[stat.type]
        return (
          <div
            key={stat.id}
            className="flex items-center gap-4 rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${config.logoBgColor}`}
            >
              {config.logo}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${config.valueColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
