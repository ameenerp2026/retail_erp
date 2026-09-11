import type { DataImportInfo, EInvoiceInfo, EWayBillInfo } from '@/types/utilities'
import type { LedgerImportPreview, LedgerImportResult } from '@/types/Ledgerimport'
import type { EInvoiceFormOptions, CreateEInvoicePayload } from '@/types/Einvoice'
import {
  MOCK_DATA_IMPORT,
  MOCK_E_INVOICE,
  MOCK_E_WAY_BILL,
} from '@/mocks/utilities.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'
import { CreateEWayBillPayload, EWayBillFormOptions,EWayBillCreateResult} from '@/types/EwayBill'

const API_BASE = '/api/utilities'

type BackendDataImportInfo = Pick<DataImportInfo, 'importTypes'>

// Shape every response from the controller/service-pattern routes
// (einvoice.controller.ts and friends) comes wrapped in.
type ApiEnvelope<T> = { success: boolean; data: T; message?: string }

const DEFAULT_XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export const utilitiesService = {
  getDataImport: () =>
    apiClient.get<BackendDataImportInfo>(`${API_BASE}/data-import`).then((res) => ({
      ...MOCK_DATA_IMPORT,
      importTypes: res.data.importTypes,
    })),

  downloadTemplate: async (templateUrl: string, fileName: string) => {
    const response = await apiClient.get(templateUrl, {
      responseType: 'blob',
    })

    const rawContentType = response.headers['content-type']
    const contentType =
      typeof rawContentType === 'string' ? rawContentType : DEFAULT_XLSX_CONTENT_TYPE

    const blob = new Blob([response.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  previewData: (file: File, previewUrl: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post<LedgerImportPreview>(previewUrl, formData)
      .then((res) => res.data)
  },

  importData: (file: File, importUrl: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post<LedgerImportResult>(importUrl, formData)
      .then((res) => res.data)
  },

  getEInvoice: () =>
    fromMockOrApi(MOCK_E_INVOICE, () =>
      apiClient.get<EInvoiceInfo>(`${API_BASE}/e-invoice`).then((res) => res.data)
    ),

  // Dropdown data for the E-Invoice creation form. The controller wraps its
  // response as { success, data }, so unwrap .data.data here — callers get
  // back the plain EInvoiceFormOptions object, not the envelope.
  getEInvoiceFormOptions: () =>
    apiClient
      .get<ApiEnvelope<EInvoiceFormOptions>>(`${API_BASE}/e-invoice/form-options`)
      .then((res) => res.data.data),

  // Creates the invoice locally (no IRP/GSP call). Same unwrapping as above
  // — the controller responds with { success, message, data }.
  createEInvoice: (payload: CreateEInvoicePayload) =>
    apiClient
      .post<ApiEnvelope<{ documentNumber: string; [key: string]: unknown }>>(
        `${API_BASE}/e-invoice`,
        payload
      )
      .then((res) => res.data.data),

   getEWayBill: () =>
    fromMockOrApi(MOCK_E_WAY_BILL, () =>
      apiClient.get<EWayBillInfo>(`${API_BASE}/e-way-bill`).then((res) => res.data)
    ),
 
  // Dropdown + reference data (transport modes, validity rules, compliance
  // notice, seller GSTINs, HSN codes) for the actual E-Way Bill creation
  // form. Hits GET /api/utilities/e-way-bill/form-options.
  getEWayBillFormOptions: () =>
    apiClient
      .get<ApiEnvelope<EWayBillFormOptions>>(`${API_BASE}/e-way-bill/form-options`)
      .then((res) => res.data.data),
 
  // Creates the e-way bill locally (no government EWB system call). Hits
  // POST /api/utilities/e-way-bill.
  createEWayBill: (payload: CreateEWayBillPayload) =>
    apiClient
      .post<ApiEnvelope<EWayBillCreateResult>>(`${API_BASE}/e-way-bill`, payload)
      .then((res) => res.data.data),
}