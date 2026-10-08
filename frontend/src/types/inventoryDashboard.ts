/* ---------------- KPI cards ---------------- */

export type TrendDirection = 'up' | 'down'
export type KpiTone = 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal' | 'amber'

export type InventoryKpi = {
  id: string
  label: string
  value: string
  trend: 'up' | 'down'
  trendLabel: string
  trendGood?: boolean // green when true, red when false
  iconKey: string
  tone: KpiTone
}

/* ---------------- Inventory Value Trend ---------------- */

export type ValueTrendPoint = {
  month: string
  actual: number
  target: number
}

/* ---------------- Category Distribution ---------------- */

export type CategorySlice = {
  name: string
  value: number // percent
  color: string
}

/* ---------------- Stock Movement ---------------- */

export type StockMovementWeek = {
  week: string
  receipts: number
  issues: number
  adjustments: number
}

/* ---------------- Warehouse Capacity ---------------- */

export type WarehouseCapacity = {
  name: string
  used: number // percent
}

/* ---------------- Warehouse Performance ---------------- */

export type WarehousePerformance = {
  warehouse: string
  inbound: number
  outbound: number
}

/* ---------------- Inventory Aging ---------------- */

export type AgingBucket = {
  bucket: string
  percent: number
  tone: 'green' | 'amber' | 'red'
}

/* ---------------- Reservation Trend ---------------- */

export type ReservationPoint = {
  date: string
  reserved: number
  fulfilled: number
  pending: number
}

/* ---------------- Fast Moving Products ---------------- */

export type FastMovingProduct = {
  rank: number
  name: string
  qty: number
}

/* ---------------- Quick Actions ---------------- */

export type QuickAction = {
  id: string
  label: string
  iconKey: string
}

/* ---------------- Recent GRNs ---------------- */

export type GrnStatus = 'Completed' | 'Under QC' | 'Pending QC'

export type RecentGrn = {
  id: string
  grnNo: string
  status: GrnStatus
  vendor: string
  location: string
  items: number
  value: number
  timeLabel: string
}

/* ---------------- Activity Feed ---------------- */

export type ActivityTone = 'blue' | 'green' | 'amber' | 'red' | 'purple'

export type ActivityItem = {
  id: string
  message: string
  timeLabel: string
  tone: ActivityTone
}

/* ---------------- Dashboard payload ---------------- */

export type InventoryDashboardData = {
  kpis: InventoryKpi[]
  valueTrend: ValueTrendPoint[]
  categoryDistribution: CategorySlice[]
  stockMovement: StockMovementWeek[]
  warehouseCapacity: WarehouseCapacity[]
  warehousePerformance: WarehousePerformance[]
  aging: AgingBucket[]
  reservationTrend: ReservationPoint[]
  fastMoving: FastMovingProduct[]
  quickActions: QuickAction[]
  recentGrns: RecentGrn[]
  activityFeed: ActivityItem[]
}
