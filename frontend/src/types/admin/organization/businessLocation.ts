

export interface BusinessLocationRow {
  id: number

  locationName: string
  parentOrganizationUnitId: number
  locationType: LocationType
  businessCategory: BusinessCategory

  addressLine1: string
  addressLine2?: string | null
  landmark?: string | null

  city: string
  state: string
  country: string
  pinCode: string

  contactPerson: string
  phoneNumber?: string | null
  email?: string | null
  emergencyContact?: string | null

  linkedGSTINId: number
  registrationType: RegistrationType

  defaultBillingLocation: boolean
  defaultStockLocation: boolean

  allowSales: boolean
  allowPurchase: boolean
  allowInventory: boolean
  allowDispatch: boolean
  allowPOS: boolean

  status: LocationStatus

  createdAt: string
  updatedAt: string
}

export type LocationType =
  | 'HEAD_OFFICE'
  | 'BRANCH'
  | 'WAREHOUSE'
  | 'STORE'

export type BusinessCategory =
  | 'RETAIL'
  | 'WHOLESALE'
  | 'MANUFACTURING'
  | 'DISTRIBUTION'

export type RegistrationType =
  | 'REGULAR'
  | 'COMPOSITION'
  | 'SEZ'

export type LocationStatus =
  | 'ACTIVE'
  | 'INACTIVE'