import { useEffect, useRef, useState } from 'react'
import { Activity, AlertTriangle, Check, ImagePlus, Printer, SquarePen, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Drawer from '@/components/shared/Drawer'
import { FieldWrap, SelectInput, TextInput, Toggle } from '../shared/formControls'
import SectionLabel from '../shared/SectionLabel'
import type { Product } from '@/types/inventorySetup'
import { MOCK_HIERARCHY, MOCK_PRODUCTS, MOCK_TAX_CONFIGS } from '@/mocks/inventorySetup.mock'

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
const CREATE_TABS: DrawerTabKey[] = ['general', 'inventory', 'pricing', 'tax', 'images']
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
const BRAND_OPTIONS = ['Samsung', 'Nike', 'Dove', 'Bosch', 'Levis', 'Voltaren', 'Apple', 'HUL', 'Syska', 'Sony', 'ITC', 'Cipla']
const UOM_OPTIONS = ['PCS', 'BTL', 'TUB', 'PKT', 'KGS', 'STR']
const VENDOR_OPTIONS = [
  'Samsung India Pvt Ltd',
  'Redington India',
  'Distributor Hub Mumbai',
  'Nike Sports India',
  'HUL Distribution Ltd',
]
const ATTRIBUTE_OPTIONS = ['Color', 'Size', 'Material', 'Warranty', 'Storage', 'Fit', 'Capacity', 'RAM']

/* ---------------- Form State Type ---------------- */

type ProductFormData = {
  productCode: string
  oemCode: string
  productName: string
  group: string
  department: string
  section: string
  brand: string
  uom: string
  vendor: string
  attributes: string[]
  status: Product['status']
}

type RequiredGeneralField = 'productName' | 'group' | 'department' | 'uom' | 'status'
type GeneralErrors = Partial<Record<RequiredGeneralField, string>>

type PricingData = {
  costPrice: string
  wspMargin: string
  rspMargin: string
  wsp: string
  rsp: string
  mrp: string
  effectiveFrom: string
  effectiveTo: string
}

type InventoryData = {
  trackBatch: boolean
  trackSerial: boolean
  trackExpiry: boolean
  shelfLife: string
  reorderLevel: string
  allowNegativeStock: boolean
}

type SelectedImage = {
  file: File
  previewUrl: string
}

const INITIAL_ATTRIBUTES = ['', '', '', '']

const createInitialFormData = (product?: Product | null): ProductFormData => ({
  productCode: product?.productCode ?? '',
  oemCode: product?.prdCode ?? '',
  productName: product?.productName ?? '',
  group: product?.group ?? '',
  department: product?.department ?? '',
  section: product?.section ?? '',
  brand: product?.brand ?? '',
  uom: product?.uom ?? '',
  vendor: '',
  attributes: [...INITIAL_ATTRIBUTES],
  status: product?.status ?? 'Active',
})

const createInitialPricingData = (product?: Product | null): PricingData => ({
  costPrice: product ? String(product.costPrice ?? product.cost ?? '') : '',
  wspMargin: '',
  rspMargin: '',
  wsp: '',
  rsp: product ? String(product.sellingPrice ?? '') : '',
  mrp: product ? String(product.mrp ?? '') : '',
  effectiveFrom: '',
  effectiveTo: '',
})

const INITIAL_INVENTORY_DATA: InventoryData = {
  trackBatch: false,
  trackSerial: false,
  trackExpiry: false,
  shelfLife: '',
  reorderLevel: '',
  allowNegativeStock: false,
}

const formatHsnCode = (value: string): string => {
  const digits = value.replace(/\s/g, '')
  if (digits.length <= 4) return digits
  const trailingDigits = digits.slice(4).match(/.{1,2}/g) ?? []
  return [digits.slice(0, 4), ...trailingDigits].join(' ')
}

const getPricingErrors = (pricing: PricingData) => {
  const rsp = Number(pricing.rsp)
  const mrp = Number(pricing.mrp)
  return {
    mrp:
      pricing.rsp !== '' &&
      pricing.mrp !== '' &&
      Number.isFinite(rsp) &&
      Number.isFinite(mrp) &&
      mrp < rsp
        ? 'MRP cannot be lower than RSP'
        : undefined,
    effectiveTo:
      pricing.effectiveFrom &&
      pricing.effectiveTo &&
      pricing.effectiveTo < pricing.effectiveFrom
        ? 'Price Effective To cannot be before Price Effective From'
        : undefined,
  }
}

/* ---------------- General Tab (Figma Screenshot 2) ---------------- */

function GeneralSection({
  formData,
  setFormData,
  errors,
  setErrors,
}: {
  formData: ProductFormData
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>
  errors: GeneralErrors
  setErrors: React.Dispatch<React.SetStateAction<GeneralErrors>>
}) {
  const updateField = (
    key: Exclude<keyof ProductFormData, 'attributes' | 'status'>,
    val: string,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }
  const clearError = (key: RequiredGeneralField) =>
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  const groupNode = MOCK_HIERARCHY.find((node) => node.name === formData.group)
  const departmentOptions = groupNode ? [groupNode.name] : []
  const sectionOptions = [
    ...new Set([
      ...(MOCK_HIERARCHY.find((node) => node.name === formData.department)?.children.map(
        (node) => node.name,
      ) ?? []),
      ...MOCK_PRODUCTS.filter((product) => product.department === formData.department).map(
        (product) => product.section,
      ),
    ]),
  ]

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

        <FieldWrap label="OEM Code">
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
            onChange={(v) => {
              updateField('productName', v)
              clearError('productName')
            }}
          />
          {errors.productName && (
            <p className="text-xs text-red-600">{errors.productName}</p>
          )}
        </FieldWrap>

        <FieldWrap label="Group" required>
          <SelectInput
            options={GROUP_OPTIONS}
            value={formData.group}
            placeholder="Select dropdown"
            onChange={(v) => {
              setFormData((previous) => ({
                ...previous,
                group: v,
                department: '',
                section: '',
              }))
              clearError('group')
              clearError('department')
            }}
          />
          {errors.group && <p className="text-xs text-red-600">{errors.group}</p>}
        </FieldWrap>

        {/* Row 3 */}
        <FieldWrap label="Department" required>
          <SelectInput
            options={departmentOptions}
            value={formData.department}
            placeholder="Select dropdown"
            disabled={!formData.group}
            onChange={(v) => {
              setFormData((previous) => ({ ...previous, department: v, section: '' }))
              clearError('department')
            }}
          />
          {errors.department && <p className="text-xs text-red-600">{errors.department}</p>}
        </FieldWrap>

        <FieldWrap label="Section">
          <SelectInput
            options={sectionOptions}
            value={formData.section}
            placeholder="Select dropdown"
            disabled={!formData.department}
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
          {errors.uom && <p className="text-xs text-red-600">{errors.uom}</p>}
        </FieldWrap>

        {/* Row 5 */}
        <FieldWrap label="Select Vendor">
          <SelectInput
            options={VENDOR_OPTIONS}
            value={formData.vendor}
            placeholder="Select dropdown"
            onChange={(v) => updateField('vendor', v)}
          />
        </FieldWrap>

        {formData.attributes.map((attribute, index) => (
          <FieldWrap key={`attribute-${index}`} label={`Attribute ${index + 1}`}>
            <SelectInput
              options={ATTRIBUTE_OPTIONS}
              value={attribute}
              placeholder="Select dropdown"
              onChange={(value) =>
                setFormData((previous) => ({
                  ...previous,
                  attributes: previous.attributes.map((item, itemIndex) =>
                    itemIndex === index ? value : item,
                  ),
                }))
              }
            />
          </FieldWrap>
        ))}

        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setFormData((previous) => ({
                ...previous,
                attributes: [...previous.attributes, ''],
              }))
            }
            className="text-xs font-medium text-[#2563EB] hover:underline"
          >
            + Add Attribute
          </button>
        </div>

        <FieldWrap label="Status" required>
          <SelectInput
            options={['Active', 'Inactive']}
            value={formData.status}
            placeholder="Select dropdown"
            onChange={(value) => {
              setFormData((previous) => ({
                ...previous,
                status: value === 'Inactive' ? 'Inactive' : 'Active',
              }))
              clearError('status')
            }}
          />
          {errors.status && <p className="text-xs text-red-600">{errors.status}</p>}
        </FieldWrap>
      </FieldGrid>
    </div>
  )
}

/* ---------------- Inventory Tab ---------------- */

function InventorySection({
  inventory,
  setInventory,
}: {
  inventory: InventoryData
  setInventory: React.Dispatch<React.SetStateAction<InventoryData>>
}) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>TRACKING CONFIGURATION</SectionLabel>
        <div className="mt-3 space-y-3">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block text-xs font-medium text-slate-700">Track by batch</span>
              <span className="mt-1 block text-[11px] text-slate-500">
                Require batch numbers during GRN and opening stock receipts.
              </span>
            </span>
            <Toggle
              checked={inventory.trackBatch}
              onChange={(checked) =>
                setInventory((previous) => ({
                  ...previous,
                  trackBatch: checked,
                  trackExpiry: checked && previous.trackExpiry,
                }))
              }
            />
          </label>
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block text-xs font-medium text-slate-700">Track serial numbers</span>
              <span className="mt-1 block text-[11px] text-slate-500">
                Capture a unique serial number for every received unit when enabled.
              </span>
            </span>
            <Toggle
              checked={inventory.trackSerial}
              onChange={(checked) =>
                setInventory((previous) => ({ ...previous, trackSerial: checked }))
              }
            />
          </label>
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-slate-700">Track expiry</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                  Requires batch tracking
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Request an expiry date during stock receipt.
              </p>
            </div>
            <fieldset
              disabled={!inventory.trackBatch}
              className="shrink-0 border-0 p-0 disabled:opacity-50"
            >
              <Toggle
                checked={inventory.trackExpiry}
                onChange={(checked) =>
                  setInventory((previous) => ({ ...previous, trackExpiry: checked }))
                }
              />
            </fieldset>
          </label>
        </div>
      </div>

      <div>
        <SectionLabel>STOCK CONFIGURATION</SectionLabel>
        <div className="mt-3">
          <FieldGrid>
            <div>
              <FieldWrap label="Shelf life (days)">
                <TextInput
                  type="number"
                  placeholder="0"
                  value={inventory.shelfLife}
                  onChange={(value) =>
                    setInventory((previous) => ({ ...previous, shelfLife: value }))
                  }
                />
              </FieldWrap>
              <p className="mt-1 text-[11px] text-slate-500">
                Suggest expiry date from manufacture date during GRN.
              </p>
            </div>
            <div>
              <FieldWrap label="Reorder level">
                <div className="flex items-center gap-2">
                  <TextInput
                    type="number"
                    placeholder="0"
                    value={inventory.reorderLevel}
                    onChange={(value) =>
                      setInventory((previous) => ({ ...previous, reorderLevel: value }))
                    }
                  />
                  <span className="text-xs text-slate-500">units</span>
                </div>
              </FieldWrap>
              <p className="mt-1 text-[11px] text-slate-500">
                Trigger a low-stock alert at or below this quantity.
              </p>
            </div>
          </FieldGrid>
        </div>
      </div>

      <div>
        <SectionLabel>STOCK POLICY</SectionLabel>
        <div className="mt-3">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block text-xs font-medium text-slate-700">Allow negative stock</span>
              <span className="mt-1 block text-[11px] text-slate-500">
                Prevent transactions that would take stock below zero.
              </span>
            </span>
            <Toggle
              checked={inventory.allowNegativeStock}
              onChange={(checked) =>
                setInventory((previous) => ({ ...previous, allowNegativeStock: checked }))
              }
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-700">
        Batch, serial and expiry values are entered during GRN or Opening Stock—not in Product
        Setup.
      </div>
    </div>
  )
}

/* ---------------- Pricing Tab ---------------- */

function PricingSection({
  pricing,
  setPricing,
}: {
  pricing: PricingData
  setPricing: React.Dispatch<React.SetStateAction<PricingData>>
}) {
  const errors = getPricingErrors(pricing)

  const updateField = (key: keyof PricingData, value: string) =>
    setPricing((previous) => ({ ...previous, [key]: value }))

  return (
    <FieldGrid>
      <FieldWrap label="Cost Price">
        <TextInput
          type="number"
          placeholder="0"
          value={pricing.costPrice}
          onChange={(value) => updateField('costPrice', value)}
        />
      </FieldWrap>
      <FieldWrap label="WSP Margin %">
        <TextInput
          type="number"
          placeholder="0"
          value={pricing.wspMargin}
          onChange={(value) => updateField('wspMargin', value)}
        />
      </FieldWrap>
      <FieldWrap label="RSP Margin %">
        <TextInput
          type="number"
          placeholder="0"
          value={pricing.rspMargin}
          onChange={(value) => updateField('rspMargin', value)}
        />
      </FieldWrap>
      <FieldWrap label="WSP (Wholesale Price)">
        <TextInput
          type="number"
          placeholder="0"
          value={pricing.wsp}
          onChange={(value) => updateField('wsp', value)}
        />
      </FieldWrap>
      <FieldWrap label="RSP (Retail Sale Price)">
        <TextInput
          type="number"
          placeholder="0"
          value={pricing.rsp}
          onChange={(value) => updateField('rsp', value)}
        />
      </FieldWrap>
      <div>
        <FieldWrap label="MRP (Maximum Retail Price)">
          <TextInput
            type="number"
            placeholder="0"
            value={pricing.mrp}
            onChange={(value) => updateField('mrp', value)}
          />
        </FieldWrap>
        {errors.mrp && <p className="mt-1 text-xs text-red-600">{errors.mrp}</p>}
      </div>
      <FieldWrap label="Price Effective From">
        <TextInput
          type="date"
          placeholder="select Date"
          value={pricing.effectiveFrom}
          onChange={(value) => updateField('effectiveFrom', value)}
        />
      </FieldWrap>
      <div>
        <FieldWrap label="Price Effective To">
          <TextInput
            type="date"
            placeholder="select Date"
            value={pricing.effectiveTo}
            onChange={(value) => updateField('effectiveTo', value)}
          />
        </FieldWrap>
        {errors.effectiveTo && (
          <p className="mt-1 text-xs text-red-600">{errors.effectiveTo}</p>
        )}
      </div>
    </FieldGrid>
  )
}

/* ---------------- Tax Tab ---------------- */

function TaxSection({
  hsnCode,
  onHsnCodeChange,
  error,
}: {
  hsnCode: string
  onHsnCodeChange: (value: string) => void
  error?: string
}) {
  const taxConfig = MOCK_TAX_CONFIGS.find(
    (tax) => tax.hsnSac.replace(/\s/g, '') === hsnCode.replace(/\s/g, ''),
  )
  const taxOptions = MOCK_TAX_CONFIGS.map((tax) => ({
    value: tax.hsnSac,
    label: formatHsnCode(tax.hsnSac),
  }))
  if (hsnCode && !taxConfig) {
    taxOptions.unshift({ value: hsnCode, label: formatHsnCode(hsnCode) })
  }

  return (
    <FieldGrid>
      <FieldWrap label="HSN Code" required>
        <SelectInput
          options={taxOptions}
          value={taxConfig?.hsnSac ?? hsnCode}
          placeholder="Select dropdown"
          onChange={onHsnCodeChange}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </FieldWrap>
      <FieldWrap label="GST Rate" required>
        <TextInput type="text" value={taxConfig ? `${taxConfig.igst}%` : ''} disabled />
        <p className="text-[11px] text-slate-400">From the selected HSN code</p>
      </FieldWrap>
      <FieldWrap label="CESS (%)">
        <TextInput type="text" value={taxConfig ? String(taxConfig.cess) : ''} disabled />
        <p className="text-[11px] text-slate-400">From the selected HSN code</p>
      </FieldWrap>
    </FieldGrid>
  )
}

/* ---------------- Images Tab ---------------- */

function ImagesSection({
  images,
  error,
  onFilesSelected,
  onRemoveImage,
}: {
  images: SelectedImage[]
  error: string | null
  onFilesSelected: (files: File[]) => void
  onRemoveImage: (previewUrl: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <div
        className="rounded-xl border-2 border-dashed border-slate-200 py-12"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          onFilesSelected(Array.from(event.dataTransfer.files))
        }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <ImagePlus size={28} className="mb-2 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">Drag &amp; drop product images here</p>
          <p className="text-xs text-slate-400">Supports JPEG, PNG, WEBP up to 5MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            aria-label="Choose product images"
            onChange={(event) => {
              onFilesSelected(Array.from(event.currentTarget.files ?? []))
              event.currentTarget.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 h-9 rounded-lg bg-[#2563EB] px-4 text-xs sm:text-sm font-medium text-white transition hover:bg-[#1D4ED8] cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-xs text-red-600">{error}</p>}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.previewUrl} className="relative">
              <img
                src={image.previewUrl}
                alt={image.file.name}
                className="h-28 w-full rounded-lg border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(image.previewUrl)}
                aria-label={`Remove ${image.file.name}`}
                className="absolute right-1 top-1 rounded-full bg-white p-1 text-slate-500 shadow hover:text-red-600"
              >
                <X size={14} />
              </button>
              <p className="mt-1 truncate text-xs text-slate-500">{image.file.name}</p>
            </div>
          ))}
        </div>
      )}
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
  const [activeTab, setActiveTab] = useState<DrawerTabKey>(product ? 'history' : 'general')
  const [formData, setFormData] = useState<ProductFormData>(() => createInitialFormData(product))
  const [pricing, setPricing] = useState<PricingData>(() => createInitialPricingData(product))
  const [inventory, setInventory] = useState<InventoryData>({ ...INITIAL_INVENTORY_DATA })
  const [generalErrors, setGeneralErrors] = useState<GeneralErrors>({})
  const [hsnError, setHsnError] = useState<string>()
  const [images, setImages] = useState<SelectedImage[]>([])
  const [imageError, setImageError] = useState<string | null>(null)
  const imageUrlsRef = useRef(new Set<string>())
  const selectedHsnCode = product?.hsnSac ?? ''
  const [hsnCode, setHsnCode] = useState(selectedHsnCode)
  const selectedTaxConfig = MOCK_TAX_CONFIGS.find(
    (tax) => tax.hsnSac.replace(/\s/g, '') === hsnCode.replace(/\s/g, ''),
  )

  useEffect(
    () => () => {
      imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      imageUrlsRef.current.clear()
    },
    [],
  )

  const tabs = product ? ALL_TABS : CREATE_TABS
  const current = activeTab

  const handleClose = () => {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    imageUrlsRef.current.clear()
    setImages([])
    setImageError(null)
    setGeneralErrors({})
    setHsnError(undefined)
    if (!product) {
      setFormData(createInitialFormData())
      setPricing(createInitialPricingData())
      setInventory({ ...INITIAL_INVENTORY_DATA })
      setHsnCode('')
      setActiveTab('general')
    }
    onClose()
  }

  const handleFilesSelected = (files: File[]) => {
    const acceptedImages: SelectedImage[] = []
    let hasInvalidFile = false

    files.forEach((file) => {
      const acceptedType = ['image/jpeg', 'image/png', 'image/webp'].includes(
        file.type.toLowerCase(),
      )
      if (!acceptedType || file.size > 5 * 1024 * 1024) {
        hasInvalidFile = true
        return
      }

      const previewUrl = URL.createObjectURL(file)
      imageUrlsRef.current.add(previewUrl)
      acceptedImages.push({ file, previewUrl })
    })

    if (acceptedImages.length > 0) setImages((previous) => [...previous, ...acceptedImages])
    setImageError(
      hasInvalidFile
        ? 'Choose JPEG, PNG, or WEBP images that are 5 MB or smaller.'
        : null,
    )
  }

  const handleRemoveImage = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl)
    imageUrlsRef.current.delete(previewUrl)
    setImages((previous) => previous.filter((image) => image.previewUrl !== previewUrl))
  }

  const handleSave = (isDraft: boolean) => {
    const nextGeneralErrors: GeneralErrors = {
      productName: formData.productName.trim() ? undefined : 'Product Name is required',
      group: formData.group ? undefined : 'Group is required',
      department: formData.department ? undefined : 'Department is required',
      uom: formData.uom ? undefined : 'UOM is required',
      status: formData.status ? undefined : 'Status is required',
    }
    const nextHsnError = selectedTaxConfig ? undefined : 'Select an HSN code'
    const pricingErrors = getPricingErrors(pricing)
    const hasGeneralErrors = Object.values(nextGeneralErrors).some(Boolean)
    const hasPricingErrors = Boolean(pricingErrors.mrp || pricingErrors.effectiveTo)

    setGeneralErrors(isDraft ? {} : nextGeneralErrors)
    setHsnError(isDraft ? undefined : nextHsnError)

    if (!isDraft && hasGeneralErrors) {
      setActiveTab('general')
      toast.error('Please complete the required fields')
      return
    }

    if (hasPricingErrors) {
      setActiveTab('pricing')
      toast.error('Please correct the pricing errors')
      return
    }

    if (!isDraft && nextHsnError) {
      setActiveTab('tax')
      toast.error('Please complete the required fields')
      return
    }

    if (isDraft) {
      toast.success('Product saved as draft')
      handleClose()
      return
    }

    const now = Date.now()
    const newCode = `PRD-${String(now).slice(-4)}`
    toast.success('Product created successfully!')
    // TODO: Replace the local callback with the Products API call when available.
    onProductCreated?.({
      id: String(now),
      productCode: newCode,
      prdCode: formData.oemCode || undefined,
      productName: formData.productName,
      group: formData.group,
      department: formData.department,
      section: formData.section,
      brand: formData.brand,
      uom: formData.uom,
      hsnSac: selectedTaxConfig?.hsnSac ?? '',
      costPrice: Number(pricing.costPrice) || 0,
      sellingPrice: Number(pricing.rsp) || 0,
      mrp: Number(pricing.mrp) || 0,
      stock: 0,
      imageCount: images.length,
      status: formData.status,
    })
    handleClose()
  }

  const sectionMap: Record<DrawerTabKey, React.ReactNode> = {
    general: (
      <GeneralSection
        formData={formData}
        setFormData={setFormData}
        errors={generalErrors}
        setErrors={setGeneralErrors}
      />
    ),
    inventory: <InventorySection inventory={inventory} setInventory={setInventory} />,
    pricing: <PricingSection pricing={pricing} setPricing={setPricing} />,
    tax: (
      <TaxSection
        hsnCode={hsnCode}
        onHsnCodeChange={(value) => {
          setHsnCode(value)
          setHsnError(undefined)
        }}
        error={hsnError}
      />
    ),
    images: (
      <ImagesSection
        images={images}
        error={imageError}
        onFilesSelected={handleFilesSelected}
        onRemoveImage={handleRemoveImage}
      />
    ),
    history: <HistorySection />,
    timeline: <TimelineSection />,
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="productDetail" raw>
      <div className="flex flex-col h-full bg-white select-none">
        {/* Header - Unified seamlessly with Tab Bar without separating border */}
        <div className="flex-shrink-0 flex items-start justify-between px-6 pt-5 pb-3 bg-white">
          <div>
            <h2 className="text-[20px] font-bold text-[#0F2A66] leading-tight tracking-tight">
              {isView
                ? (product?.productName || 'Samsung Galaxy A54 5G')
                : 'Create New Product'}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500 font-normal leading-normal">
              {isView
                ? `${product?.productCode || 'ELE-SAM-A54'} · ${product?.category || product?.department || product?.group || 'Electronics'} · ${product?.brand || 'Samsung'}`
                : 'Fill in the details to add a new product to the catalog'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
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
        {isView ? (
          <ViewFooter onClose={handleClose} onEdit={() => setActiveTab('general')} />
        ) : (
          <CreateFooter
            onClose={handleClose}
            onCreate={() => handleSave(false)}
            onSaveDraft={() => handleSave(true)}
          />
        )}
      </div>
    </Drawer>
  )
}