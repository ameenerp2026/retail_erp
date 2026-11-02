import { useState } from 'react'
import { Activity, AlertTriangle, Check, ImagePlus, Printer, SquarePen, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Drawer from '@/components/shared/Drawer'
import { FieldWrap, SelectInput, TextInput } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import type { Product } from '@/types/inventorySetup'

/* ---------------- Tabs (exact design order) ---------------- */

const DRAWER_TABS = [
  { key: 'general', label: 'General' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'tax', label: 'Tax' },
  { key: 'images', label: 'Images' },
  { key: 'history', label: 'History' },
  { key: 'timeline', label: 'Timeline' },
] as const

type DrawerTabKey = (typeof DRAWER_TABS)[number]['key']
const ALL_TABS: DrawerTabKey[] = [
  'general',
  'inventory',
  'pricing',
  'tax',
  'images',
  'history',
  'timeline',
]

/* ---------------- Horizontal Tab Navigation Bar ---------------- */

function DrawerTabBar({
  active,
  onChange,
  tabs,
}: {
  active: DrawerTabKey
  onChange: (key: DrawerTabKey) => void
  tabs: readonly DrawerTabKey[]
}) {
  return (
    <div className="flex items-center gap-6 sm:gap-7 border-b border-slate-200 bg-white px-6 overflow-x-auto scrollbar-none">
      {tabs.map((key) => {
        const label = DRAWER_TABS.find((t) => t.key === key)?.label ?? key
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative py-3 text-[12px] sm:text-[12.5px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? 'text-[#2563EB] font-semibold'
                : 'text-slate-500 hover:text-[#2563EB]'
            }`}
          >
            {label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Two-column grid used by form tabs */
function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-5 gap-y-3.5 sm:grid-cols-2">{children}</div>
}

/* ---------------- Dropdown Option Lists ---------------- */

const GROUP_OPTIONS = ['Electronics', 'Apparel', 'FMCG', 'Hardware', 'Pharma']
const DEPARTMENT_OPTIONS = ['Electronics', 'Apparel', 'FMCG', 'Hardware', 'Pharma']
const SECTION_OPTIONS = ['Mobiles', 'Audio', 'Footwear', 'Power Tools', 'Clothing', 'Personal Care', 'Electricals']
const BRAND_OPTIONS = ['Samsung', 'Nike', 'Dove', 'Bosch', 'Levis', 'Voltaren', 'Apple', 'HUL', 'Syska', 'Sony', 'ITC', 'Cipla']
const UOM_OPTIONS = ['PCS', 'BTL', 'TUB', 'PKT', 'KGS', 'STR']
const PRODUCT_TYPE_OPTIONS = ['Finished Good', 'Raw Material', 'Service']
const VENDOR_OPTIONS = [
  'Samsung India Pvt Ltd',
  'Redington India',
  'Distributor Hub Mumbai',
  'Nike Sports India',
  'HUL Distribution Ltd',
]

/* ---------------- Form State Type ---------------- */

export type ProductFormData = {
  productCode: string
  oemCode: string
  productName: string
  group: string
  department: string
  section: string
  brand: string
  uom: string
  productType: string
  vendor: string
  attr1: string
  attr2: string
  status: string
}

/* ---------------- General Tab (Figma Screenshot 2) ---------------- */

function GeneralSection({
  formData,
  setFormData,
}: {
  formData: ProductFormData
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
}) {
  const updateField = (key: keyof ProductFormData, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-2.5">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#D97706]" />
        <p className="text-[11.5px] leading-relaxed text-[#92400E]">
          Product Code is auto-generated and cannot be changed after creation. Ensure all mandatory
          fields are filled before saving.
        </p>
      </div>

      <FieldGrid>
        {/* Row 1 */}
        <div>
          <FieldWrap label="Product Code" required>
            <TextInput
              placeholder="Will be auto-generated"
              value={formData.productCode}
              disabled
            />
          </FieldWrap>
          <p className="mt-1 text-[11px] text-slate-400">Auto-generated on save</p>
        </div>

        <FieldWrap label="OEM Code" required>
          <TextInput
            placeholder="e.g. PRD-001"
            value={formData.oemCode}
            onChange={(v) => updateField('oemCode', v)}
          />
        </FieldWrap>

        {/* Row 2 */}
        <FieldWrap label="Product Name" required>
          <TextInput
            placeholder="e.g. Samsung Galaxy A54 5G"
            value={formData.productName}
            onChange={(v) => updateField('productName', v)}
          />
        </FieldWrap>

        <FieldWrap label="Group" required>
          <SelectInput
            options={GROUP_OPTIONS}
            value={formData.group}
            placeholder="Select dropdown"
            onChange={(v) => updateField('group', v)}
          />
        </FieldWrap>

        {/* Row 3 */}
        <FieldWrap label="Department" required>
          <SelectInput
            options={DEPARTMENT_OPTIONS}
            value={formData.department}
            placeholder="Select dropdown"
            onChange={(v) => updateField('department', v)}
          />
        </FieldWrap>

        <FieldWrap label="Section">
          <SelectInput
            options={SECTION_OPTIONS}
            value={formData.section}
            placeholder="Select dropdown"
            onChange={(v) => updateField('section', v)}
          />
        </FieldWrap>

        {/* Row 4 */}
        <FieldWrap label="Brand">
          <SelectInput
            options={BRAND_OPTIONS}
            value={formData.brand}
            placeholder="Select dropdown"
            onChange={(v) => updateField('brand', v)}
          />
        </FieldWrap>

        <FieldWrap label="UOM" required>
          <SelectInput
            options={UOM_OPTIONS}
            value={formData.uom}
            placeholder="Select dropdown"
            onChange={(v) => updateField('uom', v)}
          />
        </FieldWrap>

        {/* Row 5 */}
        <FieldWrap label="Product Type" required>
          <SelectInput
            options={PRODUCT_TYPE_OPTIONS}
            value={formData.productType}
            placeholder="Select dropdown"
            onChange={(v) => updateField('productType', v)}
          />
        </FieldWrap>

        <FieldWrap label="Select Vendor" required>
          <SelectInput
            options={VENDOR_OPTIONS}
            value={formData.vendor}
            placeholder="Select dropdown"
            onChange={(v) => updateField('vendor', v)}
          />
        </FieldWrap>

        {/* Row 6 */}
        <FieldWrap label="Attribute 1" required>
          <SelectInput
            options={['Color', 'Size', 'Material', 'Warranty']}
            value={formData.attr1}
            placeholder="Select dropdown"
            onChange={(v) => updateField('attr1', v)}
          />
        </FieldWrap>

        <FieldWrap label="Attribute 2" required>
          <SelectInput
            options={['Storage', 'Size', 'Fit', 'Capacity', 'RAM']}
            value={formData.attr2}
            placeholder="Select dropdown"
            onChange={(v) => updateField('attr2', v)}
          />
        </FieldWrap>
      </FieldGrid>
    </div>
  )
}

/* ---------------- Inventory Tab ---------------- */

function InventorySection() {
  const [tracking, setTracking] = useState({ batch: false, serial: false, expiry: false })
  const toggle = (key: keyof typeof tracking) => setTracking((t) => ({ ...t, [key]: !t[key] }))

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Inventory Rules</SectionLabel>
        <div className="mt-3">
          <FieldGrid>
            <FieldWrap label="Batch">
              <TextInput type="number" value={0} onChange={() => {}} />
            </FieldWrap>
            <FieldWrap label="Serial Number">
              <TextInput type="number" value={0} onChange={() => {}} />
            </FieldWrap>
            <FieldWrap label="Expiry Date">
              <input
                type="date"
                defaultValue="2026-12-31"
                className="h-[38px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-[13px] text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
              />
            </FieldWrap>
            <FieldWrap label="Negative Stocks">
              <TextInput type="number" value={0} onChange={() => {}} />
            </FieldWrap>
          </FieldGrid>
        </div>
      </div>

      <div>
        <SectionLabel>Tracking Configuration</SectionLabel>
        <div className="mt-3 space-y-2.5">
          {(
            [
              ['batch', 'Enable Batch Tracking'],
              ['serial', 'Enable Serial Number Tracking'],
              ['expiry', 'Enable Expiry Date Tracking'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={tracking[key]}
                onChange={() => toggle(key)}
                className="h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
              />
              <span className="text-xs sm:text-[13px] text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Pricing Tab ---------------- */

function PricingSection({ product }: { product?: Product | null }) {
  return (
    <FieldGrid>
      <FieldWrap label="Cost Price">
        <TextInput type="number" value={product?.costPrice ?? 28500} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="WSP Margin %">
        <TextInput type="number" value={15} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="RSP Margin %">
        <TextInput type="number" value={22} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="WSP ( Wholesale Price )">
        <TextInput type="number" value={32000} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="RSP ( Retail Sale Price )">
        <TextInput type="number" value={product?.sellingPrice ?? 34999} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="MRP ( Maximum Retail Price )">
        <TextInput type="number" value={product?.mrp ?? 38500} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="Price Effective From">
        <input
          type="date"
          defaultValue="2025-01-01"
          className="h-[38px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-[13px] text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
        />
      </FieldWrap>
      <FieldWrap label="Price Effective To">
        <input
          type="date"
          defaultValue="2025-12-31"
          className="h-[38px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-[13px] text-slate-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
        />
      </FieldWrap>
    </FieldGrid>
  )
}

/* ---------------- Tax Tab ---------------- */

function TaxSection({ product }: { product?: Product | null }) {
  return (
    <FieldGrid>
      <FieldWrap label="HSN Code" required>
        <TextInput placeholder="e.g. 8517 12 90" value={product?.hsnSac || '8517 12 90'} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="GST Rate" required>
        <SelectInput
          options={['0%', '5%', '12%', '18%', '28%']}
          value="18%"
          placeholder="Select dropdown"
        />
      </FieldWrap>
      <FieldWrap label="Tax Group">
        <SelectInput
          options={['Electronics 18%', 'Apparel 12%', 'FMCG 18%', 'Grocery 5%']}
          value="Electronics 18%"
          placeholder="Select dropdown"
        />
      </FieldWrap>
      <FieldWrap label="CESS (%)">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
    </FieldGrid>
  )
}

/* ---------------- Images Tab ---------------- */

function ImagesSection() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 py-12">
      <div className="flex flex-col items-center gap-1 text-center">
        <ImagePlus size={28} className="mb-2 text-slate-400" />
        <p className="text-sm font-semibold text-slate-700">Drag &amp; drop product images here</p>
        <p className="text-xs text-slate-400">Supports JPEG, PNG, WEBP up to 5MB each</p>
        <button
          type="button"
          className="mt-4 h-9 rounded-lg bg-[#2563EB] px-4 text-xs sm:text-sm font-medium text-white transition hover:bg-[#1D4ED8] cursor-pointer"
        >
          Browse Files
        </button>
      </div>
    </div>
  )
}

/* ---------------- History Tab (Figma Reference Image 1) ---------------- */

type AuditEntry = {
  title: string
  detail: string
  meta: string
}

const AUDIT_TRAIL: AuditEntry[] = [
  {
    title: 'Price Updated',
    detail: 'Sell price changed from ₹32,999 to ₹34,999',
    meta: 'by Priya Menon · 2025-01-15 14:32',
  },
  {
    title: 'Stock Received',
    detail: '50 units received via GRN-2501244',
    meta: 'by Karthik R. · 2025-01-14 09:15',
  },
  {
    title: 'Attribute Added',
    detail: "Added 'Color: Blue' variant attribute",
    meta: 'by Arjun Sharma · 2025-01-12 11:45',
  },
  {
    title: 'Product Created',
    detail: 'Product created with initial configuration',
    meta: 'by Arjun Sharma · 2025-01-01 10:00',
  },
]

function HistorySection() {
  return (
    <div>
      <h3 className="mb-4 text-[14px] font-bold text-[#0F2A66] tracking-tight">
        Audit Trail
      </h3>
      <div className="divide-y divide-slate-100">
        {AUDIT_TRAIL.map((entry) => (
          <div key={entry.title} className="flex items-start gap-3.5 py-3.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#2563EB]">
              <Activity size={13.5} strokeWidth={2.2} className="text-[#2563EB]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-[#1E40AF] leading-snug">
                {entry.title}
              </p>
              <p className="mt-0.5 text-[12px] text-slate-600 leading-snug">
                {entry.detail}
              </p>
              <p className="mt-1 text-[11px] text-[#7185A5]">
                {entry.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Timeline Tab (Figma Reference Image 3) ---------------- */

type TimelineEvent = {
  title: string
  date: string
  dot: string
}

const TIMELINE: TimelineEvent[] = [
  {
    title: 'Stock Received: 50 units (GRN-2501244)',
    date: 'Jan 14, 2025 09:15',
    dot: 'bg-[#10B981]',
  },
  {
    title: 'Price Updated: ₹32,999 → ₹34,999',
    date: 'Jan 12, 2025 14:32',
    dot: 'bg-[#2563EB]',
  },
  {
    title: 'Barcode Generated: EAN-13 #880609476…',
    date: 'Jan 10, 2025 11:20',
    dot: 'bg-[#9333EA]',
  },
  {
    title: 'Low Stock Alert: below reorder level',
    date: 'Jan 08, 2025 08:45',
    dot: 'bg-[#F59E0B]',
  },
  {
    title: 'Approval Granted by Arun Nair (Manager)',
    date: 'Jan 01, 2025 10:30',
    dot: 'bg-[#0D9488]',
  },
  {
    title: 'Product Created by Arjun Sharma',
    date: 'Jan 01, 2025 10:00',
    dot: 'bg-[#64748B]',
  },
]

function TimelineSection() {
  return (
    <div className="relative pt-1">
      {/* Continuous vertical guide line accurately centered through the dots */}
      <span
        className="absolute top-2.5 bottom-3.5 left-[10px] w-[1.5px] bg-[#E2E8F0]"
        aria-hidden="true"
      />
      <div className="space-y-5.5">
        {TIMELINE.map((event) => (
          <div key={event.title} className="relative flex items-start gap-3.5 pl-0.5">
            <span
              className={`relative z-10 mt-1 h-2 w-2 shrink-0 rounded-full ring-2 ring-white ${event.dot}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-[#0F2A66] leading-snug">
                {event.title}
              </p>
              <p className="mt-0.5 text-[11px] text-[#7185A5] leading-snug">
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Drawer Footers ---------------- */

function CreateFooter({
  onClose,
  onCreate,
  onSaveDraft,
}: {
  onClose: () => void
  onCreate: () => void
  onSaveDraft: () => void
}) {
  return (
    <div className="flex-shrink-0 flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3">
      <button
        type="button"
        onClick={onClose}
        className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-2xs"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-2xs"
      >
        Save as Draft
      </button>
      <button
        type="button"
        onClick={onCreate}
        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-xs font-medium text-white transition hover:bg-[#1D4ED8] cursor-pointer shadow-xs"
      >
        <Check size={14} className="stroke-[2.5]" />
        <span>Create Product</span>
      </button>
    </div>
  )
}

function ViewFooter({
  onClose,
  onEdit,
}: {
  onClose: () => void
  onEdit?: () => void
}) {
  return (
    <div className="flex-shrink-0 flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3">
      <button
        type="button"
        onClick={onClose}
        className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-2xs"
      >
        Close
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer shadow-2xs"
      >
        <Printer size={13.5} className="text-slate-500" />
        <span>Print</span>
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="flex h-9 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-xs font-medium text-white transition hover:bg-[#1D4ED8] cursor-pointer shadow-xs"
      >
        <SquarePen size={13.5} />
        <span>Edit Product</span>
      </button>
    </div>
  )
}

/* ---------------- Drawer Root Component ---------------- */

type Props = {
  isOpen: boolean
  onClose: () => void
  /** When set, the drawer shows product detail view (History/Timeline, Edit footer). */
  product?: Product | null
  /** Callback when product is created or updated */
  onProductCreated?: (product: Partial<Product>) => void
}

export default function CreateProductDrawer({ isOpen, onClose, product, onProductCreated }: Props) {
  const isView = !!product
  // Drawer state is seeded from the product prop. The parent gives this drawer
  // a `key` that changes on every open, so it remounts and re-seeds cleanly —
  // no reset effect needed.
  const [activeTab, setActiveTab] = useState<DrawerTabKey>('history')

  const [formData, setFormData] = useState<ProductFormData>(product ? {
          productCode: product.productCode || '',
          oemCode: product.prdCode || 'PRD-001',
          productName: product.productName || '',
          group: product.group || 'Electronics',
          department: product.department || 'Electronics',
          section: product.section || 'Mobiles',
          brand: product.brand || 'Samsung',
          uom: product.uom || 'PCS',
          productType: 'Finished Good',
          vendor: 'Samsung India Pvt Ltd',
          attr1: 'Color',
          attr2: 'Storage',
          status: product.status || 'Active',
        } : {
          productCode: '',
          oemCode: 'PRD-001',
          productName: '',
          group: 'Electronics',
          department: 'Electronics',
          section: 'Mobiles',
          brand: 'Samsung',
          uom: 'PCS',
          productType: 'Finished Good',
          vendor: 'Samsung India Pvt Ltd',
          attr1: 'Color',
          attr2: 'Storage',
          status: 'Active',
        } as ProductFormData)

  const tabs = ALL_TABS
  const current = activeTab

  const handleCreate = () => {
    if (!formData.productName.trim()) {
      toast.error('Please enter a product name')
      return
    }
    const newCode = `PRD-${Date.now().toString().slice(-4)}`
    toast.success('Product created successfully!')
    onProductCreated?.({
      id: String(Date.now()),
      productCode: newCode,
      productName: formData.productName,
      group: formData.group,
      department: formData.department,
      section: formData.section,
      brand: formData.brand,
      uom: formData.uom,
      status: 'Active',
    })
    onClose()
  }

  const handleSaveDraft = () => {
    toast.success('Product saved as draft')
    onClose()
  }

  const sectionMap: Record<DrawerTabKey, React.ReactNode> = {
    general: <GeneralSection formData={formData} setFormData={setFormData} />,
    inventory: <InventorySection />,
    pricing: <PricingSection product={product} />,
    tax: <TaxSection product={product} />,
    images: <ImagesSection />,
    history: <HistorySection />,
    timeline: <TimelineSection />,
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="productDetail" raw>
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header - Unified seamlessly with Tab Bar without separating border */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-5 pb-3 bg-white">
          <div>
            <h2 className="text-[20px] font-bold text-[#0F2A66] leading-tight tracking-tight">
              {isView || activeTab === 'history' || activeTab === 'timeline'
                ? (product?.productName || 'Samsung Galaxy A54 5G')
                : 'Create New Product'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 font-normal leading-normal">
              {isView || activeTab === 'history' || activeTab === 'timeline'
                ? `${product?.productCode || 'ELE-SAM-A54'} · ${product?.category || product?.department || product?.group || 'Electronics'} · ${product?.brand || 'Samsung'}`
                : 'Fill in the details to add a new product to the catalog'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1 -mr-1 -mt-0.5 cursor-pointer rounded-lg hover:bg-slate-100"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar with bottom border */}
        <div className="flex-shrink-0">
          <DrawerTabBar active={current} onChange={setActiveTab} tabs={tabs} />
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
          {sectionMap[current]}
        </div>

        {/* Sticky/Fixed Footer */}
        {isView || activeTab === 'history' || activeTab === 'timeline' ? (
          <ViewFooter onClose={onClose} onEdit={() => setActiveTab('general')} />
        ) : (
          <CreateFooter
            onClose={onClose}
            onCreate={handleCreate}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </div>
    </Drawer>
  )
}