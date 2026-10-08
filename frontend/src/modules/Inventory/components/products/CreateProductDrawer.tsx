import { useState } from 'react'
import { Check, ImagePlus, Printer, SquarePen, X } from 'lucide-react'
import Drawer from '@/components/shared/Drawer'
import { FieldWrap, SelectInput, TextInput } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import type { Product } from '@/types/inventorySetup'

/* ---------------- Tabs (design order) ---------------- */

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

const FORM_TABS: DrawerTabKey[] = ['general', 'inventory', 'pricing', 'tax', 'images']
const VIEW_TABS: DrawerTabKey[] = ['general', 'inventory', 'pricing', 'tax', 'images', 'history', 'timeline']

/* ---------------- Shared bits ---------------- */

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
    <div className="flex gap-6 border-b border-slate-100 px-7">
      {tabs.map((key) => {
        const label = DRAWER_TABS.find((t) => t.key === key)?.label ?? key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`-mb-px border-b-2 py-3.5 text-sm font-medium transition ${
              active === key
                ? 'border-[#155DFC] text-[#155DFC]'
                : 'border-transparent text-[#6B7A99] hover:text-[#155DFC]'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

/** Two-column grid used by every form tab in the design. */
function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>
}

/* ---------------- General tab (design: Create New Product / General) ---------------- */

const GROUP_OPTIONS = ['Group A', 'Group B', 'Group C']
const DEPARTMENT_OPTIONS = ['Electronics', 'Apparel', 'FMCG', 'Pharma', 'Hardware']
const SECTION_OPTIONS = ['Mobiles', 'Audio', 'Footwear', 'Grocery', 'Tools']
const UOM_OPTIONS = ['PCS', 'BTL', 'TUB', 'PKT', 'KGS']
const VENDOR_OPTIONS = [
  'Samsung India Pvt Ltd',
  'Redington India',
  'Distributor Hub Mumbai',
  'Nike Sports India',
]
const STATUS_OPTIONS = ['Active', 'Draft', 'Inactive']

function GeneralSection() {
  return (
    <div className="space-y-5">
      {/* Warning banner (design: amber info box at top of General) */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[#FDB515]/50 bg-[#FFFBEB] px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-[#B45309]">
          <path
            d="M12 9v4m0 4h.01M10.299 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[13px] leading-relaxed text-[#92400E]">
          Product Code is auto-generated and cannot be changed after creation. Ensure all mandatory
          fields are filled before saving.
        </p>
      </div>

      <FieldGrid>
        <div>
          <FieldWrap label="Product Code" required>
            <TextInput placeholder="Will be auto-generated" disabled />
          </FieldWrap>
          <p className="mt-1 text-xs text-[#6B7A99]">Auto-generated on save</p>
        </div>
        <FieldWrap label="OEM Code" required>
          <TextInput placeholder="" />
        </FieldWrap>
        <FieldWrap label="Product Name" required>
          <TextInput placeholder="e.g. Samsung Galaxy A54 5G" />
        </FieldWrap>
        <FieldWrap label="Group" required>
          <SelectInput options={GROUP_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
        {/* Design label spells "Dpartement" */}
        <FieldWrap label="Dpartement" required>
          <SelectInput options={DEPARTMENT_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Section">
          <SelectInput options={SECTION_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Brand">
          <SelectInput options={['Samsung', 'Nike', 'Dove', 'Bosch', 'Levis']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="UOM" required>
          <SelectInput options={UOM_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Product Type" required>
          <SelectInput options={['Finished Good', 'Raw Material', 'Service']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Select Vendor" required>
          <SelectInput options={VENDOR_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Attribute 1" required>
          <SelectInput options={['Color', 'Size', 'Material']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Attribute 2" required>
          <SelectInput options={['Size', 'Storage', 'Fit']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Attribute 3" required>
          <SelectInput options={['Material', 'Fabric', 'Capacity']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Attribute 4" required>
          <SelectInput options={['Brand', 'Pattern', 'Warranty']} placeholder="Select dropdown" />
        </FieldWrap>
        <FieldWrap label="Status" required>
          <SelectInput options={STATUS_OPTIONS} placeholder="Select dropdown" />
        </FieldWrap>
      </FieldGrid>
    </div>
  )
}

/* ---------------- Inventory tab (design: Inventory Rules + Tracking Configuration) ---------------- */

function InventorySection() {
  const [tracking, setTracking] = useState({ batch: false, serial: false, expiry: false })
  const toggle = (key: keyof typeof tracking) => setTracking((t) => ({ ...t, [key]: !t[key] }))

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Inventory Rules</SectionLabel>
        <div className="mt-4">
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
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20"
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
        <div className="mt-4 space-y-3">
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
                className="h-4 w-4 rounded border-slate-300 accent-[#155DFC]"
              />
              <span className="text-sm text-[#314158]">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Pricing tab (design: margins + prices + effective dates) ---------------- */

function PricingSection() {
  return (
    <FieldGrid>
      <FieldWrap label="Cost Price">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="WSP Margin %">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="RSP Margin %">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="WSP ( Whole Sale Price )">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="RSP ( Retail Sale Price )">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="MRP ( Maximum Retail Price )">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
      <FieldWrap label="Price Effective From">
        <input
          type="date"
          placeholder="select Date"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20"
        />
      </FieldWrap>
      <FieldWrap label="Price Effective To">
        <input
          type="date"
          placeholder="select Date"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20"
        />
      </FieldWrap>
    </FieldGrid>
  )
}

/* ---------------- Tax tab (design: HSN + GST rate + tax group + cess) ---------------- */

function TaxSection() {
  return (
    <FieldGrid>
      <FieldWrap label="HSN Code" required>
        <TextInput placeholder="e.g. 8517 12 90" />
      </FieldWrap>
      <FieldWrap label="GST Rate" required>
        <SelectInput
          options={['0%', '5%', '12%', '18%', '28%']}
          placeholder="Select dropdown"
        />
      </FieldWrap>
      <FieldWrap label="Tax Group">
        <SelectInput
          options={['Electronics 18%', 'Apparel 12%', 'FMCG 18%', 'Grocery 5%']}
          placeholder="Select dropdown"
        />
      </FieldWrap>
      <FieldWrap label="CESS (%)">
        <TextInput type="number" value={0} onChange={() => {}} />
      </FieldWrap>
    </FieldGrid>
  )
}

/* ---------------- Images tab (design: drag & drop dropzone) ---------------- */

function ImagesSection() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 py-12">
      <div className="flex flex-col items-center gap-1 text-center">
        <ImagePlus size={28} className="mb-2 text-slate-400" />
        <p className="text-sm font-semibold text-[#314158]">Drag &amp; drop product images here</p>
        <p className="text-xs text-[#6B7A99]">Supports JPEG, PNG, WEBP up to 5MB each</p>
        <button
          type="button"
          className="mt-4 h-9 rounded-lg bg-[#155DFC] px-4 text-sm font-medium text-white transition hover:bg-[#1447E6]"
        >
          Browse Files
        </button>
      </div>
    </div>
  )
}

/* ---------------- History tab (design: Audit Trail list) ---------------- */

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
      <h3 className="mb-4 text-base font-semibold text-[#043793]">Audit Trail</h3>
      <div className="divide-y divide-slate-100">
        {AUDIT_TRAIL.map((entry) => (
          <div key={entry.title} className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#155DFC]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12h3l3-8 4 16 3-8h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#314158]">{entry.title}</p>
              <p className="mt-0.5 text-sm text-[#314158]">{entry.detail}</p>
              <p className="mt-0.5 text-sm text-[#6B7A99]">{entry.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Timeline tab (design: colored dot event list) ---------------- */

type TimelineEvent = {
  title: string
  date: string
  dot: string
}

const TIMELINE: TimelineEvent[] = [
  { title: 'Stock Received: 50 units (GRN-2501244)', date: 'Jan 14, 2025 09:15', dot: 'bg-emerald-500' },
  { title: 'Price Updated: ₹32,999 → ₹34,999', date: 'Jan 12, 2025 14:32', dot: 'bg-blue-500' },
  { title: 'Barcode Generated: EAN-13 #880609476…', date: 'Jan 10, 2025 11:20', dot: 'bg-fuchsia-500' },
  { title: 'Low Stock Alert: below reorder level', date: 'Jan 08, 2025 08:45', dot: 'bg-amber-500' },
  { title: 'Approval Granted by Arun Nair (Manager)', date: 'Jan 01, 2025 10:30', dot: 'bg-teal-500' },
  { title: 'Product Created by Arjun Sharma', date: 'Jan 01, 2025 10:00', dot: 'bg-slate-400' },
]

function TimelineSection() {
  return (
    <div className="relative">
      {/* Vertical guide line through the dots */}
      <span className="absolute top-2 bottom-2 left-[5px] w-px bg-slate-200" aria-hidden />
      <div className="space-y-5">
        {TIMELINE.map((event) => (
          <div key={event.title} className="relative flex gap-4 pl-0.5">
            <span className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${event.dot}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#314158]">{event.title}</p>
              <p className="mt-0.5 text-xs text-[#6B7A99]">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Footer (two variants per design) ---------------- */

function CreateFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-7 py-4">
      <button
        type="button"
        onClick={onClose}
        className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="button"
        className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
      >
        Save as Draft
      </button>
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white transition hover:bg-[#1447E6]"
      >
        <Check size={16} />
        Create Product
      </button>
    </div>
  )
}

function ViewFooter({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-7 py-4">
      <button
        type="button"
        onClick={onClose}
        className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
      >
        Close
      </button>
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-[#314158] transition hover:bg-slate-50"
      >
        <Printer size={15} />
        Print
      </button>
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white transition hover:bg-[#1447E6]"
      >
        <SquarePen size={15} />
        Edit Product
      </button>
    </div>
  )
}

/* ---------------- Drawer root ---------------- */

type Props = {
  isOpen: boolean
  onClose: () => void
  /** When set, the drawer shows the product detail view (History/Timeline, Edit footer). */
  product?: Product | null
}

export default function CreateProductDrawer({ isOpen, onClose, product }: Props) {
  const [activeTab, setActiveTab] = useState<DrawerTabKey>('general')
  const isView = !!product

  const tabs = isView ? VIEW_TABS : FORM_TABS
  const current = tabs.includes(activeTab) ? activeTab : 'general'

  const sectionMap: Record<DrawerTabKey, React.ReactNode> = {
    general: <GeneralSection />,
    inventory: <InventorySection />,
    pricing: <PricingSection />,
    tax: <TaxSection />,
    images: <ImagesSection />,
    history: <HistorySection />,
    timeline: <TimelineSection />,
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="product">
      {/* Header (design: big blue title + subtitle, bare × at top-right) */}
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#043793]">
            {isView ? product!.productName : 'Create New Product'}
          </h2>
          <p className="mt-1 text-sm text-[#6B7A99]">
            {isView
              ? `${product!.productCode} · ${product!.department} · ${product!.brand}`
              : 'Fill in the details to add a new product to the catalog'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 text-slate-400 transition hover:text-slate-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <DrawerTabBar active={current} onChange={setActiveTab} tabs={tabs} />

      {/* Scrollable body is provided by the shared Drawer; keep rhythm tight */}
      <div className="px-7 py-6">{sectionMap[current]}</div>

      {isView ? (
        <ViewFooter onClose={onClose} />
      ) : (
        <CreateFooter onClose={onClose} />
      )}
    </Drawer>
  )
}
