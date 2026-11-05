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
import ActivityTab from '../components/activity/ActivityTab'
import KittingTab from '../components/kitting/KittingTab'

export default function ProductSetup() {
  return (
    <div className="page-shell">
      {/* In-page tabs toolbar */}
      <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto border-b border-slate-200 bg-white px-4 sm:px-6 scrollbar-none">
        {PRODUCT_SETUP_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.key}
              to={`/inventory/product-setup/${tab.key}`}
              className={({ isActive }) =>
                `flex items-center gap-2 shrink-0 whitespace-nowrap border-b-2 py-3 px-1 text-xs sm:text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'border-[#155DFC] text-[#155DFC] font-semibold -mb-[1px]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`
              }
            >
              <Icon size={15} className="shrink-0" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
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
          <Route path="activity" element={<ActivityTab />} />
          <Route path="kitting" element={<KittingTab />} />
        </Routes>
      </div>
    </div>
  )
}
