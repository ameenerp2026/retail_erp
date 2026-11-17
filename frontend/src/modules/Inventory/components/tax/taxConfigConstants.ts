import type { TaxGroup } from '@/services/inventory/productSetup/taxConfig.service'

export const TAX_GROUP_OPTIONS = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'ESSENTIAL', label: 'Essential' },
  { value: 'PHARMA', label: 'Pharma' },
  { value: 'EXEMPT', label: 'Exempt' },
] as const

export const getTaxGroup = (group?: string): TaxGroup =>
  TAX_GROUP_OPTIONS.find((option) => option.value === group?.toUpperCase())?.value ??
  'STANDARD'
