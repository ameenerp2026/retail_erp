import { Package } from 'lucide-react'
import type { QuickAction } from '@/types/inventoryDashboard'
import DashboardCard from './DashboardCard'
import { KPI_ICONS } from './kpiIcon'

/** 3×4 grid of quick action tiles linking into the Inventory module. */
export default function QuickActionsCard({ actions }: { actions: QuickAction[] }) {
  return (
    <DashboardCard title="Quick Actions">
      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((action) => {
          const Icon = KPI_ICONS[action.iconKey] ?? Package
          return (
            <button
              key={action.id}
              type="button"
              className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-3 text-center transition hover:border-[#155DFC]/40 hover:bg-[#EFF6FF]/40"
            >
              <Icon size={17} className="text-[#155DFC]" />
              <span className="text-[11px] font-medium leading-tight text-[#314158]">{action.label}</span>
            </button>
          )
        })}
      </div>
    </DashboardCard>
  )
}
