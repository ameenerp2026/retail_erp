import type { InventoryDashboardData } from '@/types/inventoryDashboard'
import { MOCK_INVENTORY_DASHBOARD } from '@/mocks/inventoryDashboard.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/inventory/dashboard'

export const inventoryDashboardService = {
  getDashboard: () =>
    fromMockOrApi(MOCK_INVENTORY_DASHBOARD, () =>
      apiClient.get<InventoryDashboardData>(API_BASE).then((res) => res.data)
    ),
}
