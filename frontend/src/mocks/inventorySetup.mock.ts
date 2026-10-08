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

/* ---------------- Products ---------------- */

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', department: 'Electronics', section: 'Mobiles',
    category: 'Smartphones', subCategory: 'Android', brand: 'Samsung', uom: 'Pieces', hsnSac: '8471',
    costPrice: 28000, mrp: 38999, sellingPrice: 34999, status: 'Active', imageCount: 4,
    lastModified: '12 Jun 2026 09:14', modifiedBy: 'Arjun Sharma',
  },
  {
    id: '2', productCode: 'APP-NIK-AM270', productName: 'Nike Air Max 270', department: 'Apparel', section: 'Footwear',
    category: 'Sports Shoes', subCategory: 'Running', brand: 'Nike', uom: 'Pairs', hsnSac: '6404',
    costPrice: 6500, mrp: 12995, sellingPrice: 9995, status: 'Active', imageCount: 3,
    lastModified: '11 Jun 2026 17:02', modifiedBy: 'Arjun Sharma',
  },
  {
    id: '3', productCode: 'FMCG-DOV-BW500', productName: 'Dove Body Wash 500ml', department: 'FMCG', section: 'Personal Care',
    category: 'Bath & Shower', subCategory: 'Body Wash', brand: 'Dove', uom: 'Bottle', hsnSac: '3401',
    costPrice: 210, mrp: 349, sellingPrice: 299, status: 'Active', imageCount: 2,
    lastModified: '10 Jun 2026 11:48', modifiedBy: 'Priya Nair',
  },
  {
    id: '4', productCode: 'HRD-BSH-DR600', productName: 'Bosch Drill Machine 600W', department: 'Hardware', section: 'Power Tools',
    category: 'Drills', subCategory: 'Corded', brand: 'Bosch', uom: 'Pieces', hsnSac: '8467',
    costPrice: 3200, mrp: 5499, sellingPrice: 4799, status: 'Active', imageCount: 1,
    lastModified: '09 Jun 2026 15:22', modifiedBy: 'System',
  },
  {
    id: '5', productCode: 'FMCG-ITC-AASH500', productName: 'Aashirvaad Atta 5Kg', department: 'FMCG', section: 'Grocery',
    category: 'Flour', subCategory: 'Wheat', brand: 'Aashirvaad', uom: 'Packet', hsnSac: '1101',
    costPrice: 195, mrp: 275, sellingPrice: 249, status: 'Active', imageCount: 2,
    lastModified: '08 Jun 2026 10:05', modifiedBy: 'Priya Nair',
  },
  {
    id: '6', productCode: 'PHR-CIP-AZTH500', productName: 'Azithromycin 500mg Strip', department: 'Pharma', section: 'Medicines',
    category: 'Antibiotics', subCategory: 'Tablets', brand: 'Cipla', uom: 'Strip', hsnSac: '3004',
    costPrice: 68, mrp: 125, sellingPrice: 112, status: 'Active', imageCount: 0,
    lastModified: '07 Jun 2026 12:40', modifiedBy: 'System',
  },
  {
    id: '7', productCode: 'ELE-APL-IPH15', productName: 'Apple iPhone 15 128GB', department: 'Electronics', section: 'Mobiles',
    category: 'Smartphones', subCategory: 'iOS', brand: 'Apple', uom: 'Pieces', hsnSac: '8517',
    costPrice: 62000, mrp: 79900, sellingPrice: 75900, status: 'Active', imageCount: 5,
    lastModified: '06 Jun 2026 09:30', modifiedBy: 'Arjun Sharma',
  },
  {
    id: '8', productCode: 'HMC-PRK-TSH20', productName: 'Parker T-Shirt Size 20 (Homecare)', department: 'Apparel', section: 'Clothing',
    category: 'T-Shirts', subCategory: 'Casual', brand: 'Parker', uom: 'Pieces', hsnSac: '6109',
    costPrice: 240, mrp: 599, sellingPrice: 449, status: 'Inactive', imageCount: 1,
    lastModified: '05 Jun 2026 18:12', modifiedBy: 'Priya Nair',
  },
]

/* ---------------- Hierarchy ---------------- */

export const MOCK_HIERARCHY: HierarchyNode[] = [
  {
    id: 'dep-electronics', name: 'Electronics', type: 'department', code: 'ELE', productCount: 842,
    children: [
      {
        id: 'sec-mobiles', name: 'Mobiles', type: 'section', code: 'ELE-MOB', productCount: 316,
        children: [
          {
            id: 'cat-smartphones', name: 'Smartphones', type: 'category', code: 'ELE-MOB-SMP', productCount: 208,
            children: [
              { id: 'sub-android', name: 'Android', type: 'subCategory', code: 'ELE-MOB-SMP-AND', productCount: 156, children: [] },
              { id: 'sub-ios', name: 'iOS', type: 'subCategory', code: 'ELE-MOB-SMP-IOS', productCount: 52, children: [] },
            ],
          },
          { id: 'cat-feature-phones', name: 'Feature Phones', type: 'category', code: 'ELE-MOB-FTR', productCount: 22, children: [] },
          { id: 'cat-accessories', name: 'Mobile Accessories', type: 'category', code: 'ELE-MOB-ACC', productCount: 86, children: [] },
        ],
      },
      {
        id: 'sec-audio', name: 'Audio', type: 'section', code: 'ELE-AUD', productCount: 190,
        children: [
          { id: 'cat-headphones', name: 'Headphones', type: 'category', code: 'ELE-AUD-HDP', productCount: 98, children: [] },
          { id: 'cat-speakers', name: 'Speakers', type: 'category', code: 'ELE-AUD-SPK', productCount: 92, children: [] },
        ],
      },
    ],
  },
  {
    id: 'dep-apparel', name: 'Apparel', type: 'department', code: 'APP', productCount: 1240,
    children: [
      {
        id: 'sec-footwear', name: 'Footwear', type: 'section', code: 'APP-FTW', productCount: 460,
        children: [
          { id: 'cat-sports', name: 'Sports Shoes', type: 'category', code: 'APP-FTW-SPT', productCount: 250, children: [] },
          { id: 'cat-formal', name: 'Formal Shoes', type: 'category', code: 'APP-FTW-FRM', productCount: 210, children: [] },
        ],
      },
      {
        id: 'sec-clothing', name: 'Clothing', type: 'section', code: 'APP-CLT', productCount: 780,
        children: [
          { id: 'cat-tshirts', name: 'T-Shirts', type: 'category', code: 'APP-CLT-TSH', productCount: 410, children: [] },
          { id: 'cat-jeans', name: 'Jeans', type: 'category', code: 'APP-CLT-JNS', productCount: 370, children: [] },
        ],
      },
    ],
  },
  {
    id: 'dep-fmcg', name: 'FMCG', type: 'department', code: 'FMCG', productCount: 2103,
    children: [
      {
        id: 'sec-personal-care', name: 'Personal Care', type: 'section', code: 'FMCG-PC', productCount: 890,
        children: [
          { id: 'cat-bath', name: 'Bath & Shower', type: 'category', code: 'FMCG-PC-BTH', productCount: 240, children: [] },
          { id: 'cat-oral', name: 'Oral Care', type: 'category', code: 'FMCG-PC-ORL', productCount: 180, children: [] },
        ],
      },
      {
        id: 'sec-grocery', name: 'Grocery', type: 'section', code: 'FMCG-GRC', productCount: 1213,
        children: [
          { id: 'cat-flour', name: 'Flour', type: 'category', code: 'FMCG-GRC-FLR', productCount: 96, children: [] },
        ],
      },
    ],
  },
  { id: 'dep-hardware', name: 'Hardware', type: 'department', code: 'HRD', productCount: 517, children: [] },
  { id: 'dep-pharma', name: 'Pharma', type: 'department', code: 'PHR', productCount: 305, children: [] },
]

/* ---------------- Brands ---------------- */

export const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Samsung', code: 'BRD-SAM', description: 'Electronics & appliances', productCount: 312, status: 'Active', color: 'bg-[#EFF6FF]', textColor: 'text-[#155DFC]' },
  { id: '2', name: 'Apple', code: 'BRD-APL', description: 'Premium devices & accessories', productCount: 96, status: 'Active', color: 'bg-[#F5F3FF]', textColor: 'text-[#6D28D9]' },
  { id: '3', name: 'Nike', code: 'BRD-NIK', description: 'Sports footwear & apparel', productCount: 184, status: 'Active', color: 'bg-[#ECFDF5]', textColor: 'text-[#009966]' },
  { id: '4', name: 'Dove', code: 'BRD-DOV', description: 'Personal care products', productCount: 78, status: 'Active', color: 'bg-[#FFF7ED]', textColor: 'text-[#F54900]' },
  { id: '5', name: 'Bosch', code: 'BRD-BSH', description: 'Power tools & hardware', productCount: 143, status: 'Active', color: 'bg-[#FEF2F2]', textColor: 'text-[#E7000B]' },
  { id: '6', name: 'Aashirvaad', code: 'BRD-ASH', description: 'Staples & food products', productCount: 57, status: 'Active', color: 'bg-[#FFFBEB]', textColor: 'text-[#E17100]' },
  { id: '7', name: 'Cipla', code: 'BRD-CIP', description: 'Pharmaceuticals', productCount: 210, status: 'Active', color: 'bg-[#F0FDFA]', textColor: 'text-[#0D9488]' },
  { id: '8', name: 'Parker', code: 'BRD-PRK', description: 'Fashion clothing', productCount: 132, status: 'Inactive', color: 'bg-[#F1F5F9]', textColor: 'text-[#64748B]' },
]

/* ---------------- Attributes ---------------- */

export const ATTRIBUTE_COLUMNS: AttributeColumn[] = [
  { id: 'attr-color', name: 'Color', values: ['Black', 'White', 'Blue', 'Red'] },
  { id: 'attr-size', name: 'Size', values: ['S', 'M', 'L', 'XL'] },
  { id: 'attr-material', name: 'Material', values: ['Cotton', 'Leather', 'Plastic'] },
  { id: 'attr-unit', name: 'Unit', values: ['Piece', 'Box', 'Dozen'] },
  { id: 'attr-weight', name: 'Weight', values: ['100g', '250g', '500g', '1Kg'] },
  { id: 'attr-fit', name: 'Fit', values: ['Slim', 'Regular', 'Relaxed'] },
  { id: 'attr-fabric', name: 'Fabric', values: ['Cotton', 'Polyester', 'Blend'] },
  { id: 'attr-variant', name: 'Variant', values: ['Standard', 'Pro'] },
]

export const MOCK_ATTRIBUTE_ROWS: ProductAttributeRow[] = [
  { id: '1', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', attributes: { Color: 'Blue', Size: 'M', Material: 'Plastic', Unit: 'Piece', Weight: '250g', Fit: 'Regular', Fabric: '—', Variant: 'Standard' } },
  { id: '2', productCode: 'APP-NIK-AM270', productName: 'Nike Air Max 270', attributes: { Color: 'Black', Size: 'L', Material: 'Leather', Unit: 'Piece', Weight: '500g', Fit: 'Slim', Fabric: 'Blend', Variant: 'Pro' } },
  { id: '3', productCode: 'FMCG-DOV-BW500', productName: 'Dove Body Wash 500ml', attributes: { Color: 'White', Size: 'XL', Material: 'Cotton', Unit: 'Box', Weight: '1Kg', Fit: 'Relaxed', Fabric: 'Cotton', Variant: 'Standard' } },
  { id: '4', productCode: 'HRD-BSH-DR600', productName: 'Bosch Drill Machine 600W', attributes: { Color: 'Red', Size: 'S', Material: 'Plastic', Unit: 'Piece', Weight: '250g', Fit: 'Regular', Fabric: '—', Variant: 'Standard' } },
  { id: '5', productCode: 'FMCG-ITC-AASH500', productName: 'Aashirvaad Atta 5Kg', attributes: { Color: 'Blue', Size: 'M', Material: 'Blend', Unit: 'Box', Weight: '1Kg', Fit: 'Regular', Fabric: 'Cotton', Variant: 'Pro' } },
  { id: '6', productCode: 'PHR-CIP-AZTH500', productName: 'Azithromycin 500mg Strip', attributes: { Color: 'White', Size: 'S', Material: 'Cotton', Unit: 'Piece', Weight: '100g', Fit: 'Slim', Fabric: '—', Variant: 'Standard' } },
]

/* ---------------- UOM ---------------- */

export const MOCK_UOMS: Uom[] = [
  { id: '1', name: 'Pieces', status: 'Active' },
  { id: '2', name: 'Box', status: 'Active' },
  { id: '3', name: 'Carton', status: 'Active' },
  { id: '4', name: 'Kilogram', status: 'Active' },
  { id: '5', name: 'Grams', status: 'Active' },
  { id: '6', name: 'Metric Ton', status: 'Active' },
  { id: '7', name: 'Litre', status: 'Active' },
  { id: '8', name: 'Millilitre', status: 'Active' },
  { id: '9', name: 'Metre', status: 'Active' },
  { id: '10', name: 'Bottle', status: 'Active' },
  { id: '11', name: 'Packet', status: 'Active' },
  { id: '12', name: 'Strip', status: 'Active' },
]

/* ---------------- Pricing ---------------- */

export const MOCK_PRICE_RULES: PriceRule[] = [
  { id: '1', priceId: 'PRC-001', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', costPrice: 28000, wsp: 31500, rsp: 38999, sellingPrice: 34999, effectiveDate: '01 Apr 2026', status: 'Active' },
  { id: '2', priceId: 'PRC-002', productCode: 'APP-NIK-AM270', productName: 'Nike Air Max 270', costPrice: 6500, wsp: 8200, rsp: 12995, sellingPrice: 9995, effectiveDate: '01 Apr 2026', status: 'Active' },
  { id: '3', priceId: 'PRC-003', productCode: 'FMCG-DOV-BW500', productName: 'Dove Body Wash 500ml', costPrice: 210, wsp: 260, rsp: 349, sellingPrice: 299, effectiveDate: '15 Apr 2026', status: 'Active' },
  { id: '4', priceId: 'PRC-004', productCode: 'HRD-BSH-DR600', productName: 'Bosch Drill Machine 600W', costPrice: 3200, wsp: 4000, rsp: 5499, sellingPrice: 4799, effectiveDate: '15 Apr 2026', status: 'Inactive' },
  { id: '5', priceId: 'PRC-005', productCode: 'FMCG-ITC-AASH500', productName: 'Aashirvaad Atta 5Kg', costPrice: 195, wsp: 225, rsp: 275, sellingPrice: 249, effectiveDate: '01 May 2026', status: 'Active' },
  { id: '6', priceId: 'PRC-006', productCode: 'PHR-CIP-AZTH500', productName: 'Azithromycin 500mg Strip', costPrice: 68, wsp: 85, rsp: 125, sellingPrice: 112, effectiveDate: '01 May 2026', status: 'Active' },
  { id: '7', priceId: 'PRC-007', productCode: 'ELE-APL-IPH15', productName: 'Apple iPhone 15 128GB', costPrice: 62000, wsp: 69000, rsp: 79900, sellingPrice: 75900, effectiveDate: '01 Jun 2026', status: 'Active' },
]

/* ---------------- Vendor Mapping ---------------- */

export const MOCK_VENDOR_MAPPINGS: VendorMapping[] = [
  { id: '1', mappingId: 'VMP-001', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', vendorCode: 'VND-SAM', vendorName: 'Samsung India Pvt Ltd', vendorSku: 'SM-A546EZKDINU', leadTimeDays: 7, moq: 50, mappingType: 'Primary', status: 'Active' },
  { id: '2', mappingId: 'VMP-002', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', vendorCode: 'VND-DIS', vendorName: 'Distributor Hub Mumbai', vendorSku: 'SAM-A54-DIS', leadTimeDays: 3, moq: 10, mappingType: 'Alternate', status: 'Active' },
  { id: '3', mappingId: 'VMP-003', productCode: 'APP-NIK-AM270', productName: 'Nike Air Max 270', vendorCode: 'VND-NIK', vendorName: 'Nike India Official', vendorSku: 'NIK-AM270-BLK', leadTimeDays: 12, moq: 24, mappingType: 'Primary', status: 'Active' },
  { id: '4', mappingId: 'VMP-004', productCode: 'FMCG-DOV-BW500', productName: 'Dove Body Wash 500ml', vendorCode: 'VND-HUL', vendorName: 'Hindustan Unilever Ltd', vendorSku: 'DOV-BW500-CTN', leadTimeDays: 5, moq: 100, mappingType: 'Primary', status: 'Active' },
  { id: '5', mappingId: 'VMP-005', productCode: 'HRD-BSH-DR600', productName: 'Bosch Drill Machine 600W', vendorCode: 'VND-BOS', vendorName: 'Bosch Tools India', vendorSku: 'BSH-GSB600', leadTimeDays: 10, moq: 20, mappingType: 'Primary', status: 'Active' },
  { id: '6', mappingId: 'VMP-006', productCode: 'FMCG-ITC-AASH500', productName: 'Aashirvaad Atta 5Kg', vendorCode: 'VND-ITC', vendorName: 'ITC Foods Division', vendorSku: 'ITC-ASH5KG', leadTimeDays: 4, moq: 80, mappingType: 'Primary', status: 'Active' },
  { id: '7', mappingId: 'VMP-007', productCode: 'ELE-APL-IPH15', productName: 'Apple iPhone 15 128GB', vendorCode: 'VND-RED', vendorName: 'Redington India', vendorSku: 'IPH15-128-BLK', leadTimeDays: 6, moq: 5, mappingType: 'Primary', status: 'Active' },
]

/* ---------------- Tax ---------------- */

export const MOCK_TAX_CONFIGS: TaxConfig[] = [
  { id: '1', taxId: 'TAX-001', productCode: 'ELE-SAM-A54', productName: 'Samsung Galaxy A54 5G', hsnSac: '8471', taxGroup: 'Electronics 18%', cgst: 9, sgst: 9, igst: 18, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
  { id: '2', taxId: 'TAX-002', productCode: 'APP-NIK-AM270', productName: 'Nike Air Max 270', hsnSac: '6404', taxGroup: 'Apparel 12%', cgst: 6, sgst: 6, igst: 12, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
  { id: '3', taxId: 'TAX-003', productCode: 'FMCG-DOV-BW500', productName: 'Dove Body Wash 500ml', hsnSac: '3401', taxGroup: 'FMCG 18%', cgst: 9, sgst: 9, igst: 18, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
  { id: '4', taxId: 'TAX-004', productCode: 'HRD-BSH-DR600', productName: 'Bosch Drill Machine 600W', hsnSac: '8467', taxGroup: 'Hardware 18%', cgst: 9, sgst: 9, igst: 18, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
  { id: '5', taxId: 'TAX-005', productCode: 'FMCG-ITC-AASH500', productName: 'Aashirvaad Atta 5Kg', hsnSac: '1101', taxGroup: 'Grocery 5%', cgst: 2.5, sgst: 2.5, igst: 5, cess: 0, effectiveDate: '01 Apr 2026', isDefault: true },
  { id: '6', taxId: 'TAX-006', productCode: 'PHR-CIP-AZTH500', productName: 'Azithromycin 500mg Strip', hsnSac: '3004', taxGroup: 'Pharma 12%', cgst: 6, sgst: 6, igst: 12, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
  { id: '7', taxId: 'TAX-007', productCode: 'ELE-APL-IPH15', productName: 'Apple iPhone 15 128GB', hsnSac: '8517', taxGroup: 'Electronics 18%', cgst: 9, sgst: 9, igst: 18, cess: 0, effectiveDate: '01 Apr 2026', isDefault: false },
]

/* ---------------- Barcode ---------------- */

export const MOCK_BARCODES: Barcode[] = [
  { id: '1', barcodeId: 'BAR-001', productName: 'Samsung Galaxy A54 5G', productCode: 'ELE-SAM-A54', value: '8806094760583', type: 'EAN-13', format: '1D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:14', status: 'Active' },
  { id: '2', barcodeId: 'BAR-002', productName: 'Nike Air Max 270', productCode: 'APP-NIK-AM270', value: '0195866882527', type: 'EAN-13', format: '1D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:20', status: 'Active' },
  { id: '3', barcodeId: 'BAR-003', productName: 'Dove Body Wash 500ml', productCode: 'FMCG-DOV-BW500', value: '8901030784743', type: 'EAN-13', format: '1D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:26', status: 'Active' },
  { id: '4', barcodeId: 'BAR-004', productName: 'Bosch Drill 600W', productCode: 'HRD-BSH-DR600', value: '3165140557009', type: 'EAN-13', format: '1D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:31', status: 'Active' },
  { id: '5', barcodeId: 'BAR-005', productName: 'Apple iPhone 15 128GB', productCode: 'ELE-APL-IPH15', value: 'APL-IPH15-128-BLK', type: 'QR', format: '2D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:38', status: 'Active' },
  { id: '6', barcodeId: 'BAR-006', productName: 'Aashirvaad Atta 5Kg', productCode: 'FMCG-ITC-AASH500', value: '8901030800015', type: 'EAN-13', format: '1D', batch: 'BCH-2025-001', generatedAt: '12 Jun 2026 09:44', status: 'Active' },
]

export const BARCODE_STATS = {
  total: 8432,
  ean13: 7840,
  qr: 592,
  unassigned: 48,
  lastBatch: 'BCH-2025-001',
  batchCount: 6,
}

export const DATA_VERIFICATION_MOCK = {
  total: 250,
  valid: 242,
  issues: 5,
  duplicates: 3,
  rows: [
    { row: 1, productName: 'Samsung Galaxy A54 5G', productCode: 'SAM-A54-5G' as string | null, mrp: '$449.00', status: 'Valid' as const },
    { row: 3, productName: 'Wireless Charger Pad', productCode: null, mrp: '$29.99', status: 'Missing Code' as const },
    { row: 4, productName: 'Apple iPhone 15 Pro', productCode: 'APP-IP15P' as string | null, mrp: '$999.00', status: 'Valid' as const },
    { row: 7, productName: 'Wireless Charger Pad', productCode: 'SAM-A54-5G' as string | null, mrp: '$29.99', status: 'Duplicate' as const },
  ],
  systemNotes: [
    'Row 3: Product Code is absent. System will auto-generate barcode upon submission.',
    'Row 7: Duplicate Product Code found matching Row 1. System recommends ignoring Row 7.',
  ],
}

/* ---------------- Inventory Configuration ---------------- */

export const MOCK_INVENTORY_CONFIG: InventoryConfigCard[] = [
  {
    id: 'card-general',
    title: 'General Settings',
    description: 'Core inventory behaviour for this organization',
    items: [
      { id: 'cfg-1', label: 'Enable Batch Tracking', description: 'Track inventory by batch numbers for expiry-sensitive goods', enabled: true },
      { id: 'cfg-2', label: 'Enable Serial Number Tracking', description: 'Assign unique serials to serialized items', enabled: false },
      { id: 'cfg-3', label: 'Allow Negative Stock', description: 'Permit sales when stock falls below zero', enabled: false },
      { id: 'cfg-4', label: 'Enable Multi-Warehouse Transfers', description: 'Move stock between warehouses with audit trail', enabled: true },
    ],
  },
  {
    id: 'card-valuation',
    title: 'Valuation & Costing',
    description: 'Costing method and stock valuation rules',
    items: [
      { id: 'cfg-5', label: 'FIFO Costing Method', description: 'First-in-first-out cost layers for COGS', enabled: true },
      { id: 'cfg-6', label: 'Landed Cost Allocation', description: 'Distribute freight & duty across inbound items', enabled: true },
      { id: 'cfg-7', label: 'Auto COGS Recalculation', description: 'Recalculate COGS after inventory transactions', enabled: false },
      { id: 'cfg-8', label: 'Reorder Level Alerts', description: 'Notify when stock hits reorder threshold', enabled: true },
    ],
  },
]

/* ---------------- Kitting & Bundling ---------------- */

export const MOCK_BUNDLES: Bundle[] = [
  {
    id: '1', bundleCode: 'BND-SMRT-001', bundleName: 'Samsung Smart Bundle', bundleProductCode: 'BND-0001', type: 'Bundle', status: 'Active',
    components: [
      { id: 'c1', productName: 'Samsung Galaxy A54', productCode: 'SKU-1091', qty: 1, uom: 'Piece', cost: 28000 },
      { id: 'c2', productName: 'Tempered Glass', productCode: 'SKU-2043', qty: 1, uom: 'Piece', cost: 199 },
      { id: 'c3', productName: 'Silicone Case', productCode: 'SKU-2088', qty: 1, uom: 'Piece', cost: 349 },
    ],
    totalCost: 28548,
  },
  {
    id: '2', bundleCode: 'BND-FTNS-001', bundleName: 'Fitness Starter Kit', bundleProductCode: 'BND-0002', type: 'Bundle', status: 'Active',
    components: [
      { id: 'c1', productName: 'Yoga Mat 6mm', productCode: 'SKU-3010', qty: 1, uom: 'Piece', cost: 899 },
      { id: 'c2', productName: 'Dumbbell Set 5Kg', productCode: 'SKU-3011', qty: 2, uom: 'Piece', cost: 1499 },
    ],
    totalCost: 3897,
  },
  {
    id: '3', bundleCode: 'KIT-CLNG-001', bundleName: 'Home Cleaning Kit', bundleProductCode: 'BND-0003', type: 'Kit', status: 'Active',
    components: [
      { id: 'c1', productName: 'Surface Cleaner 1L', productCode: 'SKU-4010', qty: 2, uom: 'Bottle', cost: 199 },
      { id: 'c2', productName: 'Microfiber Cloth', productCode: 'SKU-4011', qty: 3, uom: 'Piece', cost: 49 },
    ],
    totalCost: 545,
  },
  {
    id: '4', bundleCode: 'BND-TOOL-001', bundleName: 'Power Tools Pro Bundle', bundleProductCode: 'BND-0004', type: 'Bundle', status: 'Active',
    components: [
      { id: 'c1', productName: 'Bosch Drill 600W', productCode: 'SKU-5010', qty: 1, uom: 'Piece', cost: 3200 },
      { id: 'c2', productName: 'Drill Bit Set', productCode: 'SKU-5011', qty: 1, uom: 'Box', cost: 599 },
    ],
    totalCost: 3799,
  },
  {
    id: '5', bundleCode: 'KIT-PRSNL-001', bundleName: 'Personal Care Essentials', bundleProductCode: 'BND-0005', type: 'Kit', status: 'Active',
    components: [
      { id: 'c1', productName: 'Dove Body Wash 500ml', productCode: 'SKU-6010', qty: 1, uom: 'Bottle', cost: 210 },
      { id: 'c2', productName: 'Shampoo 340ml', productCode: 'SKU-6011', qty: 1, uom: 'Bottle', cost: 240 },
    ],
    totalCost: 450,
  },
]

/* ---------------- Dropdown options ---------------- */

export const TAX_GROUPS = ['Electronics 18%', 'Apparel 12%', 'FMCG 18%', 'Hardware 18%', 'Grocery 5%', 'Pharma 12%']
export const DEPARTMENTS = ['Electronics', 'Apparel', 'FMCG', 'Hardware', 'Pharma']
export const SECTIONS = ['Mobiles', 'Audio', 'Footwear', 'Clothing', 'Personal Care', 'Grocery', 'Power Tools', 'Medicines']
export const COLORS = ['Black', 'White', 'Blue', 'Red']
export const SIZES = ['S', 'M', 'L', 'XL']
export const MATERIALS = ['Cotton', 'Leather', 'Plastic']
export const BRAND_NAMES = ['Samsung', 'Apple', 'Nike', 'Dove', 'Bosch', 'Aashirvaad', 'Cipla', 'Parker']
export const UOM_OPTIONS = ['Pieces', 'Box', 'Carton', 'Kilogram', 'Bottle', 'Packet', 'Strip']
export const PRODUCT_OPTIONS = MOCK_PRODUCTS.map((p) => p.productName)
export const VENDOR_NAMES = ['Samsung India Pvt Ltd', 'Nike India Official', 'Hindustan Unilever Ltd', 'Bosch Tools India', 'ITC Foods Division', 'Redington India']
export const PRICE_RULE_TYPES = ['Cost Plus', 'Fixed', 'Margin', 'Promotional'] as const
export const ROUNDING_OPTIONS = ['None', '0.99', 'Nearest 10'] as const
