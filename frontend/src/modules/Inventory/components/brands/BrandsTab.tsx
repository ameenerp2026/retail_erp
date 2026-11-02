import { useMemo, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Pencil,
  Plus,
  Trash2,
  Upload,
  Download,
  Globe,
  Box,
  FileSpreadsheet,
  X,
  Image,
  Check,
  ChevronDown,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { inventorySetupService } from '@/services/inventorySetupService'
import type { Brand, ProductStatus } from '@/types/inventorySetup'
import { Modal } from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from 'react-hot-toast'

const AVATAR_COLORS = [
  'bg-[#2563EB]',
  'bg-[#4F46E5]',
  'bg-[#9333EA]',
  'bg-[#0D9488]',
  'bg-[#10B981]',
  'bg-[#F59E0B]',
  'bg-[#E11D48]',
  'bg-[#0284C7]',
  'bg-[#EA580C]',
  'bg-[#059669]',
  'bg-[#DC2626]',
  'bg-[#475569]',
]

function CreateBrandDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  initialData: Brand | null
  onSave: (brand: Brand) => void
}) {
  const isEdit = !!initialData
  // State is initialized from the brand being edited; the parent passes a `key`
  // that changes on every open, so the drawer remounts and re-seeds cleanly.
  const [code, setCode] = useState(initialData?.code ?? '')
  const [name, setName] = useState(initialData?.name ?? '')
  const [country, setCountry] = useState(initialData?.country ?? '')
  const [status, setStatus] = useState<string>(initialData?.status ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl ?? null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be under 2MB')
        return
      }
      setLogoFile(file)
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a Brand Name')
      return
    }
    if (!code.trim()) {
      toast.error('Please enter a Brand Code')
      return
    }

    const color =
      initialData?.color ||
      AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

    const newBrand: Brand = {
      id: initialData?.id || `brand-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      country: country.trim() || 'Global',
      description: description.trim() || 'Brand manufacturer and distributor',
      productCount: initialData?.productCount || 0,
      status: (status as ProductStatus) || 'Active',
      websiteUrl: websiteUrl.trim(),
      logoUrl: logoPreview || undefined,
      color,
      textColor: 'text-white',
    }

    onSave(newBrand)
    toast.success(
      isEdit
        ? `Brand "${newBrand.name}" updated`
        : `Brand "${newBrand.name}" created`
    )
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-[580px] flex-col bg-white shadow-2xl border-l border-slate-200/90 animate-slide-in-right">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 px-7 py-5 shrink-0">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0F3F91]">
                {isEdit ? 'Edit Brand' : 'Create New Brand'}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Configure brand details and metadata
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 space-y-4.5 overflow-y-auto px-7 py-5">
            {/* Row 1: Brand Code & Brand Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Brand Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAMSUNG"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Unique identifier, uppercase
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samsung Electronics"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!code) {
                      setCode(e.target.value.slice(0, 6).toUpperCase())
                    }
                  }}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
                />
              </div>
            </div>

            {/* Row 2: Country of Origin & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Country of Origin <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC] cursor-pointer ${
                      !country ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    <option value="" disabled>
                      Select dropdown
                    </option>
                    <option value="South Korea">South Korea</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="China">China</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Global">Global / Other</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC] cursor-pointer ${
                      !status ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    <option value="" disabled>
                      Select dropdown
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-800">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brand description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 min-h-[85px] w-full resize-none rounded-lg border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
              />
            </div>

            {/* Row 4: Brand Logo Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-800">
                Brand Logo
              </label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="mt-1.5 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/90 bg-white p-7 text-center transition hover:border-[#155DFC]/50 cursor-pointer"
              >
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {logoPreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-12 w-12 rounded-lg object-contain border border-slate-200"
                    />
                    <div className="text-left">
                      <p className="text-xs font-medium text-slate-800 truncate max-w-[200px]">
                        {logoFile ? logoFile.name : 'Brand Logo'}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLogoFile(null)
                          setLogoPreview(null)
                        }}
                        className="text-[11px] text-red-500 hover:underline mt-0.5 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image size={24} className="text-slate-400" />
                    <p className="mt-2 text-xs text-slate-600">
                      Upload brand logo (PNG, SVG, max 2MB)
                    </p>
                    <span className="mt-1 text-xs font-semibold text-[#155DFC] hover:underline">
                      Browse
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Row 5: Website URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-800">
                Website URL
              </label>
              <input
                type="text"
                placeholder="https://www.brand.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-7 py-4 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-[#155DFC] px-5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7] cursor-pointer"
            >
              <Check size={14} className="text-white" strokeWidth={2.5} />
              <span>{isEdit ? 'Save Changes' : 'Create Brand'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

function ImportBrandsModal({
  isOpen,
  onClose,
  onImportSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (imported: Brand[]) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Code,Country,Description,Status\n' +
      'Google,GOOGLE,United States,Internet and tech company,Active\n' +
      'Sony,SONY,Japan,Consumer electronics,Active\n'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'brands_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Sample template downloaded')
  }

  const handleProcessImport = () => {
    if (!file) {
      toast.error('Please select a CSV or Excel file to import')
      return
    }

    const mockImported: Brand[] = [
      {
        id: `imported-${Date.now()}-1`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        code: file.name.slice(0, 4).toUpperCase(),
        description: 'Imported from spreadsheet data file',
        country: 'Global',
        productCount: 12,
        status: 'Active',
        color: 'bg-[#2563EB]',
        textColor: 'text-white',
      },
    ]

    onImportSuccess(mockImported)
    toast.success(`Successfully imported brands from ${file.name}`)
    setFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-[#043793]">Import Brands</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Upload CSV or Excel file to batch import brands.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            if (e.dataTransfer.files?.[0]) {
              setFile(e.dataTransfer.files[0])
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
            isDragging
              ? 'border-[#155DFC] bg-blue-50/50'
              : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              if (e.target.files?.[0]) setFile(e.target.files[0])
            }}
            className="hidden"
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#155DFC]">
            <Upload size={22} />
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Supports CSV, XLSX up to 10MB
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need the correct column format?</span>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1 font-semibold text-[#155DFC] hover:underline cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            Download Sample Template
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-[#314158] hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleProcessImport}
          className="h-10 rounded-lg bg-[#155DFC] px-5 text-sm font-medium text-white hover:bg-[#1447E6] cursor-pointer"
        >
          Import Brands
        </button>
      </div>
    </Modal>
  )
}

const BRAND_COLORS: Record<string, string> = {
  samsung: '#3478F6',
  apple: '#FF9800',
  nike: '#625BFF',
  dove: '#B23EFF',
  bosch: '#00BFA5',
  levi: '#00B884',
  levis: '#00B884',
  'levi strauss': '#00B884',
  hindustan: '#FF2D55',
  hul: '#FF2D55',
  unilever: '#FF2D55',
  sony: '#00BCD4',
  adidas: '#FF6D00',
  itc: '#00C853',
  cipla: '#FF3D57',
  lg: '#5C6B73',
  aashirvaad: '#FF7A00',
  parker: '#5C6B73',
  voltaren: '#00BFA5',
  syska: '#FF9800',
}

const FALLBACK_BRAND_COLORS = [
  '#3478F6',
  '#625BFF',
  '#B23EFF',
  '#00BFA5',
  '#00B884',
  '#FF9800',
  '#FF2D55',
  '#00BCD4',
  '#FF6D00',
  '#00C853',
  '#FF3D57',
  '#5C6B73',
]

function getBrandColor(name: string, code?: string): string {
  const normalized = (name || '').toLowerCase()
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (normalized.includes(key)) return color
  }
  if (code) {
    const codeNormalized = code.toLowerCase()
    for (const [key, color] of Object.entries(BRAND_COLORS)) {
      if (codeNormalized.includes(key)) return color
    }
  }
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash |= 0
  }
  return FALLBACK_BRAND_COLORS[Math.abs(hash) % FALLBACK_BRAND_COLORS.length]
}

function BrandCard({
  brand,
  onEdit,
  onDelete,
}: {
  brand: Brand
  onEdit: (b: Brand) => void
  onDelete: (b: Brand) => void
}) {
  const initial = brand.name?.trim()?.charAt(0)?.toUpperCase() || 'B'

  return (
    <div
      onClick={() => onEdit(brand)}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-none transition hover:border-slate-300 hover:shadow-xs cursor-pointer"
    >
      <div>
        {/* Top row: Avatar & Status Badge */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-[7.5px] text-[13px] font-bold leading-none text-white select-none"
            style={{ backgroundColor: getBrandColor(brand.name, brand.code) }}
          >
            {initial}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick action buttons on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(brand)
                }}
                title="Edit Brand"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <Pencil size={12} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(brand)
                }}
                title="Delete Brand"
                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {brand.status === 'Active' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Brand Name */}
        <h4 className="mt-3 truncate text-sm font-bold tracking-tight text-slate-900 group-hover:text-[#155DFC] transition-colors">
          {brand.name}
        </h4>

        {/* Brand Code */}
        <div className="mt-0.5 text-xs font-semibold tracking-wide text-[#155DFC]">
          {brand.code}
        </div>

        {/* Description */}
        <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 min-h-[34px]">
          {brand.description}
        </p>
      </div>

      <div>
        {/* Meta row: Country & Products count */}
        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Globe size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{brand.country || 'Global'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Box size={13} className="shrink-0 text-slate-400" />
            <span>{brand.productCount} products</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrandsTab() {
  const { data: serverBrands = [], isLoading } = useQuery({
    queryKey: ['inventory-setup-brands'],
    queryFn: inventorySetupService.getBrands,
  })

  // Local edits (add / edit / delete / import) overlaid on top of the server
  // list; `null` means the component still shows exactly what the server
  // returned. This replaces the previous effect that copied server data into
  // local state (a synchronous setState inside a hook body).
  const [localBrands, setLocalBrands] = useState<Brand[] | null>(null)
  const brands = localBrands ?? serverBrands
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)

  const currentBrands = brands.length > 0 ? brands : serverBrands

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return currentBrands
    return currentBrands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.country && b.country.toLowerCase().includes(q))
    )
  }, [currentBrands, search])

  const handleExport = () => {
    const headers = 'ID,Name,Code,Country,Products,Status,Description\n'
    const rows = filtered
      .map(
        (b) =>
          `"${b.id}","${b.name}","${b.code}","${b.country || ''}",${
            b.productCount
          },"${b.status}","${b.description.replace(/"/g, '""')}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `brands_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} brands to CSV`)
  }

  const handleSaveBrand = (brand: Brand) => {
    setLocalBrands((prev) => {
      const base = prev ?? serverBrands
      const exists = base.some((b) => b.id === brand.id)
      if (exists) {
        return base.map((b) => (b.id === brand.id ? brand : b))
      }
      return [brand, ...base]
    })
  }

  const handleDeleteBrand = () => {
    if (!deleteTarget) return
    setLocalBrands(
      (prev) => (prev ?? serverBrands).filter((b) => b.id !== deleteTarget.id),
    )
    toast.success(`Brand "${deleteTarget.name}" deleted`)
    setDeleteTarget(null)
  }

  const handleImportBrands = (newBrands: Brand[]) => {
    setLocalBrands((prev) => [...newBrands, ...(prev ?? serverBrands)])
  }

  return (
    <div className="space-y-4">
      {/* Brands Header Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold leading-tight text-slate-900">
              Brands
            </h2>
            <span className="text-xs text-slate-400">
              {filtered.length} records
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-44 sm:w-52 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#155DFC] focus:outline-none focus:ring-1 focus:ring-[#155DFC]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Upload size={13} className="text-slate-500" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingBrand(null)
              setCreateOpen(true)
            }}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#155DFC] px-3.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1048c7] cursor-pointer"
          >
            <Plus size={14} className="text-white" />
            <span>New Brand</span>
          </button>
        </div>
      </div>

      {/* Grid of Brand Cards (4 columns on desktop) */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-xl bg-slate-50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={(b) => {
                setEditingBrand(b)
                setCreateOpen(true)
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Brand Drawer */}
      <CreateBrandDrawer
        key={`${createOpen ? editingBrand?.id ?? 'new' : 'closed'}-${editingBrand?.code ?? ''}`}
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setEditingBrand(null)
        }}
        initialData={editingBrand}
        onSave={handleSaveBrand}
      />

      {/* Import Modal */}
      <ImportBrandsModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImportSuccess={handleImportBrands}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBrand}
      />
    </div>
  )
}