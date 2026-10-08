import type { StatusType } from '@/components/shared/StatusTags'

/* ---------------- Products ---------------- */

export type ProductStatus = StatusType // Active | Inactive | ...

export type Product = {
  id: string
  productCode: string // e.g. ELE-SAM-A54
  productName: string
  department: string
  section: string
  category: string
  subCategory: string
  brand: string
  uom: string
  hsnSac: string
  costPrice: number
  mrp: number
  sellingPrice: number
  status: ProductStatus
  imageCount: number
  lastModified: string
  modifiedBy: string
}

export type ProductImage = {
  id: string
  url?: string // object URL or remote url; undefined => placeholder
  isPrimary: boolean
}

/* ---------------- Hierarchy ---------------- */

export type HierarchyNodeType = 'department' | 'section' | 'category' | 'subCategory'

export type HierarchyNode = {
  id: string
  name: string
  type: HierarchyNodeType
  code: string
  productCount: number
  children: HierarchyNode[]
}

/* ---------------- Brands ---------------- */

export type Brand = {
  id: string
  name: string
  code: string
  description: string
  productCount: number
  status: ProductStatus
  // Optional brand card customization (per design: colored monogram tile)
  color?: string // tailwind bg class e.g. bg-[#EFF6FF]
  textColor?: string
}

/* ---------------- Attributes ---------------- */

export type AttributeColumn = {
  id: string
  name: string // Color, Size, Material, ...
  values: string[] // Red, Blue, ...
}

export type ProductAttributeRow = {
  id: string
  productCode: string
  productName: string
  attributes: Record<string, string> // attributeName -> value
}

/* ---------------- UOM ---------------- */

export type Uom = {
  id: string
  name: string
  status: ProductStatus
}

/* ---------------- Pricing ---------------- */

export type PriceRuleType = 'Cost Plus' | 'Fixed' | 'Margin' | 'Promotional'
export type PriceRuleStatus = StatusType

export type PriceRule = {
  id: string
  priceId: string
  productCode: string
  productName: string
  costPrice: number
  wsp: number
  rsp: number
  sellingPrice: number
  effectiveDate: string
  status: PriceRuleStatus
}

export type CreatePriceRuleDraft = {
  productCode: string
  productName: string
  ruleType: PriceRuleType
  basePrice: number
  wspPercent: number
  rspPercent: number
  rounding: 'None' | '0.99' | 'Nearest 10'
  effectiveDate: string
  status: PriceRuleStatus
}

/* ---------------- Vendor Mapping ---------------- */

export type VendorMappingType = 'Primary' | 'Alternate'
export type VendorMapping = {
  id: string
  mappingId: string
  productCode: string
  productName: string
  vendorCode: string
  vendorName: string
  vendorSku: string
  leadTimeDays: number
  moq: number
  mappingType: VendorMappingType
  status: ProductStatus
}

/* ---------------- Tax ---------------- */

export type TaxConfig = {
  id: string
  taxId: string
  productCode: string
  productName: string
  hsnSac: string
  taxGroup: string
  cgst: number
  sgst: number
  igst: number
  cess: number
  effectiveDate: string
  isDefault: boolean
}

export type TaxDraft = {
  taxGroup: string
  hsnSac: string
  cgst: number
  sgst: number
  igst: number
  cess: number
  effectiveDate: string
  isDefault: boolean
}

/* ---------------- Barcode ---------------- */

export type BarcodeType = 'EAN-13' | 'QR'

export type Barcode = {
  id: string
  barcodeId: string
  productName: string
  productCode: string
  value: string
  type: BarcodeType
  format: '1D' | '2D'
  batch: string
  generatedAt: string
  status: ProductStatus
}

export type BarcodeLabelTemplateKey =
  | 'standard'
  | 'company'
  | 'garment'
  | 'jewelry'
  | 'detailed'
  | 'priceTag'

export type BarcodeLabelTemplate = {
  key: BarcodeLabelTemplateKey
  title: string
  description: string
}

export type DataVerificationRow = {
  row: number
  productName: string
  productCode: string | null
  mrp: string
  status: 'Valid' | 'Missing Code' | 'Duplicate'
}

export type DataVerificationSummary = {
  total: number
  valid: number
  issues: number
  duplicates: number
  rows: DataVerificationRow[]
  systemNotes: string[]
}

export type BarcodeGenerateDraft = {
  productName: string
  productCode: string
  department: string
  section: string
  attributes: [string, string, string, string] // Color/Size/Material/Brand
  quantity: number
  mrp: string
  sellingPrice: string
  template: BarcodeLabelTemplateKey
  labels: number
}

/* ---------------- Inventory Configuration ---------------- */

export type InventoryConfigCard = {
  id: string
  title: string
  description: string
  items: {
    id: string
    label: string
    description: string
    enabled: boolean
  }[]
}

/* ---------------- Kitting & Bundling ---------------- */

export type BundleType = 'Bundle' | 'Kit'

export type BundleComponent = {
  id: string
  productName: string
  productCode: string
  qty: number
  uom: string
  cost: number
}

export type Bundle = {
  id: string
  bundleCode: string
  bundleName: string
  bundleProductCode: string
  type: BundleType
  components: BundleComponent[]
  totalCost: number
  status: ProductStatus
}
