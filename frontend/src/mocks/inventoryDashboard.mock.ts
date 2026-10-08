import type { InventoryDashboardData } from '@/types/inventoryDashboard'

/* KPI values, trends and labels transcribed from the Figma dashboard design. */
export const MOCK_INVENTORY_DASHBOARD: InventoryDashboardData = {
  kpis: [
    { id: 'k1', label: 'Total Products', value: '2,847', trend: 'up', trendLabel: '+98 this month', trendGood: true, iconKey: 'package', tone: 'blue' },
    { id: 'k2', label: 'Active Products', value: '2,614', trend: 'up', trendLabel: '+98 this month', trendGood: true, iconKey: 'check', tone: 'green' },
    { id: 'k3', label: 'Inactive Products', value: '233', trend: 'up', trendLabel: '+26 this month', trendGood: false, iconKey: 'x', tone: 'red' },
    { id: 'k4', label: 'Active SKUs', value: '8,432', trend: 'up', trendLabel: '+312 this month', trendGood: true, iconKey: 'tag', tone: 'purple' },
    { id: 'k5', label: 'Warehouses', value: '12', trend: 'up', trendLabel: '+1 this year', trendGood: true, iconKey: 'warehouse', tone: 'teal' },
    { id: 'k6', label: 'Storage Location', value: '384', trend: 'up', trendLabel: '+28 this month', trendGood: true, iconKey: 'mapPin', tone: 'green' },
    { id: 'k7', label: 'Inventory Value', value: '₹48.2Cr', trend: 'up', trendLabel: '+12.4% vs last month', trendGood: true, iconKey: 'wallet', tone: 'blue' },

    { id: 'k8', label: 'Available Stock', value: '1,24,567', trend: 'up', trendLabel: '+5,280 this week', trendGood: true, iconKey: 'boxes', tone: 'blue' },
    { id: 'k9', label: 'Reserved Stock', value: '8,234', trend: 'down', trendLabel: '-320 this week', trendGood: true, iconKey: 'bookmark', tone: 'amber' },
    { id: 'k10', label: 'Allocated Stock', value: '12,891', trend: 'up', trendLabel: '+890 this week', trendGood: true, iconKey: 'clipboardCheck', tone: 'purple' },
    { id: 'k11', label: 'Low Stock Items', value: '47', trend: 'up', trendLabel: '+8 today', trendGood: false, iconKey: 'alertTriangle', tone: 'amber' },
    { id: 'k12', label: 'Negative Stock', value: '3', trend: 'up', trendLabel: '+2 today', trendGood: false, iconKey: 'packageX', tone: 'red' },
    { id: 'k13', label: 'Near Expiry (30d)', value: '89', trend: 'up', trendLabel: '+14 since last week', trendGood: false, iconKey: 'clock', tone: 'amber' },
    { id: 'k14', label: 'Expired Stock', value: '12', trend: 'up', trendLabel: '+3 today', trendGood: false, iconKey: 'xCircle', tone: 'red' },

    { id: 'k15', label: "Today's GRN", value: '24', trend: 'up', trendLabel: '+6 vs yesterday', trendGood: true, iconKey: 'truck', tone: 'teal' },
    { id: 'k16', label: 'Today Transfers', value: '18', trend: 'up', trendLabel: '+3 vs yesterday', trendGood: true, iconKey: 'move', tone: 'blue' },
    { id: 'k17', label: 'Pending Approva', value: '31', trend: 'up', trendLabel: '+7 since yesterday', trendGood: false, iconKey: 'clock', tone: 'amber' },
    { id: 'k18', label: 'Cycle Pending', value: '8', trend: 'down', trendLabel: '-2 this week', trendGood: true, iconKey: 'refresh', tone: 'teal' },
    { id: 'k19', label: 'Inventory Accura', value: '98.7%', trend: 'up', trendLabel: '+0.3% vs last month', trendGood: true, iconKey: 'target', tone: 'green' },
    { id: 'k20', label: 'Stock Turnover', value: '4.2x', trend: 'up', trendLabel: '+0.4x vs last quarter', trendGood: true, iconKey: 'trendingUp', tone: 'blue' },
    { id: 'k21', label: 'Reorder Suggest', value: '156', trend: 'up', trendLabel: '+22 today', trendGood: false, iconKey: 'zap', tone: 'orange' },
  ],

  valueTrend: [
    { month: 'Jan', actual: 38, target: 40 },
    { month: 'Feb', actual: 40, target: 41 },
    { month: 'Mar', actual: 39, target: 41 },
    { month: 'Apr', actual: 43, target: 42 },
    { month: 'May', actual: 44, target: 43 },
    { month: 'Jun', actual: 43, target: 44 },
    { month: 'Jul', actual: 46, target: 44 },
    { month: 'Aug', actual: 45, target: 45 },
    { month: 'Sep', actual: 49, target: 46 },
    { month: 'Oct', actual: 48, target: 47 },
    { month: 'Nov', actual: 52, target: 48 },
    { month: 'Dec', actual: 50, target: 49 },
  ],

  categoryDistribution: [
    { name: 'Electronics', value: 32, color: '#2B7FFF' },
    { name: 'FMCG', value: 24, color: '#00BC7D' },
    { name: 'Apparel', value: 18, color: '#8E4EC6' },
    { name: 'Hardware', value: 14, color: '#FE9A00' },
    { name: 'Pharma', value: 8, color: '#FB2C36' },
    { name: 'Others', value: 4, color: '#94A3B8' },
  ],

  stockMovement: [
    { week: 'W1', receipts: 1250, issues: 950, adjustments: 40 },
    { week: 'W2', receipts: 1420, issues: 1100, adjustments: 55 },
    { week: 'W3', receipts: 1180, issues: 1050, adjustments: 35 },
    { week: 'W4', receipts: 1550, issues: 1250, adjustments: 60 },
    { week: 'W5', receipts: 1350, issues: 1180, adjustments: 45 },
    { week: 'W6', receipts: 1480, issues: 1280, adjustments: 50 },
  ],

  warehouseCapacity: [
    { name: 'Mumbai', used: 72 },
    { name: 'Delhi', used: 61 },
    { name: 'Bengaluru', used: 68 },
    { name: 'Hyderabad', used: 54 },
    { name: 'Chennai', used: 63 },
  ],

  warehousePerformance: [
    { warehouse: 'Mumbai Central', inbound: 420, outbound: 385 },
    { warehouse: 'Bengaluru Main', inbound: 290, outbound: 270 },
    { warehouse: 'Chennai Port', inbound: 165, outbound: 150 },
  ],

  aging: [
    { bucket: '0-30 days', percent: 42, tone: 'green' },
    { bucket: '31-60 days', percent: 28, tone: 'green' },
    { bucket: '61-90 days', percent: 16, tone: 'amber' },
    { bucket: '91-180 days', percent: 9, tone: 'red' },
    { bucket: '>180 days', percent: 5, tone: 'red' },
  ],

  reservationTrend: [
    { date: '01 Jul', reserved: 290, fulfilled: 270, pending: 8 },
    { date: '05 Jul', reserved: 380, fulfilled: 355, pending: 10 },
    { date: '10 Jul', reserved: 360, fulfilled: 340, pending: 9 },
    { date: '15 Jul', reserved: 440, fulfilled: 420, pending: 12 },
    { date: '20 Jul', reserved: 490, fulfilled: 470, pending: 11 },
    { date: '25 Jul', reserved: 540, fulfilled: 520, pending: 14 },
  ],

  fastMoving: [
    { rank: 1, name: 'Samsung Galaxy A54', qty: 2840 },
    { rank: 2, name: 'Nike Air Max 270', qty: 2210 },
    { rank: 3, name: 'Dove Body Wash 500ml', qty: 5840 },
    { rank: 4, name: 'Bosch Drill Machine', qty: 890 },
    { rank: 5, name: 'Levis 511 Slim Jeans', qty: 1650 },
  ],

  quickActions: [
    { id: 'qa1', label: 'Create Product', iconKey: 'package' },
    { id: 'qa2', label: 'Create Brand', iconKey: 'sparkle' },
    { id: 'qa3', label: 'Create Category', iconKey: 'layoutGrid' },
    { id: 'qa4', label: 'Generate Barcode', iconKey: 'scan' },
    { id: 'qa5', label: 'Receive Goods', iconKey: 'truck' },
    { id: 'qa6', label: 'Opening Stock', iconKey: 'packageOpen' },
    { id: 'qa7', label: 'Stock Transfer', iconKey: 'shuffle' },
    { id: 'qa8', label: 'Cycle Count', iconKey: 'refresh' },
    { id: 'qa9', label: 'Adjustment', iconKey: 'sliders' },
    { id: 'qa10', label: 'Inventory Report', iconKey: 'fileText' },
    { id: 'qa11', label: 'Export Inventory', iconKey: 'download' },
    { id: 'qa12', label: 'Print Labels', iconKey: 'printer' },
  ],

  recentGrns: [
    { id: 'g1', grnNo: 'GRN-2501248', status: 'Completed', vendor: 'Samsung India Pvt Ltd', location: 'Mumbai Central · 5 items · ₹14,25,000', items: 5, value: 1425000, timeLabel: '2h ago' },
    { id: 'g2', grnNo: 'GRN-2501247', status: 'Under QC', vendor: 'HUL India Ltd', location: 'Delhi North · 12 items · ₹3,42,800', items: 12, value: 342800, timeLabel: '4h ago' },
    { id: 'g3', grnNo: 'GRN-2501246', status: 'Completed', vendor: 'Nike India Brand Ltd', location: 'Bengaluru Main · 8 items · ₹7,19,200', items: 8, value: 719200, timeLabel: '6h ago' },
    { id: 'g4', grnNo: 'GRN-2501245', status: 'Pending QC', vendor: 'ITC Limited', location: 'Hyderabad East · 15 items · ₹2,85,600', items: 15, value: 285600, timeLabel: '8h ago' },
    { id: 'g5', grnNo: 'GRN-2501244', status: 'Completed', vendor: 'Bosch Limited India', location: 'Chennai Port · 4 items · ₹5,60,000', items: 4, value: 560000, timeLabel: '10h ago' },
  ],

  activityFeed: [
    { id: 'a1', message: 'Product "Samsung Galaxy A54" created by Arjun Sharma', timeLabel: '10 min ago', tone: 'blue' },
    { id: 'a2', message: 'GRN #2501248 approved — 5 items from Samsung India', timeLabel: '45 min ago', tone: 'green' },
    { id: 'a3', message: 'Low stock alert triggered for Voltaren Gel 50g', timeLabel: '1h ago', tone: 'amber' },
    { id: 'a4', message: 'Barcode batch BCH-2025-001 generated (48 labels)', timeLabel: '2h ago', tone: 'purple' },
    { id: 'a5', message: 'Negative stock detected: Syska Fan 48" (-3 units)', timeLabel: '3h ago', tone: 'red' },
    { id: 'a6', message: 'Stock transfer STR-2501089 submitted for approval', timeLabel: '4h ago', tone: 'blue' },
    { id: 'a7', message: 'Cycle count CCT-2501012 completed — 98.9% accuracy', timeLabel: '5h ago', tone: 'green' },
  ],
}
