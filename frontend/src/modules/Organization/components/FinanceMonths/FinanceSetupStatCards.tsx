import type { FinanceStat } from '@/types/finance'
import { CARD_CONFIG } from '@/config/cardConfig'

type Props = {
  stats: FinanceStat[]
}

/** Figma Finance Month Setup summary cards (Active FY / Open / Closed / Entries) */
export default function FinanceSetupStatCards({ stats }: Props) {
  if (!stats.length) return null

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => {
        const config = CARD_CONFIG[stat.type]
        return (
          <div
            key={stat.id}
            className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] ${config.logoBgColor}`}
            >
              {config.logo}
            </div>
            <p className={`text-lg font-bold tracking-tight sm:text-xl ${config.valueColor}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
