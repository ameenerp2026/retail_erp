import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { PRODUCT_SETUP_TABS } from '@/config/productSetupTabs'
import ProductsTab from '../components/products/ProductsTab'
import HierarchyTab from '../components/hierarchy/HierarchyTab'
import BrandsTab from '../components/brands/BrandsTab'
import AttributesTab from '../components/attributes/AttributesTab'
import UomTab from '../components/uom/UomTab'
import PricingTab from '../components/pricing/PricingTab'
import TaxTab from '../components/tax/TaxTab'
import VendorMappingTab from '../components/vendors/VendorMappingTab'
import BarcodeTab from '../components/barcode/BarcodeTab'
import InventoryConfigTab from '../components/config/InventoryConfigTab'
import KittingTab from '../components/kitting/KittingTab'

export default function ProductSetup() {
  return (
    <div className="page-shell">
      {/* In-page 11-tab toolbar (breadcrumb lives in the TopBar) */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">
        {PRODUCT_SETUP_TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={`/inventory/product-setup/${tab.key}`}
            className={({ isActive }) =>
              `shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border-[#155DFC] text-[#155DFC]'
                  : 'border-transparent text-slate-500 hover:text-[#155DFC]'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsTab />} />
          <Route path="hierarchy" element={<HierarchyTab />} />
          <Route path="brands" element={<BrandsTab />} />
          <Route path="attributes" element={<AttributesTab />} />
          <Route path="uom" element={<UomTab />} />
          <Route path="pricing" element={<PricingTab />} />
          <Route path="tax" element={<TaxTab />} />
          <Route path="vendors" element={<VendorMappingTab />} />
          <Route path="barcode" element={<BarcodeTab />} />
          <Route path="inv-config" element={<InventoryConfigTab />} />
          <Route path="kitting" element={<KittingTab />} />
        </Routes>
      </div>
    </div>
  )
}
