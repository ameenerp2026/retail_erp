import type { DataImportInfo, EInvoiceInfo, EWayBillInfo } from '@/types/utilities'
import {
  MOCK_DATA_IMPORT,
  MOCK_E_INVOICE,
  MOCK_E_WAY_BILL,
} from '@/mocks/utilities.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

const API_BASE = '/api/utilities'

export const utilitiesService = {
  getDataImport: () =>
    fromMockOrApi(MOCK_DATA_IMPORT, () =>
      apiClient.get<DataImportInfo>(`${API_BASE}/data-import`).then((res) => res.data)
    ),

  getEInvoice: () =>
    fromMockOrApi(MOCK_E_INVOICE, () =>
      apiClient.get<EInvoiceInfo>(`${API_BASE}/e-invoice`).then((res) => res.data)
    ),

  getEWayBill: () =>
    fromMockOrApi(MOCK_E_WAY_BILL, () =>
      apiClient.get<EWayBillInfo>(`${API_BASE}/e-way-bill`).then((res) => res.data)
    ),
}
