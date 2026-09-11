export interface EInvoiceFormState {
  transactionType: string
  supplyType: string
  documentDate: string
  sellerGstProfileId: string
  fromPin: string
  fromCity: string
  toGstin: string
  toLegalName: string
  toPin: string
  toCity: string
  hsnCode: string
  taxableValue: string
}

export type EInvoiceFormField = keyof EInvoiceFormState

export interface EInvoiceGeneratedResult {
  irn: string
  ackNumber: string
  ackDate: string
  documentNumber: string
  documentDate: string
  supplyTypeLabel: string
  fromGstin: string
  toGstin: string
  fromCity: string
  toCity: string
  taxableValue: number
  gstRate: number
  sameState: boolean
  taxAmount: number
  grandTotal: number
}