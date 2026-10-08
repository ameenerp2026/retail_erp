import { ArrowDownRight, ArrowUpRight, Package } from 'lucide-react'
import type { InventoryKpi } from '@/types/inventoryDashboard'
import { KPI_ICONS, TONE_STYLES } from './kpiIcon'

/** Three rows of 7 compact KPI cards (Total Products ... Reorder Suggest). */
export default function KpiGrid({ kpis }: { kpis: InventoryKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.iconKey] ?? Package
        const tone = TONE_STYLES[kpi.tone]
        const trendGood = kpi.trendGood ?? true

        return (
          <div
            key={kpi.id}
            className="rounded-xl border border-slate-200 bg-white p-3 transition hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="truncate text-[11px] font-medium text-slate-500">{kpi.label}</span>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone.chip}`}>
                <Icon size={13} className={tone.icon} />
              </span>
            </div>

            <p className="mt-1 text-lg font-bold tracking-tight text-[#043793]">{kpi.value}</p>

            <p
              className={`mt-1.5 flex items-center gap-1 text-[10px] font-medium ${
                trendGood ? 'text-[#009966]' : 'text-[#E7000B]'
              }`}
            >
              {kpi.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {kpi.trendLabel}
            </p>
          </div>
        )
      })}
    </div>
  )
}
