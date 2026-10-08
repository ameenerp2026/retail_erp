import type {
  Product,
  HierarchyNode,
  Brand,
  AttributeColumn,
  ProductAttributeRow,
  Uom,
  PriceRule,
  VendorMapping,
  TaxConfig,
  Barcode,
  InventoryConfigCard,
  Bundle,
} from '@/types/inventorySetup'
import {
  MOCK_PRODUCTS,
  MOCK_HIERARCHY,
  MOCK_BRANDS,
  ATTRIBUTE_COLUMNS,
  MOCK_ATTRIBUTE_ROWS,
  MOCK_UOMS,
  MOCK_PRICE_RULES,
  MOCK_VENDOR_MAPPINGS,
  MOCK_TAX_CONFIGS,
  MOCK_BARCODES,
  BARCODE_STATS,
  MOCK_INVENTORY_CONFIG,
  MOCK_BUNDLES,
} from '@/mocks/inventorySetup.mock'
import apiClient from '@/services/apiClient'
import { fromMockOrApi } from '@/services/dataSource'

/**
 * API contract for the Inventory Product Setup module (implemented backend-side later).
 * Every endpoint lives under /api/inventory/setup.
 */
const API_BASE = '/api/inventory/setup'

export const inventorySetupService = {
  /* Products */
  getProducts: () =>
    fromMockOrApi(MOCK_PRODUCTS, () =>
      apiClient.get<Product[]>(`${API_BASE}/products`).then((res) => res.data)
    ),

  /* Hierarchy */
  getHierarchy: () =>
    fromMockOrApi(MOCK_HIERARCHY, () =>
      apiClient.get<HierarchyNode[]>(`${API_BASE}/hierarchy`).then((res) => res.data)
    ),

  /* Brands */
  getBrands: () =>
    fromMockOrApi(MOCK_BRANDS, () =>
      apiClient.get<Brand[]>(`${API_BASE}/brands`).then((res) => res.data)
    ),

  /* Attributes */
  getAttributeColumns: () =>
    fromMockOrApi(ATTRIBUTE_COLUMNS, () =>
      apiClient.get<AttributeColumn[]>(`${API_BASE}/attributes/columns`).then((res) => res.data)
    ),

  getAttributeRows: () =>
    fromMockOrApi(MOCK_ATTRIBUTE_ROWS, () =>
      apiClient.get<ProductAttributeRow[]>(`${API_BASE}/attributes/rows`).then((res) => res.data)
    ),

  /* UOM */
  getUoms: () =>
    fromMockOrApi(MOCK_UOMS, () =>
      apiClient.get<Uom[]>(`${API_BASE}/uoms`).then((res) => res.data)
    ),

  /* Pricing */
  getPriceRules: () =>
    fromMockOrApi(MOCK_PRICE_RULES, () =>
      apiClient.get<PriceRule[]>(`${API_BASE}/price-rules`).then((res) => res.data)
    ),

  /* Vendor Mapping */
  getVendorMappings: () =>
    fromMockOrApi(MOCK_VENDOR_MAPPINGS, () =>
      apiClient.get<VendorMapping[]>(`${API_BASE}/vendor-mappings`).then((res) => res.data)
    ),

  /* Tax */
  getTaxConfigs: () =>
    fromMockOrApi(MOCK_TAX_CONFIGS, () =>
      apiClient.get<TaxConfig[]>(`${API_BASE}/tax-configs`).then((res) => res.data)
    ),

  /* Barcode */
  getBarcodes: () =>
    fromMockOrApi(MOCK_BARCODES, () =>
      apiClient.get<Barcode[]>(`${API_BASE}/barcodes`).then((res) => res.data)
    ),

  getBarcodeStats: () =>
    fromMockOrApi(BARCODE_STATS, () =>
      apiClient.get<typeof BARCODE_STATS>(`${API_BASE}/barcodes/stats`).then((res) => res.data)
    ),

  /* Inventory Configuration */
  getInventoryConfig: () =>
    fromMockOrApi(MOCK_INVENTORY_CONFIG, () =>
      apiClient.get<InventoryConfigCard[]>(`${API_BASE}/config`).then((res) => res.data)
    ),

  /* Kitting & Bundling */
  getBundles: () =>
    fromMockOrApi(MOCK_BUNDLES, () =>
      apiClient.get<Bundle[]>(`${API_BASE}/bundles`).then((res) => res.data)
    ),
}
