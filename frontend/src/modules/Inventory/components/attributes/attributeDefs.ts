// Shared attribute definitions & column metadata for the Inventory
// attributes tab. Kept in a plain .ts module so the component file only
// exports components (react-refresh / fast-refresh rule).

export interface AttributeDef {
  key: string
  label: string
  title: string
}

export const DEFAULT_ATTRIBUTES: AttributeDef[] = [
  { key: 'col_1', label: 'Attribute 1', title: 'Color' },
  { key: 'col_2', label: 'Attribute 2', title: 'Size' },
  { key: 'col_3', label: 'Attribute 3', title: 'Material' },
  { key: 'col_4', label: 'Attribute 4', title: 'Unit' },
  { key: 'col_5', label: 'Attribute 5', title: 'Weight' },
  { key: 'col_6', label: 'Attribute 6', title: 'Fit' },
  { key: 'col_7', label: 'Attribute 7', title: 'Fabric' },
  { key: 'col_8', label: 'Attribute 8', title: 'Variant' },
]

export const ATTRIBUTE_COLUMNS = [
  { key: 'col_1', label: 'Attribute 1', title: 'Color', hasPlus: true },
  { key: 'col_2', label: 'Attribute 2', title: 'Size', hasPlus: false },
  { key: 'col_3', label: 'Attribute 3', title: 'Material', hasPlus: false },
  { key: 'col_4', label: 'Attribute 4', title: 'Unit', hasPlus: false },
  { key: 'col_5', label: 'Attribute 5', title: 'Weight', hasPlus: false },
  { key: 'col_6', label: 'Attribute 6', title: 'Fit', hasPlus: false },
  { key: 'col_7', label: 'Attribute 7', title: 'Fabric', hasPlus: false },
  { key: 'col_8', label: 'Attribute 8', title: 'Variant', hasPlus: false },
]