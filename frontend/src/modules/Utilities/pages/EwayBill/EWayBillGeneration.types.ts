export interface EWayBillFormState {
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
  vehicleNumber: string
  transportMode: string
  distanceKm: string
}

export type EWayBillFormField = keyof EWayBillFormState

export interface EWayBillGeneratedResult {
  ewbNumber: string
  ewbDate: string
  validUntil: string
  documentNumber: string
  documentDate: string
  supplyTypeLabel: string
  fromLegalName: string
  fromGstin: string
  fromCity: string
  toLegalName: string
  toGstin: string
  toCity: string
  hsnCode: string
  taxableValue: number
  vehicleNumber: string
  transportModeLabel: string
  distanceKm: number
}