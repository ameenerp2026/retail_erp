import { useQuery } from '@tanstack/react-query'
import { Users, Hotel, Shield, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import KpiCard from '../../components/KPICards'
import PlatformActivities from '../../components/PlatformActivities'
import ModuleUsage from '../../components/ModuleUsage'
import AuditLog from '../../components/AuditLogs'
import PendingApprovals from '../../components/PendingApprovals'
import StorageUsage from '../../components/StorageUsage'
import QuickActions from '../../components/QuickActions'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardKpi } from '@/types/dashboard'

const KPI_ICONS: Record<DashboardKpi['iconKey'], LucideIcon> = {
  users: Users,
  hotel: Hotel,
  shield: Shield,
  alert: TriangleAlert,
}

function TenantAdminDashBoard() {
  const { data: kpis = [], isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: dashboardService.getKpis,
  })

  return (
    <div className="page-shell space-y-5 sm:space-y-6">
      <div>
        <h1 className="page-title">Tenant Admin Dashboard</h1>
        <p className="page-subtitle">
          Overview of users, activity, and pending actions across your tenant
        </p>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              icon={KPI_ICONS[kpi.iconKey]}
              change={kpi.change}
              description={kpi.description}
              badgeColor={kpi.badgeColor}
              iconColor={kpi.iconColor}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          <PlatformActivities />
        </div>
        <div className="lg:col-span-4">
          <ModuleUsage />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-8">
          <AuditLog />
        </div>
        <div className="xl:col-span-4">
          <PendingApprovals />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-4">
          <StorageUsage />
        </div>
        <div className="xl:col-span-8">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

export default TenantAdminDashBoard
