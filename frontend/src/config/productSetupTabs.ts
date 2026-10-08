/** The in-page tabs of Product Setup, in design order. */
export const PRODUCT_SETUP_TABS = [
  { key: 'products', label: 'Products' },
  { key: 'hierarchy', label: 'Hierarchy' },
  { key: 'brands', label: 'Brands' },
  { key: 'attributes', label: 'Attributes' },
  { key: 'uom', label: 'UOM' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'tax', label: 'Tax' },
  { key: 'vendors', label: 'Vendor Mapping' },
  { key: 'barcode', label: 'Barcode' },
  { key: 'inv-config', label: 'Inv. Config' },
  { key: 'kitting', label: 'Kitting & Bundles' },
] as const

export type ProductSetupTabKey = (typeof PRODUCT_SETUP_TABS)[number]['key']
