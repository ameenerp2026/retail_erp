import { useQuery } from '@tanstack/react-query'
import { inventoryDashboardService } from '@/services/inventoryDashboardService'
import KpiGrid from '../components/dashboard/KpiGrid'
import ValueTrendCard from '../components/dashboard/ValueTrendCard'
import CategoryDistributionCard from '../components/dashboard/CategoryDistributionCard'
import StockMovementCard from '../components/dashboard/StockMovementCard'
import WarehouseCapacityCard from '../components/dashboard/WarehouseCapacityCard'
import WarehousePerformanceCard from '../components/dashboard/WarehousePerformanceCard'
import InventoryAgingCard from '../components/dashboard/InventoryAgingCard'
import ReservationTrendCard from '../components/dashboard/ReservationTrendCard'
import FastMovingCard from '../components/dashboard/FastMovingCard'
import QuickActionsCard from '../components/dashboard/QuickActionsCard'
import RecentGrnsCard from '../components/dashboard/RecentGrnsCard'
import ActivityFeedCard from '../components/dashboard/ActivityFeedCard'

export default function InventoryDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory-dashboard'],
    queryFn: inventoryDashboardService.getDashboard,
  })

  if (isLoading || !data) {
    return (
      <div className="page-shell">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-50" />
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="space-y-4">
        {/* Row 1–3: 21 KPI cards */}
        <KpiGrid kpis={data.kpis} />

        {/* Row 4: value trend (2/3) + category donut (1/3) */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ValueTrendCard data={data.valueTrend} />
          </div>
          <CategoryDistributionCard data={data.categoryDistribution} />
        </div>

        {/* Row 5: three chart cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <StockMovementCard data={data.stockMovement} />
          <WarehouseCapacityCard data={data.warehouseCapacity} />
          <WarehousePerformanceCard data={data.warehousePerformance} />
        </div>

        {/* Row 6: three cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <InventoryAgingCard data={data.aging} />
          <ReservationTrendCard data={data.reservationTrend} />
          <FastMovingCard data={data.fastMoving} />
        </div>

        {/* Row 7: quick actions + recent GRNs + activity feed */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <QuickActionsCard actions={data.quickActions} />
          <RecentGrnsCard items={data.recentGrns} />
          <ActivityFeedCard items={data.activityFeed} />
        </div>
      </div>
    </div>
  )
}
