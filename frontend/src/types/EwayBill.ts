export type EWayBillTransportMode = { value: 'road' | 'rail' | 'air' | 'ship'; label: string }

export type EWayBillValidityRule = {
  id: string
  distance: string
  validity: string
}

export type EWayBillSellerGstProfile = {
  id: number
  gstin: string
  label: string
  legalName: string | null
  stateCode: string | null
  status: string
  registrationType: string
}

export type EWayBillHsnCode = {
  id: number
  code: string
  label: string
  gstRate: number | null
}

export type EWayBillFormOptions = {
  transportModes: EWayBillTransportMode[]
  validityRules: EWayBillValidityRule[]
  complianceNotice: string
  sellerGstProfiles: EWayBillSellerGstProfile[]
  hsnCodes: EWayBillHsnCode[]
}

export type CreateEWayBillPayload = {
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
  hsnCode: string
  taxableValue: number
  vehicleNumber: string
  transportMode: 'road' | 'rail' | 'air' | 'ship'
  distanceKm: number
}

export type EWayBillCreateResult = {
  id: number
  documentNumber: string
  validUntil: string
  [key: string]: unknown
}