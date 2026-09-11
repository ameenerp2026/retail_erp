export type EInvoiceTransactionType = { value: 'outward' | 'inward'; label: string }
export type EInvoiceSupplyType = { value: 'b2b' | 'b2c' | 'd2c'; label: string }

export type EInvoiceSellerGstProfile = {
  id: number
  gstin: string
  label: string
  legalName: string | null
  stateCode: string | null
  status: string
  registrationType: string
}

export type EInvoiceHsnCode = {
  id: number
  code: string
  label: string
  gstRate: number | null
}

export type EInvoiceFormOptions = {
  transactionTypes: EInvoiceTransactionType[]
  supplyTypes: EInvoiceSupplyType[]
  sellerGstProfiles: EInvoiceSellerGstProfile[]
  hsnCodes: EInvoiceHsnCode[]
}

export type EInvoiceItemInput = {
  hsnCode: string
  description?: string
  quantity?: number
  unit?: string
  rate?: number
  taxableValue: number
  cgstRate?: number
  sgstRate?: number
  igstRate?: number
}

export type CreateEInvoicePayload = {
  transactionType: 'outward' | 'inward'
  supplyType: 'b2b' | 'b2c' | 'd2c'
  documentDate: string // ISO date, e.g. "2026-09-08"
  sellerGstProfileId: number
  fromPin?: string
  fromCity?: string
  toGstin: string
  toLegalName?: string
  toPin?: string
  toCity?: string
  items: EInvoiceItemInput[]
}